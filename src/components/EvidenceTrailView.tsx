import React from "react";
import type { Citation } from "../types";
import { Link2, Database, CheckCircle } from "lucide-react";

interface EvidenceTrailViewProps {
  citations: Citation[];
}

export const EvidenceTrailView: React.FC<EvidenceTrailViewProps> = ({ citations }) => {
  if (citations.length === 0) {
    return (
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] mb-3">
          Verifiable Evidence Trail
        </h2>
        <p className="text-xs text-[#aaa4b8] italic">
          Every audited fact maps back to the exact single-cell Zetaris query that produced it.
        </p>
      </div>
    );
  }

  // Group citations by SQL query
  const byQuery = new Map<string, Array<{ fact: string; value: string }>>();
  for (const c of citations) {
    const list = byQuery.get(c.sql) || [];
    list.push({ fact: c.fact, value: c.value });
    byQuery.set(c.sql, list);
  }

  return (
    <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#b57edc]" />
          Verifiable Evidence Trail ({citations.length} Verified Facts)
        </h2>
        <span className="text-xs font-mono text-[#b57edc]">
          Scoped Single-Cell SQL Leases
        </span>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {Array.from(byQuery.entries()).map(([sql, facts], idx) => (
          <div
            key={idx}
            className="rounded-lg border border-[#2a2236] bg-[#110e19] p-3.5 space-y-2 text-xs"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#b57edc]">
              <Database className="w-3.5 h-3.5 text-[#b57edc]" />
              <span className="font-semibold uppercase tracking-wider">Zetaris Virtual Query</span>
            </div>

            <pre className="p-2 rounded bg-[#1a1524] text-[#b57edc] font-mono text-[11px] overflow-x-auto border border-[#2a2236]/60 whitespace-pre-wrap break-all">
              {sql}
            </pre>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {facts.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1d1730] border border-[#b57edc]/30 text-[11px] font-mono text-[#cdb6ea]"
                >
                  <CheckCircle className="w-3 h-3 text-[#d6f588]" />
                  <span className="text-[#f0edf7] font-semibold">{f.fact.split(".")[1] || f.fact}</span>
                  <span className="text-[#aaa4b8]">=</span>
                  <span className="text-[#d6f588] truncate max-w-[200px]" title={f.value}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
