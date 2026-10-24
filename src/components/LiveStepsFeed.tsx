import React, { useState, useRef, useEffect } from "react";
import type { StepLogItem } from "../types";
import { Terminal, Filter, Search, ArrowDown } from "lucide-react";

interface LiveStepsFeedProps {
  steps: StepLogItem[];
  isRunning: boolean;
}

export const LiveStepsFeed: React.FC<LiveStepsFeedProps> = ({ steps, isRunning }) => {
  const [filterTag, setFilterTag] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [steps]);

  const filteredSteps = steps.filter((step) => {
    const matchesTag = filterTag === "ALL" || step.tag === filterTag;
    const matchesSearch =
      !searchQuery || step.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case "PLAN":
        return "bg-[#241a33] text-[#b57edc] border-[#b57edc]/40";
      case "POLICY":
        return "bg-[#1d1730] text-[#cdb6ea] border-[#b57edc]/30";
      case "ZETARIS":
        return "bg-[#1d1730] text-[#cdb6ea] border-[#b57edc]/40";
      case "GATE":
        return "bg-[#2b2112] text-[#eac58b] border-[#eac58b]/40";
      case "GUARD":
        return "bg-[#2e1420] text-[#ff8fa3] border-[#ff8fa3]/40";
      case "DECISION":
      case "REFLECT":
        return "bg-[#232b12] text-[#d6f588] border-[#d6f588]/40";
      case "BASELINE":
        return "bg-[#2e1420] text-[#ff8fa3] border-[#ff8fa3]/30";
      default:
        return "bg-[#1a1524] text-[#aaa4b8] border-[#2a2236]";
    }
  };

  return (
    <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-4 sm:p-5 flex flex-col h-full max-h-[500px]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#d6f588]" />
          Execution Log &bull; Live Audit Trail ({steps.length})
        </h2>

        {/* Filter tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "PLAN", "ZETARIS", "GATE", "DECISION"].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                filterTag === tag
                  ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/40"
                  : "bg-[#110e19] text-[#aaa4b8] hover:text-[#f0edf7] border border-[#2a2236]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-2.5">
        <Search className="w-3.5 h-3.5 text-[#aaa4b8] absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter steps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#110e19] border border-[#2a2236] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f0edf7] placeholder-[#aaa4b8]/50 focus:outline-none focus:border-[#d6f588]/50 font-mono"
        />
      </div>

      {/* Log list */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs font-mono scroll-smooth min-h-[220px]"
      >
        {filteredSteps.length === 0 ? (
          <div className="text-center py-8 text-[#aaa4b8] italic">
            {steps.length === 0 ? "Pick a target case and click Run Audit" : "No steps match your filter"}
          </div>
        ) : (
          filteredSteps.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[82px_minmax(0,1fr)] gap-2.5 items-start p-2 rounded-lg bg-[#110e19]/70 border border-[#2a2236]/50 hover:border-[#2a2236] transition-colors"
            >
              <span
                className={`text-[10px] font-bold text-center px-1.5 py-0.5 rounded border uppercase truncate ${getTagStyle(
                  s.tag
                )}`}
              >
                {s.tag}
              </span>
              <span className="text-[#f0edf7] leading-relaxed break-words font-sans text-xs">
                {s.text}
              </span>
            </div>
          ))
        )}
        {isRunning && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#d6f588] p-2 bg-[#232b12]/50 rounded border border-[#d6f588]/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#d6f588]" />
            <span>Broker processing next micro-contract...</span>
          </div>
        )}
      </div>
    </div>
  );
};
