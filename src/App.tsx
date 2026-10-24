import React, { useState, useEffect } from "react";
import type { SponsorStatus } from "./types";
import { Header } from "./components/Header";
import { AuditorConsole } from "./components/AuditorConsole";
import { ArchitectureView } from "./components/ArchitectureView";
import { DataSilosView } from "./components/DataSilosView";
import { BenchmarkView } from "./components/BenchmarkView";
import { ApiTester } from "./components/ApiTester";
import { Shield, Sparkles, ExternalLink, Info } from "lucide-react";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "console" | "architecture" | "silos" | "benchmark" | "api"
  >("console");
  const [replayMode, setReplayMode] = useState<boolean>(true);
  const [status, setStatus] = useState<SponsorStatus>({
    zetaris: "sample_mode",
    nightshift: "sample_mode",
    models: {
      fast: "nvidia/nemotron-3.5-lightning-30b-a3b",
      deep: "nvidia/nemotron-3-ultra-550b-a55b",
    },
    missing: [],
    engine: "Markovian",
  });

  useEffect(() => {
    // Check live server health and sponsor connectivity
    fetch("/api/status")
      .then((res) => {
        if (!res.ok) throw new Error("Status API not available");
        return res.json();
      })
      .then((data) => {
        setStatus({
          zetaris: data.zetaris === "online" ? "online" : "sample_mode",
          nightshift: data.nightshift === "online" ? "online" : "sample_mode",
          models: data.models || {
            fast: "nvidia/nemotron-3.5-lightning-30b-a3b",
            deep: "nvidia/nemotron-3-ultra-550b-a55b",
          },
          missing: data.missing || [],
          engine: data.engine || "Markovian",
        });
        if (data.zetaris === "online" && data.nightshift === "online") {
          setReplayMode(false);
        }
      })
      .catch(() => {
        // Fallback default sample mode
        setStatus((prev) => ({
          ...prev,
          zetaris: "sample_mode",
          nightshift: "sample_mode",
        }));
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#08070d] text-[#f0edf7] selection:bg-[#d6f588] selection:text-[#08070d]">
      <Header
        status={status}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        replayMode={replayMode}
        onToggleReplay={setReplayMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === "console" && <AuditorConsole replayMode={replayMode} />}
        {activeTab === "architecture" && <ArchitectureView />}
        {activeTab === "silos" && <DataSilosView />}
        {activeTab === "benchmark" && <BenchmarkView />}
        {activeTab === "api" && <ApiTester />}
      </main>

      {/* Minimal Clean Footer */}
      <footer className="border-t border-[#2a2236] bg-[#08070d]/90 py-4 px-6 text-xs text-[#aaa4b8] mt-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#d6f588]" />
            <span className="font-semibold text-[#f0edf7]">ZeroBleed</span>
            <span className="text-[#aaa4b8]">&bull;</span>
            <span>Need-to-Know Context Firewall for AI Agents</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#aaa4b8]">
            <span>Stateless Micro-Contracts</span>
            <span>&bull;</span>
            <span className="text-[#d6f588]">Zero Data Poisoning</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
