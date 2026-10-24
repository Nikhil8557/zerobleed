export interface TargetCase {
  id: string;
  title: string;
  detail: string;
  domain: "procurement" | "incident";
  scenario?: string;
  expectedDecision?: string;
  expectedValue?: string | number;
  hasPromptInjection?: boolean;
}

export interface Citation {
  fact: string;
  value: string;
  sql: string;
}

export interface LedgerEntry {
  step: number;
  task: string;
  lane: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  promptChars: number;
  ms: number;
  receiptId?: string;
  outcome: string;
}

export interface ChunkInfo {
  id: number;
  carryover: string;
  content: string;
  tool?: {
    tool: string;
    input: string;
    result: string;
  };
}

export interface AuditTotals {
  inputTokens: number;
  outputTokens: number;
  llmCalls: number;
  ms: number;
}

export interface BaselineComparison {
  decision: {
    decision: string;
    penalty_usd?: string | number;
    recommended_action?: string;
    rationale?: string;
  };
  totals: AuditTotals;
}

export interface AuditResultData {
  decision?: {
    decision: string;
    penalty_usd?: string;
    recommended_action?: string;
    rationale: string;
    [key: string]: any;
  };
  valueKey: string;
  valueText: string;
  needsHumanReview: boolean;
  reviewReasons: string[];
  plan?: any;
  citations: Citation[];
  ledger: LedgerEntry[];
  totals: AuditTotals;
  chunks: ChunkInfo[];
  reflection?: string;
}

export interface RecordedRun {
  events: string[];
  baseline?: BaselineComparison;
  result: AuditResultData;
}

export interface SponsorStatus {
  zetaris: "online" | "sample_mode" | "offline";
  nightshift: "online" | "sample_mode" | "offline";
  models: { fast: string; deep: string };
  missing: string[];
  engine: string;
}

export interface StepLogItem {
  id: string;
  text: string;
  tag: string;
  tagClass: string;
  timestamp: number;
}
