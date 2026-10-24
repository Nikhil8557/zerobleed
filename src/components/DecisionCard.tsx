import React, { useState } from "react";
import type { AuditResultData } from "../types";
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Check, RefreshCw, UserCheck } from "lucide-react";

interface DecisionCardProps {
  result: AuditResultData | null;
  targetId: string;
  isRunning: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  result,
  targetId,
  isRunning,
}) => {
  const [auditorAction, setAuditorAction] = useState<string | null>(null);

  if (isRunning) {
    return (
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] mb-3">
          Auditor Verdict
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-center text-[#aaa4b8]">
          <RefreshCw className="w-8 h-8 text-[#d6f588] animate-spin mb-3" />
          <p className="text-sm font-medium text-[#f0edf7]">Context Broker is analyzing...</p>
          <span className="text-xs text-[#aaa4b8] mt-1">
            Validating schema &bull; gating fact requests &bull; running stateless steps
          </span>
        </div>
      </div>
    );
  }

  if (!result || !result.decision) {
    return (
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] mb-3">
          Auditor Verdict
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-center text-[#aaa4b8]">
          <ShieldAlert className="w-8 h-8 text-[#2a2236] mb-2" />
          <p className="text-sm">Select a case and press <strong className="text-[#d6f588]">Run Audit</strong></p>
          <span className="text-xs mt-1">Results and verifiable decision trail will appear here</span>
        </div>
      </div>
    );
  }

  const d = result.decision;
  const decisionType = d.decision || "UNKNOWN";

  // Decision color theme
  let badgeTheme = "bg-[#232b12] text-[#d6f588] border-[#d6f588]/40";
  let cardBg = "from-[#171222] to-[#110e19]";
  let borderTheme = "border-[#2a2236]";

  if (decisionType === "ENFORCE" || decisionType === "ACTIVE_ADVERSARY") {
    badgeTheme = "bg-[#2e1420] text-[#ff8fa3] border-[#ff8fa3]/40";
    cardBg = "from-[#3a1726]/40 to-[#171222]";
    borderTheme = "border-[#5a2638]";
  } else if (decisionType === "WAIVE" || decisionType === "NO_BREACH") {
    badgeTheme = "bg-[#12261f] text-[#9fe0c4] border-[#9fe0c4]/40";
    cardBg = "from-[#1c3a2c]/40 to-[#171222]";
    borderTheme = "border-[#2d5a45]";
  } else if (
    decisionType === "CONFIG_ERROR" ||
    decisionType === "HARDWARE_FAILURE" ||
    decisionType === "HUMAN_REVIEW"
  ) {
    badgeTheme = "bg-[#2b2112] text-[#eac58b] border-[#eac58b]/40";
    cardBg = "from-[#3a2d14]/40 to-[#171222]";
    borderTheme = "border-[#5a4520]";
  }

  return (
    <div className={`rounded-xl border ${borderTheme} bg-gradient-to-b ${cardBg} p-5 transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] flex items-center gap-2">
          Auditor Verdict &bull; {targetId}
        </h2>
        <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${badgeTheme}`}>
          {decisionType.replace(/_/g, " ")}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-bold tracking-tight text-[#f0edf7]">
            {decisionType.replace(/_/g, " ")}
          </span>
          {result.valueText && result.valueText !== "-" && (
            <span className="text-lg font-mono font-semibold text-[#d6f588] bg-[#232b12] px-3 py-0.5 rounded-lg border border-[#d6f588]/30">
              {result.valueText.startsWith("$")
                ? "$" + Number(result.valueText.replace("$", "")).toLocaleString()
                : result.valueText.replace(/_/g, " ")}
            </span>
          )}
        </div>

        <p className="text-sm text-[#f0edf7] leading-relaxed">
          {d.rationale}
        </p>

        {result.needsHumanReview && result.reviewReasons.length > 0 && (
          <div className="flex items-start gap-2 bg-[#2b2112]/60 border border-[#eac58b]/30 p-2.5 rounded-lg text-xs text-[#eac58b]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-medium">Needs Human Review:</strong>
              <span>{result.reviewReasons.join("; ")}</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[#2a2236]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#aaa4b8]">
            <span className="font-mono">Independent reflection:</span>
            <span className="font-mono text-[#d6f588] bg-[#232b12] px-2 py-0.5 rounded border border-[#d6f588]/30">
              {result.reflection || "RATIFIED"}
            </span>
          </div>

          {auditorAction ? (
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#d6f588] bg-[#232b12] px-3 py-1.5 rounded-lg border border-[#d6f588]/40">
              <Check className="w-3.5 h-3.5" />
              <span>{auditorAction}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuditorAction(`Approved by auditor at ${new Date().toLocaleTimeString()}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#d6f588] text-[#08070d] hover:bg-[#c4e672] transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => setAuditorAction(`Escalated for manual review at ${new Date().toLocaleTimeString()}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#171222] text-[#f0edf7] border border-[#2a2236] hover:bg-[#241a33] transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Send back</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
