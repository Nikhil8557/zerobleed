import React from "react";
import type { SponsorStatus } from "../types";
import { Shield, Database, Activity, Layers, Terminal, TrendingDown, Zap } from "lucide-react";

interface HeaderProps {
  status: SponsorStatus;
  activeTab: "console" | "architecture" | "silos" | "benchmark" | "api";
  onTabChange: (tab: "console" | "architecture" | "silos" | "benchmark" | "api") => void;
  replayMode: boolean;
  onToggleReplay: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  activeTab,
  onTabChange,
  replayMode,
  onToggleReplay,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2236] bg-[#08070d]/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#232b12] border border-[#d6f588]/40 flex items-center justify-center text-[#d6f588]">
          <Shield className="w-4 h-4 text-[#d6f588]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-[#f0edf7]">
              <span className="text-[#d6f588] font-bold">Zero</span>Bleed
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171222] border border-[#2a2236] text-[#aaa4b8]">
              Context Firewall
            </span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-[#110e19] p-1 rounded-xl border border-[#2a2236]">
        <button
          onClick={() => onTabChange("console")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "console"
              ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/30 shadow-sm"
              : "text-[#aaa4b8] hover:text-[#f0edf7] hover:bg-[#171222]"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Console</span>
        </button>
        <button
          onClick={() => onTabChange("architecture")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "architecture"
              ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/30 shadow-sm"
              : "text-[#aaa4b8] hover:text-[#f0edf7] hover:bg-[#171222]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture</span>
        </button>
        <button
          onClick={() => onTabChange("silos")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "silos"
              ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/30 shadow-sm"
              : "text-[#aaa4b8] hover:text-[#f0edf7] hover:bg-[#171222]"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Silos</span>
        </button>
        <button
          onClick={() => onTabChange("benchmark")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "benchmark"
              ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/30 shadow-sm"
              : "text-[#aaa4b8] hover:text-[#f0edf7] hover:bg-[#171222]"
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Benchmarks</span>
        </button>
        <button
          onClick={() => onTabChange("api")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "api"
              ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/30 shadow-sm"
              : "text-[#aaa4b8] hover:text-[#f0edf7] hover:bg-[#171222]"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>API</span>
        </button>
      </nav>

      {/* Minimal Status Indicators & Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#2a2236] bg-[#110e19] text-xs font-mono text-[#aaa4b8]">
          <span className="w-2 h-2 rounded-full bg-[#d6f588] pulse-online" />
          <span>Firewall Active</span>
        </div>

        <button
          onClick={() => onToggleReplay(!replayMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono transition-colors ${
            replayMode
              ? "border-[#eac58b]/40 bg-[#2b2112] text-[#eac58b]"
              : "border-[#d6f588]/40 bg-[#232b12] text-[#d6f588]"
          }`}
          title="Toggle between recorded runs and live execution"
        >
          <Zap className="w-3 h-3" />
          <span>{replayMode ? "Replay Mode" : "Live Mode"}</span>
        </button>
      </div>
    </header>
  );
};
