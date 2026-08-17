import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateRetryDelay,
  FetchCoordinator,
  type FetchPolicy,
  parseRetryAfterMs,
} from "../fetch-coordinator.ts";
import { mapConcurrent } from "../sync-docs.ts";

const QUIET_LOGGER = {
  error: () => undefined,
  info: () => undefined,
  warn: () => undefined,
};

function policy(overrides: Partial<FetchPolicy> = {}): FetchPolicy {
  return {
    maxRetries: 3,
    requestIntervalMaxMs: 0,
    requestIntervalMinMs: 0,
    requestTimeoutMs: 1_000,
    retryBaseDelayMs: 30_000,
    retryJitterMs: 1_000,
    retryMaxDelayMs: 300_000,
    vercelMitigationCooldownMs: 300_000,
    ...overrides,
  };
}

function nextTurn(): Promise<void> {
  return new Promise((resolvePromise) => setImmediate(resolvePromise));
}

test("retry delay follows 30/60/120 seconds with jitter and a local cap", () => {
  const retryPolicy = policy();
  assert.equal(calculateRetryDelay(0, retryPolicy, 0), 30_000);
  assert.equal(calculateRetryDelay(1, retryPolicy, 0), 60_000);
  assert.equal(calculateRetryDelay(2, retryPolicy, 0), 120_000);
  assert.equal(calculateRetryDelay(0, retryPolicy, 1), 31_000);
  assert.equal(calculateRetryDelay(4, retryPolicy, 1), 300_000);
  assert.equal(calculateRetryDelay(4, retryPolicy, 1, 600_000), 600_000);
});

test("Retry-After supports seconds and HTTP-date", () => {
  const now = Date.parse("2026-08-17T00:00:00Z");
  assert.equal(parseRetryAfterMs("90", now), 90_000);
  assert.equal(
    parseRetryAfterMs("Mon, 17 Aug 2026 00:02:00 GMT", now),
    120_000,
  );
  assert.equal(parseRetryAfterMs("invalid", now), undefined);
});

test("retryable HTTP failures use the injected clock without real waiting", async () => {
  const statuses = [500, 502, 503, 200];
  const waits: number[] = [];
  let now = 0;
  const coordinator = new FetchCoordinator(policy({ retryJitterMs: 0 }), {
    logger: QUIET_LOGGER,
    runtime: {
      fetch: async () => new Response("content", { status: statuses.shift() }),
      now: () => now,
      random: () => 0,
      sleep: async (milliseconds) => {
        waits.push(milliseconds);
        now += milliseconds;
      },
    },
  });

  assert.equal((await coordinator.fetchText("https://example.com/page.md")).content, "content");
  assert.deepEqual(waits, [30_000, 60_000, 120_000]);
});

test("network failures are retried with the same policy", async () => {
  const waits: number[] = [];
  let requests = 0;
  const coordinator = new FetchCoordinator(
    policy({ maxRetries: 1, retryJitterMs: 0 }),
    {
      logger: QUIET_LOGGER,
      runtime: {
        fetch: async () => {
          requests += 1;
          if (requests === 1) throw new TypeError("network unavailable");
          return new Response("recovered");
        },
        random: () => 0,
        sleep: async (milliseconds) => {
          waits.push(milliseconds);
        },
      },
    },
  );

  assert.equal((await coordinator.fetchText("https://example.com/page.md")).content, "recovered");
  assert.equal(requests, 2);
  assert.deepEqual(waits, [30_000]);
});

test("429 never shortens a valid Retry-After value", async () => {
  const waits: number[] = [];
  let requestCount = 0;
  let now = 0;
  const coordinator = new FetchCoordinator(policy({ retryJitterMs: 0 }), {
    logger: QUIET_LOGGER,
    runtime: {
      fetch: async () => {
        requestCount += 1;
        return requestCount === 1
          ? new Response("busy", {
              headers: { "Retry-After": "90" },
              status: 429,
            })
          : new Response("ready");
      },
      now: () => now,
      random: () => 0,
      sleep: async (milliseconds) => {
        waits.push(milliseconds);
        now += milliseconds;
      },
    },
  });

  assert.equal((await coordinator.fetchText("https://example.com/page.md")).content, "ready");
  assert.deepEqual(waits, [90_000]);
});

