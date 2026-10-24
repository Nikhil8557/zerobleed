import React from "react";
import type { ChunkInfo } from "../types";
import { FileCode, ArrowRight, Database } from "lucide-react";

interface ScratchpadViewProps {
  chunks: ChunkInfo[];
}

export const ScratchpadView: React.FC<ScratchpadViewProps> = ({ chunks }) => {
  if (chunks.length === 0) {
    return (
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] mb-3">
          Markovian Scratchpad Carried Between Steps
        </h2>
        <p className="text-xs text-[#aaa4b8] italic">
          Each worker receives only this distilled state block, never the full conversation history.
        </p>
      </div>
    );
  }

  const maxLen = Math.max(1, ...chunks.map((c) => c.carryover?.length || 0));

  return (
    <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-[#d6f588]" />
          Markovian Scratchpad (Zero History Bleed)
        </h2>
        <span className="text-xs font-mono text-[#aaa4b8]">
          {chunks.length} Micro-Steps Executed
        </span>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {chunks.map((chunk, idx) => {
          const carryoverLen = chunk.carryover?.length || 0;
          const barWidth = Math.round((carryoverLen / maxLen) * 100);

          return (
            <div
              key={chunk.id || idx}
              className="rounded-lg border border-[#2a2236] bg-[#110e19] p-3.5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-mono">
                <span className="font-semibold text-[#d6f588]">
                  Step {chunk.id}: {carryoverLen} characters carried
                </span>
                <div className="w-24 h-1.5 bg-[#1a1524] rounded-full overflow-hidden border border-[#2a2236]">
                  <div
                    className="h-full bg-[#d6f588] rounded-full"
                    style={{ width: `${Math.max(4, barWidth)}%` }}
                  />
                </div>
              </div>

              {/* Carryover block */}
              <div className="bg-[#1a1524] border border-[#2a2236]/70 rounded p-2.5 font-mono text-[11px] text-[#aaa4b8] whitespace-pre-wrap break-all max-h-28 overflow-y-auto">
                {chunk.carryover || "(Initial step: clean slate, no prior history)"}
              </div>

              {/* Tool interaction if paused */}
              {chunk.tool && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#eac58b] bg-[#2b2112]/40 border border-[#eac58b]/20 px-2.5 py-1.5 rounded">
                  <Database className="w-3.5 h-3.5 text-[#b57edc] shrink-0" />
                  <span>
                    Requested cell: <code className="text-[#f0edf7]">{chunk.tool.input}</code>
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#aaa4b8]" />
                  <span>
                    Zetaris verified: <b className="text-[#d6f588]">{chunk.tool.result}</b>
                  </span>
                </div>
              )}

              {chunk.content && (
                <div className="text-[#f0edf7] text-xs font-sans pl-1 border-l-2 border-[#d6f588]/40">
                  {chunk.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
