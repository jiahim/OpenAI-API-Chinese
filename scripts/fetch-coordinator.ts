export interface FetchPolicy {
  maxRetries: number;
  requestIntervalMaxMs: number;
  requestIntervalMinMs: number;
  requestTimeoutMs: number;
  retryBaseDelayMs: number;
  retryJitterMs: number;
  retryMaxDelayMs: number;
  vercelMitigationCooldownMs: number;
}

export interface FetchRuntime {
  fetch: typeof globalThis.fetch;
  now: () => number;
  random: () => number;
  sleep: (milliseconds: number) => Promise<void>;
}

export interface FetchLogger {
  error: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
}

export interface TextFetchResult {
  content: string;
  contentType?: string;
  etag?: string;
  lastModified?: string;
}

interface MitigationState {
  done: Promise<Error | undefined>;
  finish: (error?: Error) => void;
  owner: symbol;
  sourceUrl: string;
}

const USER_AGENT = "OpenAI-API-Chinese/2.0 source-sync";

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

const DEFAULT_RUNTIME: FetchRuntime = {
  fetch: (input, init) => globalThis.fetch(input, init),
  now: Date.now,
  random: Math.random,
  sleep: defaultSleep,
};

const DEFAULT_LOGGER: FetchLogger = {
  error: console.error,
  info: console.log,
  warn: console.warn,
};

function boundedRandomInteger(minimum: number, maximum: number, random: number): number {
  if (maximum <= minimum) return minimum;
  const normalized = Math.min(Math.max(random, 0), 1 - Number.EPSILON);
  return minimum + Math.floor(normalized * (maximum - minimum + 1));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function formatDelay(milliseconds: number): string {
  if (milliseconds < 1_000) return `${milliseconds}ms`;
  return `${(milliseconds / 1_000).toFixed(milliseconds % 1_000 === 0 ? 0 : 1)}s`;
}

export function parseRetryAfterMs(
  rawValue: string | null,
  nowMilliseconds: number,
): number | undefined {
  if (!rawValue) return undefined;
  const trimmed = rawValue.trim();
  if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
    const seconds = Number(trimmed);
    return Number.isFinite(seconds) ? Math.max(0, Math.ceil(seconds * 1_000)) : undefined;
  }
  const timestamp = Date.parse(trimmed);
  if (!Number.isFinite(timestamp)) return undefined;
  return Math.max(0, timestamp - nowMilliseconds);
}

export function calculateRetryDelay(
  retryIndex: number,
  policy: Pick<
    FetchPolicy,
    "retryBaseDelayMs" | "retryJitterMs" | "retryMaxDelayMs"
  >,
  random: number,
  retryAfterMs?: number,
): number {
  const exponential = policy.retryBaseDelayMs * 2 ** retryIndex;
  const jitter = boundedRandomInteger(0, policy.retryJitterMs, random);
  const locallyBounded = Math.min(exponential + jitter, policy.retryMaxDelayMs);
  return Math.max(locallyBounded, retryAfterMs ?? 0);
}

export class HttpError extends Error {
  readonly retryAfterMs?: number;
  readonly status: number;
  readonly url: string;
  readonly vercelMitigated: boolean;

  constructor(
    status: number,
    url: string,
    options: { retryAfterMs?: number; vercelMitigated?: boolean } = {},
  ) {
    super(`HTTP ${status}: ${url}`);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
    this.vercelMitigated = options.vercelMitigated ?? false;
    if (options.retryAfterMs !== undefined) this.retryAfterMs = options.retryAfterMs;
  }

  get retryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }
}

export class FetchCoordinator {
  private fatalError: Error | undefined;
  private mitigation: MitigationState | undefined;
  private nextRequestAt = 0;
  private startLock: Promise<void> = Promise.resolve();
  private readonly logger: FetchLogger;
  private readonly policy: FetchPolicy;
  private readonly runtime: FetchRuntime;

  constructor(
    policy: FetchPolicy,
    options: {
      logger?: Partial<FetchLogger>;
      runtime?: Partial<FetchRuntime>;
    } = {},
  ) {
    this.policy = policy;
    this.runtime = { ...DEFAULT_RUNTIME, ...options.runtime };
    this.logger = { ...DEFAULT_LOGGER, ...options.logger };
  }

  async fetchText(url: string): Promise<TextFetchResult> {
    const requestOwner = Symbol(url);
    let retryIndex = 0;

    while (true) {
      let response: Response;
      try {
        response = await this.startRequest(url, requestOwner);
      } catch (error) {
        this.finishProbeIfNeeded(requestOwner);
        retryIndex = await this.waitForNetworkRetry(error, url, retryIndex);
        continue;
      }

      const httpError = response.ok ? undefined : this.httpError(response, url);
      if (httpError) void response.body?.cancel().catch(() => undefined);
      const ownsProbe = this.mitigation?.owner === requestOwner;
      if (ownsProbe) {
        if (httpError?.vercelMitigated) {
          const fatal = new Error(
            `Vercel 全局熔断：冷却后探测仍收到 HTTP 403 x-vercel-mitigated=deny：${url}`,
          );
          this.failMitigation(fatal);
          this.logger.error(`最终失败 [circuit-breaker] ${fatal.message}`);
          throw fatal;
        }
        this.finishProbeIfNeeded(requestOwner);
      }

      if (!httpError) {
        let content: string;
        try {
          content = await response.text();
        } catch (error) {
          retryIndex = await this.waitForNetworkRetry(error, url, retryIndex);
          continue;
        }
        const result: TextFetchResult = { content };
        const contentType = response.headers.get("content-type");
        const etag = response.headers.get("etag");
        const lastModified = response.headers.get("last-modified");
        if (contentType) result.contentType = contentType;
        if (etag) result.etag = etag;
        if (lastModified) result.lastModified = lastModified;
        return result;
      }

      if (httpError.vercelMitigated) {
        await this.handleMitigation(httpError, requestOwner);
        continue;
      }

      if (!httpError.retryable || retryIndex >= this.policy.maxRetries) {
        this.logger.error(
          `最终失败 [http=${httpError.status}] ${url}：已重试 ${retryIndex}/${this.policy.maxRetries}`,
        );
        throw httpError;
      }

      const delay = calculateRetryDelay(
        retryIndex,
        this.policy,
        this.runtime.random(),
        httpError.retryAfterMs,
      );
      retryIndex += 1;
      const retryAfterNote =
        httpError.retryAfterMs === undefined
          ? ""
          : `，Retry-After=${formatDelay(httpError.retryAfterMs)}`;
      this.logger.warn(
        `请求失败 [http=${httpError.status}] ${url}：重试 ${retryIndex}/${this.policy.maxRetries}，${formatDelay(delay)} 后继续${retryAfterNote}`,
      );
      await this.runtime.sleep(delay);
    }
  }