test("all workers share the same request start interval", async () => {
  const starts: number[] = [];
  let now = 0;
  const coordinator = new FetchCoordinator(
    policy({ requestIntervalMaxMs: 300, requestIntervalMinMs: 300 }),
    {
      logger: QUIET_LOGGER,
      runtime: {
        fetch: async () => {
          starts.push(now);
          return new Response("ok");
        },
        now: () => now,
        random: () => 0,
        sleep: async (milliseconds) => {
          now += milliseconds;
        },
      },
    },
  );

  await Promise.all([
    coordinator.fetchText("https://example.com/one.md"),
    coordinator.fetchText("https://example.com/two.md"),
    coordinator.fetchText("https://example.com/three.md"),
  ]);
  assert.deepEqual(starts, [0, 300, 600]);
});

test("page workers never exceed configured concurrency", async () => {
  let active = 0;
  let maximumActive = 0;
  const coordinator = new FetchCoordinator(policy(), {
    logger: QUIET_LOGGER,
    runtime: {
      fetch: async () => {
        active += 1;
        maximumActive = Math.max(maximumActive, active);
        await nextTurn();
        active -= 1;
        return new Response("ok");
      },
      random: () => 0,
    },
  });

  await mapConcurrent(
    ["one", "two", "three", "four"],
    2,
    (name) => coordinator.fetchText(`https://example.com/${name}.md`),
  );
  assert.equal(maximumActive, 2);
});

test("Vercel mitigation denial pauses all workers and allows one probe", async () => {
  const requests: string[] = [];
  let releaseCooldown: () => void = () => undefined;
  let reportCooldown: () => void = () => undefined;
  const cooldownStarted = new Promise<void>((resolvePromise) => {
    reportCooldown = resolvePromise;
  });
  const cooldown = new Promise<void>((resolvePromise) => {
    releaseCooldown = resolvePromise;
  });
  const coordinator = new FetchCoordinator(policy(), {
    logger: QUIET_LOGGER,
    runtime: {
      fetch: async (input) => {
        const url = String(input);
        requests.push(url);
        if (url.endsWith("blocked.md")) {
          return new Response("denied", {
            headers: { "x-vercel-mitigated": "deny" },
            status: 403,
          });
        }
        return new Response("must not start");
      },
      random: () => 0,
      sleep: async () => {
        reportCooldown();
        await cooldown;
      },
    },
  });

  const blocked = coordinator.fetchText("https://example.com/blocked.md");
  await cooldownStarted;
  const queued = coordinator.fetchText("https://example.com/queued.md");
  await nextTurn();
  assert.deepEqual(requests, ["https://example.com/blocked.md"]);

  const blockedFailure = assert.rejects(blocked, /冷却后探测仍收到 HTTP 403/);
  const queuedFailure = assert.rejects(queued, /冷却后探测仍收到 HTTP 403/);
  releaseCooldown();
  await Promise.all([blockedFailure, queuedFailure]);
  assert.deepEqual(requests, [
    "https://example.com/blocked.md",
    "https://example.com/blocked.md",
  ]);
});

test("permanent HTTP errors are not retried", async () => {
  let requests = 0;
  const waits: number[] = [];
  const coordinator = new FetchCoordinator(policy(), {
    logger: QUIET_LOGGER,
    runtime: {
      fetch: async () => {
        requests += 1;
        return new Response("missing", { status: 404 });
      },
      random: () => 0,
      sleep: async (milliseconds) => {
        waits.push(milliseconds);
      },
    },
  });

  await assert.rejects(
    coordinator.fetchText("https://example.com/missing.md"),
    /HTTP 404/,
  );
  assert.equal(requests, 1);
  assert.deepEqual(waits, []);
});
