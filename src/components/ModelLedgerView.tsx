import React from "react";
import type { LedgerEntry, AuditTotals } from "../types";
import { Cpu, Receipt, CheckCircle, Clock } from "lucide-react";

interface ModelLedgerViewProps {
  ledger: LedgerEntry[];
  totals: AuditTotals | null;
}

export const ModelLedgerView: React.FC<ModelLedgerViewProps> = ({ ledger, totals }) => {
  if (ledger.length === 0) {
    return (
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] mb-3">
          Step Execution Ledger
        </h2>
        <p className="text-xs text-[#aaa4b8] italic">
          Every task step is logged with input/output token counts, latency, and verified outcomes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] flex items-center gap-2">
          <Receipt className="w-3.5 h-3.5 text-[#d6f588]" />
          Model Execution Ledger
        </h2>
        <span className="text-xs font-mono text-[#aaa4b8]">
          {ledger.length} Stateless Steps
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#2a2236] text-[11px] font-mono text-[#aaa4b8]">
              <th className="py-2 px-3 font-semibold">Step / Task</th>
              <th className="py-2 px-3 font-semibold">Model</th>
              <th className="py-2 px-3 font-semibold text-right">Tokens In</th>
              <th className="py-2 px-3 font-semibold text-right">Tokens Out</th>
              <th className="py-2 px-3 font-semibold text-right">Latency</th>
              <th className="py-2 px-3 font-semibold">Outcome</th>
              <th className="py-2 px-3 font-semibold font-mono">Execution ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2236]/60 font-mono text-[11px]">
            {ledger.map((entry, idx) => (
              <tr
                key={idx}
                className="hover:bg-[#1a1524]/50 transition-colors text-[#f0edf7]"
              >
                <td className="py-2.5 px-3 font-semibold text-[#d6f588]">
                  {entry.task}
                </td>
                <td className="py-2.5 px-3 text-[#aaa4b8] truncate max-w-[180px]" title={entry.model}>
                  {entry.model.replace("nvidia/", "")}
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-[#f0edf7]">
                  {entry.inputTokens.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-[#aaa4b8]">
                  {entry.outputTokens.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-[#aaa4b8]">
                  {(entry.ms / 1000).toFixed(2)}s
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      entry.outcome === "VERIFIED" || entry.outcome === "RATIFY"
                        ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/30"
                        : entry.outcome === "INSUFFICIENT_CONTEXT"
                        ? "bg-[#2b2112] text-[#eac58b] border border-[#eac58b]/30"
                        : "bg-[#171222] text-[#b57edc] border border-[#b57edc]/30"
                    }`}
                  >
                    {entry.outcome}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[#aaa4b8]">
                  <code className="text-[#9fe0c4] bg-[#12261f] px-1.5 py-0.5 rounded text-[10px] border border-[#9fe0c4]/20">
                    {entry.receiptId || "rcpt_mock_live"}
                  </code>
                </td>
              </tr>
            ))}

            {totals && (
              <tr className="border-t-2 border-[#2a2236] bg-[#171222]/80 font-bold text-[#f0edf7]">
                <td className="py-2.5 px-3 text-[#d6f588]">Total / Aggregated</td>
                <td className="py-2.5 px-3 text-[#aaa4b8]">{ledger.length} calls</td>
                <td className="py-2.5 px-3 text-right text-[#d6f588]">
                  {totals.inputTokens.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-[#f0edf7]">
                  {totals.outputTokens.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-[#aaa4b8]">
                  {(totals.ms / 1000).toFixed(2)}s
                </td>
                <td colSpan={2} className="py-2.5 px-3 text-right text-[11px] text-[#aaa4b8] font-normal font-sans">
                  All calls strictly bound to &le; 1,000 tokens
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