  private async startRequest(url: string, owner: symbol): Promise<Response> {
    while (true) {
      if (this.fatalError) throw this.fatalError;
      const activeMitigation = this.mitigation;
      if (activeMitigation && activeMitigation.owner !== owner) {
        const breakerError = await activeMitigation.done;
        if (breakerError) throw breakerError;
        continue;
      }

      let releaseLock: () => void = () => undefined;
      const previousLock = this.startLock;
      this.startLock = new Promise<void>((resolvePromise) => {
        releaseLock = resolvePromise;
      });
      await previousLock;

      try {
        if (this.fatalError) throw this.fatalError;
        if (this.mitigation && this.mitigation.owner !== owner) continue;

        const waitMilliseconds = Math.max(0, this.nextRequestAt - this.runtime.now());
        if (waitMilliseconds > 0) await this.runtime.sleep(waitMilliseconds);

        if (this.fatalError) throw this.fatalError;
        if (this.mitigation && this.mitigation.owner !== owner) continue;

        const startedAt = this.runtime.now();
        const interval = boundedRandomInteger(
          this.policy.requestIntervalMinMs,
          this.policy.requestIntervalMaxMs,
          this.runtime.random(),
        );
        this.nextRequestAt = startedAt + interval;
        const requestPromise = this.runtime.fetch(url, {
          headers: {
            Accept: "text/markdown,text/plain;q=0.9,*/*;q=0.1",
            "User-Agent": USER_AGENT,
          },
          signal: AbortSignal.timeout(this.policy.requestTimeoutMs),
        });
        return requestPromise;
      } finally {
        releaseLock();
      }
    }
  }

  private async waitForNetworkRetry(
    error: unknown,
    url: string,
    retryIndex: number,
  ): Promise<number> {
    if (this.fatalError) throw this.fatalError;
    if (retryIndex >= this.policy.maxRetries) {
      this.logger.error(
        `最终失败 [network] ${url}：已重试 ${retryIndex}/${this.policy.maxRetries}，${errorMessage(error)}`,
      );
      throw error;
    }
    const delay = calculateRetryDelay(
      retryIndex,
      this.policy,
      this.runtime.random(),
    );
    const nextRetryIndex = retryIndex + 1;
    this.logger.warn(
      `请求失败 [network] ${url}：重试 ${nextRetryIndex}/${this.policy.maxRetries}，${formatDelay(delay)} 后继续；${errorMessage(error)}`,
    );
    await this.runtime.sleep(delay);
    return nextRetryIndex;
  }

  private httpError(response: Response, url: string): HttpError {
    const vercelMitigated =
      response.status === 403 &&
      response.headers.get("x-vercel-mitigated")?.trim().toLowerCase() === "deny";
    return new HttpError(response.status, url, {
      retryAfterMs: parseRetryAfterMs(
        response.headers.get("retry-after"),
        this.runtime.now(),
      ),
      vercelMitigated,
    });
  }

  private async handleMitigation(error: HttpError, owner: symbol): Promise<void> {
    if (this.fatalError) throw this.fatalError;
    if (this.mitigation) {
      const breakerError = await this.mitigation.done;
      if (breakerError) throw breakerError;
      return;
    }

    let finishState: (error?: Error) => void = () => undefined;
    const done = new Promise<Error | undefined>((resolvePromise) => {
      finishState = resolvePromise;
    });
    this.mitigation = {
      done,
      finish: finishState,
      owner,
      sourceUrl: error.url,
    };
    this.logger.warn(
      `触发全局熔断 [http=403, x-vercel-mitigated=deny] ${error.url}：暂停新请求，${formatDelay(this.policy.vercelMitigationCooldownMs)} 后仅探测一次`,
    );
    await this.runtime.sleep(this.policy.vercelMitigationCooldownMs);
    if (this.fatalError) throw this.fatalError;
    this.logger.info(`全局熔断进入单次探测：${error.url}`);
  }

  private finishProbeIfNeeded(owner: symbol): void {
    if (this.mitigation?.owner !== owner) return;
    const completed = this.mitigation;
    this.mitigation = undefined;
    completed.finish();
    this.logger.info(`全局熔断已解除：${completed.sourceUrl}`);
  }

  private failMitigation(error: Error): void {
    this.fatalError = error;
    const failed = this.mitigation;
    this.mitigation = undefined;
    failed?.finish(error);
  }
}
