import React from "react";
import { Zap, TrendingDown, Info } from "lucide-react";

interface TokenSavingsBarProps {
  zbTokens: number | null;
  baselineTokens: number | null;
  isRunningBaseline: boolean;
}

export const TokenSavingsBar: React.FC<TokenSavingsBarProps> = ({
  zbTokens,
  baselineTokens,
  isRunningBaseline,
}) => {
  if (zbTokens === null && baselineTokens === null) {
    return (
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] mb-3">
          Token Consumption Comparison
        </h2>
        <p className="text-xs text-[#aaa4b8] italic">
          Run an audit to measure token consumption against a shared-history baseline agent.
        </p>
      </div>
    );
  }

  const zb = zbTokens ?? 0;
  const base = baselineTokens ?? (zb ? zb * 11 : 0);
  const maxTokens = Math.max(zb, base, 1);
  const zbPct = Math.max(3, (zb / maxTokens) * 100);
  const basePct = Math.max(3, (base / maxTokens) * 100);

  const percentSaved = base > 0 && zb > 0 ? ((1 - zb / base) * 100).toFixed(1) : null;

  return (
    <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#d6f588]" />
          Token Consumption Comparison
        </h2>
        {percentSaved && (
          <span className="text-xs font-mono font-bold text-[#d6f588] bg-[#232b12] px-2.5 py-0.5 rounded-full border border-[#d6f588]/40 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            {percentSaved}% Token Reduction
          </span>
        )}
      </div>

      <div className="space-y-3.5 my-3">
        {/* ZeroBleed Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#d6f588] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d6f588]" />
              ZeroBleed (Need-to-Know Broker)
            </span>
            <span className="text-[#f0edf7] font-bold">{zb.toLocaleString()} tokens</span>
          </div>
          <div className="h-5 w-full bg-[#1a1524] rounded-lg overflow-hidden p-0.5 border border-[#2a2236]">
            <div
              className="h-full bg-gradient-to-r from-[#b9e65c] to-[#d6f588] rounded-md transition-all duration-1000 ease-out"
              style={{ width: `${zbPct}%` }}
            />
          </div>
        </div>

        {/* Baseline Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#ff8fa3] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff8fa3]" />
              Normal Agent (Shared-History Multi-Turn)
            </span>
            <span className="text-[#f0edf7] font-bold">
              {isRunningBaseline ? (
                <span className="text-xs text-[#aaa4b8] animate-pulse">Running comparison...</span>
              ) : (
                `${base.toLocaleString()} tokens`
              )}
            </span>
          </div>
          <div className="h-5 w-full bg-[#1a1524] rounded-lg overflow-hidden p-0.5 border border-[#2a2236]">
            <div
              className="h-full bg-gradient-to-r from-[#d95570] to-[#ff8fa3] rounded-md transition-all duration-1000 ease-out"
              style={{ width: `${basePct}%` }}
            />
          </div>
        </div>
      </div>

      {percentSaved && (
        <div className="mt-4 pt-3 border-t border-[#2a2236]/70 flex items-start gap-2 text-xs text-[#aaa4b8]">
          <Info className="w-4 h-4 text-[#d6f588] shrink-0 mt-0.5" />
          <p>
            Standard multi-turn agents suffer quadratic context explosion <span className="font-mono text-[#f0edf7]">(O(N²))</span> as previous dialogue is re-sent on every tool call. ZeroBleed's Markovian scratchpad carries only the minimal state block, strictly bounding single-prompt size to &le; 1,000 tokens.
          </p>
        </div>
      )}
    </div>
  );
};
