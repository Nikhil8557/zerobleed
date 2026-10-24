import React from "react";
import { Database, ShieldCheck, Cpu, Clock, Layers, Lock, CpuIcon } from "lucide-react";

interface PipelineCounts {
  data: number;
  broker: number;
  model: number;
  cells: number;
  gates: number;
  tokens: number;
}

interface ActivePacket {
  id: string;
  wire: "w1" | "w2";
  direction: "r" | "l";
  color: string;
}

interface LivePipelineProps {
  counts: PipelineCounts;
  activeModelName: string;
  elapsedSeconds: number;
  hotNode: "data" | "broker" | "model" | "gate" | null;
  packets: ActivePacket[];
}

export const LivePipeline: React.FC<LivePipelineProps> = ({
  counts,
  activeModelName,
  elapsedSeconds,
  hotNode,
  packets,
}) => {
  return (
    <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#d6f588]" />
          Context-Broker Execution Pipeline
        </h2>
        <span className="text-xs font-mono text-[#d6f588]">
          Least-Privilege Routing Active
        </span>
      </div>

      {/* 3-Node Architecture with Connection Wires */}
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_60px_1.2fr_60px_1fr] items-center gap-3 md:gap-0 my-3">
        {/* Node 1: Data Silos */}
        <div
          className={`relative rounded-xl border p-3.5 transition-all duration-300 min-h-[92px] ${
            hotNode === "data"
              ? "border-[#b57edc] bg-[#1d1730] shadow-[0_0_24px_rgba(181,126,220,0.35)]"
              : "border-[#2a2236] bg-[#110e19]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b57edc] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#b57edc]" />
              Data Layer
            </span>
            <span className="text-xs font-mono font-semibold text-[#b57edc] bg-[#241a33] px-2 py-0.5 rounded-full border border-[#b57edc]/30">
              {counts.data} calls
            </span>
          </div>
          <span className="text-xs text-[#aaa4b8] block mt-2">
            Isolated enterprise silos. Raw database rows never enter agent prompts.
          </span>
        </div>

        {/* Wire 1 */}
        <div className="hidden md:block relative h-0.5 w-full bg-[repeating-linear-gradient(90deg,#2a2236_0_6px,transparent_6px_12px)] overflow-visible">
          {packets
            .filter((p) => p.wire === "w1")
            .map((p) => (
              <span
                key={p.id}
                className={`absolute -top-1 w-2.5 h-2.5 rounded-full ${
                  p.direction === "r" ? "animate-move-r" : "animate-move-l"
                }`}
                style={{
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                }}
              />
            ))}
        </div>

        {/* Node 2: Context Broker */}
        <div
          className={`relative rounded-xl border p-3.5 transition-all duration-300 min-h-[92px] ${
            hotNode === "gate"
              ? "border-[#eac58b] bg-[#2b2112] shadow-[0_0_28px_rgba(234,197,139,0.45)]"
              : hotNode === "broker"
              ? "border-[#f0edf7] bg-[#1a1524] shadow-[0_0_20px_rgba(240,237,247,0.15)]"
              : "border-[#2a2236] bg-[#110e19]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f0edf7] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d6f588]" />
              Context Broker
            </span>
            <span className="text-xs font-mono font-semibold text-[#f0edf7] bg-[#171222] px-2 py-0.5 rounded-full border border-[#2a2236]">
              {counts.broker} actions
            </span>
          </div>
          <span className="text-xs text-[#aaa4b8] block mt-2">
            Dispatches micro-contracts and enforces catalog-gated interrupts.
          </span>
        </div>

        {/* Wire 2 */}
        <div className="hidden md:block relative h-0.5 w-full bg-[repeating-linear-gradient(90deg,#2a2236_0_6px,transparent_6px_12px)] overflow-visible">
          {packets
            .filter((p) => p.wire === "w2")
            .map((p) => (
              <span
                key={p.id}
                className={`absolute -top-1 w-2.5 h-2.5 rounded-full ${
                  p.direction === "r" ? "animate-move-r" : "animate-move-l"
                }`}
                style={{
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                }}
              />
            ))}
        </div>

        {/* Node 3: Reasoning Engine */}
        <div
          className={`relative rounded-xl border p-3.5 transition-all duration-300 min-h-[92px] ${
            hotNode === "model"
              ? "border-[#d6f588] bg-[#232b12] shadow-[0_0_24px_rgba(214,245,136,0.35)]"
              : "border-[#2a2236] bg-[#110e19]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d6f588] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#d6f588]" />
              Reasoning Engine
            </span>
            <span className="text-xs font-mono font-semibold text-[#d6f588] bg-[#232b12] px-2 py-0.5 rounded-full border border-[#d6f588]/30">
              {counts.model} calls
            </span>
          </div>
          <span className="text-xs text-[#d6f588]/80 font-mono block mt-2 truncate">
            {activeModelName || "Stateless Micro-Steps"}
          </span>
        </div>
      </div>

      {/* Telemetry Meter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#2a2236] text-xs font-mono text-[#aaa4b8]">
        <div className="flex items-center justify-between bg-[#110e19] px-3 py-2 rounded-lg border border-[#2a2236]/60">
          <span className="flex items-center gap-1.5">
            <CpuIcon className="w-3.5 h-3.5 text-[#d6f588]" />
            Tokens Ingested:
          </span>
          <b className="text-[#f0edf7] text-sm">{counts.tokens.toLocaleString()}</b>
        </div>

        <div className="flex items-center justify-between bg-[#110e19] px-3 py-2 rounded-lg border border-[#2a2236]/60">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#b57edc]" />
            Scoped Cells:
          </span>
          <b className="text-[#b57edc] text-sm">{counts.cells}</b>
        </div>

        <div className="flex items-center justify-between bg-[#110e19] px-3 py-2 rounded-lg border border-[#2a2236]/60">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#eac58b]" />
            Requests Gated:
          </span>
          <b className="text-[#eac58b] text-sm">{counts.gates}</b>
        </div>

        <div className="flex items-center justify-between bg-[#110e19] px-3 py-2 rounded-lg border border-[#2a2236]/60">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#d6f588]" />
            Latency:
          </span>
          <b className="text-[#f0edf7] text-sm">{elapsedSeconds.toFixed(1)}s</b>
        </div>
      </div>
    </div>
  );
};
