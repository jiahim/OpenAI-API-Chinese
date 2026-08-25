export type SourceSection = "guides" | "reference";
export type SourcePageStatus = "active" | "removed";
export type TranslationReviewStatus = "machine" | "reviewed";

export interface TranslationConfig {
  glossaryPath: string;
  promptPath: string;
  provider: TranslationProviderProfile;
  schemaVersion: 1;
  sourceManifestPath: string;
  sourceRoot: string;
  targetLanguage: string;
  targetRoot: string;
  translationManifestPath: string;
}

export interface TranslationProviderProfile {
  apiKeyEnv: "DEEPSEEK_API_KEY";
  id: "deepseek";
  model: string;
}

export interface TranslationGlossary {
  preserve: string[];
  schemaVersion: 1;
  terms: Record<string, string>;
}

export interface SourcePageSnapshot {
  section: SourceSection;
  sha256: string;
  sourcePath: string;
  sourceUrl: string;
  status: SourcePageStatus;
}

export interface TranslationPageRecord {
  policySha256: string;
  reviewStatus: TranslationReviewStatus;
  sourcePath: string;
  sourceSha256: string;
  sourceUrl: string;
  targetPath: string;
  targetSha256: string;
  translatedAt: string;
}

export interface TranslationManifest {
  generatedAt?: string | undefined;
  pages: Record<string, TranslationPageRecord>;
  schemaVersion: 1;
  targetLanguage: string;
}

export type TranslationPageState =
  | "current"
  | "missing-target"
  | "modified-target"
  | "pending"
  | "removed-source"
  | "stale-policy"
  | "stale-source"
  | "untracked-target";

export interface TranslationPageInspection {
  record?: TranslationPageRecord | undefined;
  source?: SourcePageSnapshot | undefined;
  state: TranslationPageState;
  targetPath: string;
}

export interface TranslationStatusReport {
  entries: TranslationPageInspection[];
  policySha256: string;
  targetLanguage: string;
}

export interface TranslationWorkspaceSnapshot extends TranslationStatusReport {
  config: TranslationConfig;
  configPath: string;
  glossary: TranslationGlossary;
  prompt: string;
  repositoryRoot: string;
  translationManifest: TranslationManifest;
}
