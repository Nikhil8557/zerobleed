import React, { useState, useEffect, useRef } from "react";
import type {
  TargetCase,
  AuditResultData,
  StepLogItem,
  BaselineComparison,
} from "../types";
import { TARGET_CASES } from "../data/staticRuns";
import { LivePipeline } from "./LivePipeline";
import { LiveStepsFeed } from "./LiveStepsFeed";
import { DecisionCard } from "./DecisionCard";
import { TokenSavingsBar } from "./TokenSavingsBar";
import { ScratchpadView } from "./ScratchpadView";
import { EvidenceTrailView } from "./EvidenceTrailView";
import { ModelLedgerView } from "./ModelLedgerView";
import { Play, AlertTriangle, ShieldCheck, RefreshCw, CheckCircle, Flame } from "lucide-react";

interface AuditorConsoleProps {
  replayMode: boolean;
}

export const AuditorConsole: React.FC<AuditorConsoleProps> = ({ replayMode }) => {
  const [domain, setDomain] = useState<"procurement" | "incident">("procurement");
  const [selectedId, setSelectedId] = useState<string>("SHP-1017");
  const [compareBaseline, setCompareBaseline] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningBaseline, setIsRunningBaseline] = useState<boolean>(false);

  // Pipeline telemetry & animation state
  const [counts, setCounts] = useState({
    data: 0,
    broker: 0,
    model: 0,
    cells: 0,
    gates: 0,
    tokens: 0,
  });
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [hotNode, setHotNode] = useState<"data" | "broker" | "model" | "gate" | null>(null);
  const [packets, setPackets] = useState<
    Array<{ id: string; wire: "w1" | "w2"; direction: "r" | "l"; color: string }>
  >([]);
  const [activeModelName, setActiveModelName] = useState<string>("Stateless Micro-Steps");

  // Audit state
  const [steps, setSteps] = useState<StepLogItem[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResultData | null>(null);
  const [baselineData, setBaselineData] = useState<BaselineComparison | null>(null);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Filter cases for selected domain
  const availableCases = TARGET_CASES.filter((c) => c.domain === domain);

  // Ensure selected case matches domain
  useEffect(() => {
    if (!availableCases.some((c) => c.id === selectedId)) {
      setSelectedId(domain === "incident" ? "ALR-2001" : "SHP-1017");
    }
  }, [domain]);

  // Helper to classify log step tag
  const tagForStep = (text: string): { tag: string; cls: string } => {
    if (text.startsWith("Planner")) return { tag: "PLAN", cls: "plan" };
    if (text.startsWith("Broker")) return { tag: "POLICY", cls: "policy" };
    if (text.startsWith("Zetaris")) return { tag: "ZETARIS", cls: "data" };
    if (text.startsWith("Gate")) return { tag: "GATE", cls: "gate" };
    if (text.startsWith("Guard")) return { tag: "GUARD", cls: "guard" };
    if (text.startsWith("Decision")) return { tag: "DECISION", cls: "done" };
    if (text.startsWith("Reflection")) return { tag: "REFLECT", cls: "done" };
    if (text.startsWith("Normal agent")) return { tag: "BASELINE", cls: "base" };
    return { tag: "WORKER", cls: "worker" };
  };

  const spawnPacket = (wire: "w1" | "w2", direction: "r" | "l", color: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setPackets((prev) => [...prev, { id, wire, direction, color }]);
    setTimeout(() => {
      setPackets((prev) => prev.filter((p) => p.id !== id));
    }, 750);
  };

  const processEvent = (text: string) => {
    const { tag, cls } = tagForStep(text);
    const newStep: StepLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      tag,
      tagClass: cls,
      timestamp: Date.now(),
    };
    setSteps((prev) => [...prev, newStep]);

    // Animate nodes and update counters
    if (text.startsWith("Zetaris")) {
      const match = text.match(/fetched (\d+)/);
      const cellCount = match ? Number(match[1]) : 1;
      setCounts((prev) => ({
        ...prev,
        data: prev.data + 1,
        cells: prev.cells + cellCount,
      }));
      setHotNode("data");
      spawnPacket("w1", "r", "#b57edc");
      setTimeout(() => setHotNode(null), 600);
    } else if (text.startsWith("Gate")) {
      setCounts((prev) => ({
        ...prev,
        broker: prev.broker + 1,
        gates: prev.gates + 1,
      }));
      setHotNode("gate");
      spawnPacket("w2", "l", "#eac58b");
      setTimeout(() => {
        spawnPacket("w1", "l", "#eac58b");
        setHotNode("data");
      }, 350);
      setTimeout(() => setHotNode(null), 700);
    } else if (
      text.startsWith("Planner") ||
      / on Nemotron|retried on|Reflection|Decision:/.test(text)
    ) {
      const match = text.match(/\((\d+) tokens in\)/);
      const tokenCount = match ? Number(match[1]) : 0;
      if (text.includes("Ultra")) setActiveModelName("Nemotron 3 Ultra 550B");
      else if (text.includes("Lightning")) setActiveModelName("Nemotron 3.5 Lightning 30B");

      setCounts((prev) => ({
        ...prev,
        broker: prev.broker + 1,
        model: prev.model + 1,
        tokens: prev.tokens + tokenCount,
      }));
      setHotNode("broker");
      spawnPacket("w2", "r", "#d6f588");
      setTimeout(() => {
        setHotNode("model");
      }, 300);
      setTimeout(() => setHotNode(null), 700);
    } else {
      setCounts((prev) => ({ ...prev, broker: prev.broker + 1 }));
      setHotNode("broker");
      setTimeout(() => setHotNode(null), 500);
    }
  };

  // Replay logic (recorded authentic live runs)
  const runReplay = async (id: string) => {
    try {
      const res = await fetch(`/site/data/run-${id}.json`);
      if (!res.ok) throw new Error("Could not load recorded run file");
      const data = await res.json();

      // Stream events smoothly
      for (const e of data.events) {
        await new Promise((r) => setTimeout(r, 450));
        processEvent(e);
      }

      setAuditResult(data.result);
      if (data.result?.totals?.inputTokens) {
        setCounts((prev) => ({ ...prev, tokens: data.result.totals.inputTokens }));
      }

      if (compareBaseline && data.baseline) {
        setIsRunningBaseline(true);
        await new Promise((r) => setTimeout(r, 600));
        setBaselineData(data.baseline);
        processEvent(
          `Normal agent decided ${data.baseline.decision?.decision || "verdict"} after reading ${data.baseline.totals.inputTokens.toLocaleString()} tokens`
        );
        setIsRunningBaseline(false);
      }
    } catch (err) {
      processEvent(`Replay error: ${(err as Error).message}`);
    }
  };

  // Live SSE stream logic
  const runLiveStream = (id: string) => {
    return new Promise<void>((resolve, reject) => {
      const es = new EventSource(`/api/audit?id=${encodeURIComponent(id)}`);

      es.addEventListener("step", (m) => {
        try {
          const stepText = JSON.parse(m.data);
          processEvent(stepText);
        } catch {
          processEvent(m.data);
        }
      });

      es.addEventListener("result", (m) => {
        try {
          const resultObj = JSON.parse(m.data);
          setAuditResult(resultObj);
          if (resultObj.totals?.inputTokens) {
            setCounts((prev) => ({ ...prev, tokens: resultObj.totals.inputTokens }));
          }
        } catch (e) {
          console.error(e);
        }
        es.close();
        resolve();
      });

      es.onerror = (err) => {
        es.close();
        // Fall back to recorded replay if live server is in offline/sample mode
        console.warn("Live stream error, falling back to recorded run replay:", err);
        runReplay(id).then(resolve).catch(reject);
      };
    });
  };

  // Live baseline stream
  const runLiveBaseline = (id: string) => {
    return new Promise<void>((resolve) => {
      setIsRunningBaseline(true);
      const es = new EventSource(`/api/baseline?id=${encodeURIComponent(id)}`);

      es.addEventListener("result", (m) => {
        try {
          const b = JSON.parse(m.data);
          setBaselineData(b);
          processEvent(
            `Normal agent decided ${b.decision?.decision || "verdict"} after reading ${b.totals.inputTokens.toLocaleString()} tokens`
          );
        } catch (e) {
          console.error(e);
        }
        es.close();
        setIsRunningBaseline(false);
        resolve();
      });

      es.onerror = () => {
        es.close();
        setIsRunningBaseline(false);
        resolve();
      };
    });
  };

  const handleRunAudit = async () => {
    setIsRunning(true);
    setAuditResult(null);
    setBaselineData(null);
    setSteps([]);
    setCounts({ data: 0, broker: 0, model: 0, cells: 0, gates: 0, tokens: 0 });
    setElapsedSeconds(0);

    startTimeRef.current = performance.now();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((performance.now() - startTimeRef.current) / 1000);
    }, 100);

    try {
      if (replayMode) {
        await runReplay(selectedId);
      } else {
        const zbPromise = runLiveStream(selectedId);
        const basePromise = compareBaseline ? runLiveBaseline(selectedId) : Promise.resolve();
        await Promise.all([zbPromise, basePromise]);
      }
    } catch (err) {
      processEvent(`Audit error: ${(err as Error).message}`);
    } finally {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setIsRunningBaseline(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-5 py-2">
      {/* Left Sidebar: Controls & Case Picker */}
      <aside className="space-y-4">
        {/* Domain Tabs & Case Picker */}
        <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-4 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#aaa4b8] block mb-2">
              Audit Domain
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#110e19] rounded-xl border border-[#2a2236]">
              <button
                onClick={() => setDomain("procurement")}
                className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                  domain === "procurement"
                    ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/40 shadow-sm"
                    : "text-[#aaa4b8] hover:text-[#f0edf7]"
                }`}
              >
                Supplier Penalties
              </button>
              <button
                onClick={() => setDomain("incident")}
                className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                  domain === "incident"
                    ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/40 shadow-sm"
                    : "text-[#aaa4b8] hover:text-[#f0edf7]"
                }`}
              >
                Incident Triage
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#aaa4b8]">
                {domain === "incident" ? "Open System Alerts" : "Flagged Late Shipments"}
              </span>
              <span className="text-[10px] font-mono text-[#aaa4b8]">
                {availableCases.length} targets
              </span>
            </div>

            <div className="space-y-1.5">
              {availableCases.map((c) => {
                const isSelected = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-[#d6f588] bg-[#232b12]/80 text-[#f0edf7] shadow-[0_0_15px_rgba(214,245,136,0.15)]"
                        : "border-[#2a2236] bg-[#110e19] hover:bg-[#171222] text-[#f0edf7]/80 hover:border-[#3d3150]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold font-mono flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-[#d6f588]" : "bg-[#aaa4b8]"
                          }`}
                        />
                        {c.title}
                      </span>
                      {c.hasPromptInjection && (
                        <span
                          title="Contains adversarial prompt injection"
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2e1420] text-[#ff8fa3] border border-[#ff8fa3]/30 flex items-center gap-1"
                        >
                          <Flame className="w-3 h-3 text-[#ff8fa3]" />
                          Injection
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#aaa4b8] block mt-1 truncate">
                      {c.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#2a2236] space-y-3">
            <button
              onClick={handleRunAudit}
              disabled={isRunning}
              className="w-full py-3 px-4 rounded-xl bg-[#d6f588] hover:bg-[#c4e672] text-[#08070d] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(214,245,136,0.25)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#08070d]" />
                  <span>Auditing {selectedId}...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run ZeroBleed Audit</span>
                </>
              )}
            </button>

            <label className="flex items-center gap-2 text-xs text-[#aaa4b8] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={compareBaseline}
                onChange={(e) => setCompareBaseline(e.target.checked)}
                className="rounded border-[#2a2236] bg-[#110e19] text-[#d6f588] focus:ring-0 focus:ring-offset-0"
              />
              <span>Also run shared-history baseline</span>
            </label>
          </div>
        </div>

        {/* Explainer card */}
        <div className="rounded-xl border border-[#2a2236] bg-[#110e19] p-4 text-xs text-[#aaa4b8] space-y-2">
          <h3 className="font-mono font-semibold uppercase tracking-wider text-[#d6f588] text-[11px]">
            ZeroBleed Isolation
          </h3>
          <p className="leading-relaxed">
            Raw rows never enter model prompts. The broker plans using schema column names alone, leasing single-cell micro-contracts to workers on demand.
          </p>
          <p className="leading-relaxed">
            A verified state block (&lt; 500 chars) replaces growing chat histories, neutralizing prompt injections while slashing token usage by 90%+.
          </p>
        </div>
      </aside>

      {/* Right Area: Pipeline + Live Execution & Analysis */}
      <main className="space-y-5">
        {/* Live Pipeline Visualization */}
        <LivePipeline
          counts={counts}
          activeModelName={activeModelName}
          elapsedSeconds={elapsedSeconds}
          hotNode={hotNode}
          packets={packets}
        />

        {/* Live Steps & Decision / Tokens Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LiveStepsFeed steps={steps} isRunning={isRunning} />

          <div className="space-y-5">
            <DecisionCard
              result={auditResult}
              targetId={selectedId}
              isRunning={isRunning}
            />

            <TokenSavingsBar
              zbTokens={auditResult?.totals?.inputTokens ?? (counts.tokens > 0 ? counts.tokens : null)}
              baselineTokens={baselineData?.totals?.inputTokens ?? null}
              isRunningBaseline={isRunningBaseline}
            />
          </div>
        </div>

        {/* Scratchpad & Evidence Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ScratchpadView chunks={auditResult?.chunks || []} />
          <EvidenceTrailView citations={auditResult?.citations || []} />
        </div>

        {/* Model Ledger Table */}
        <ModelLedgerView
          ledger={auditResult?.ledger || []}
          totals={auditResult?.totals || null}
        />
      </main>
    </div>
  );
};
