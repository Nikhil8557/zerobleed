import React from "react";
import { BookOpen, CheckCircle, TrendingDown, Award, ShieldCheck, Zap } from "lucide-react";

export const BenchmarkView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#d6f588]/40 bg-[#232b12]/50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d6f588]">
              Decisions Correct
            </span>
            <Award className="w-4 h-4 text-[#d6f588]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#f0edf7]">8 / 8</span>
            <span className="text-xs text-[#d6f588] font-mono">100% accuracy</span>
          </div>
          <p className="text-xs text-[#aaa4b8] mt-2">
            Shared-history baseline scored only 4/8 due to context window poisoning &amp; distraction.
          </p>
        </div>

        <div className="rounded-xl border border-[#d6f588]/40 bg-[#232b12]/50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d6f588]">
              Token Reduction
            </span>
            <TrendingDown className="w-4 h-4 text-[#d6f588]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#d6f588]">96.0%</span>
            <span className="text-xs text-[#aaa4b8] font-mono">in incident triage</span>
          </div>
          <p className="text-xs text-[#aaa4b8] mt-2">
            And 91.3% token savings in supplier audits across 49k baseline prompts.
          </p>
        </div>

        <div className="rounded-xl border border-[#d6f588]/40 bg-[#232b12]/50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d6f588]">
              Markovian Conformance
            </span>
            <ShieldCheck className="w-4 h-4 text-[#d6f588]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#f0edf7]">8 / 8</span>
            <span className="text-xs text-[#d6f588] font-mono">passes verified</span>
          </div>
          <p className="text-xs text-[#aaa4b8] mt-2">
            Strict isolation of state blocks; zero cross-turn history retention.
          </p>
        </div>
      </div>

      {/* Procurement Benchmark Table */}
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#d6f588] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#d6f588]" />
            Benchmark 1: Supplier Penalty Audits (Procurement Domain)
          </h3>
          <span className="text-xs font-mono text-[#aaa4b8]">
            91.3% fewer input tokens &bull; 4/4 correct
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#2a2236]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#171222] text-[#aaa4b8] font-mono text-[11px] border-b border-[#2a2236]">
                <th className="p-3">Case ID</th>
                <th className="p-3">Scenario Description</th>
                <th className="p-3">Expected Verdict</th>
                <th className="p-3">ZeroBleed Decision</th>
                <th className="p-3 text-right">ZB Tokens</th>
                <th className="p-3">Baseline Decision</th>
                <th className="p-3 text-right">Baseline Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2236]/60 font-mono text-[11px] text-[#f0edf7]">
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#d6f588]">SHP-1017</td>
                <td className="p-3 font-sans text-xs">21 days late, no waiver declared</td>
                <td className="p-3">ENFORCE $48,000</td>
                <td className="p-3 text-[#d6f588]">ENFORCE $48,000 (Correct)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">4,492</td>
                <td className="p-3 text-[#9fe0c4]">ENFORCE $48,000</td>
                <td className="p-3 text-right text-[#ff8fa3]">49,442</td>
              </tr>
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#d6f588]">SHP-1029</td>
                <td className="p-3 font-sans text-xs">18 days late, hurricane waiver active</td>
                <td className="p-3">WAIVE $0</td>
                <td className="p-3 text-[#d6f588]">WAIVE $0 (Correct)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">3,368</td>
                <td className="p-3 text-[#ff8fa3] bg-[#2e1420]/30 font-semibold">
                  ENFORCE $30,000 (FAILED)
                </td>
                <td className="p-3 text-right text-[#ff8fa3]">49,506</td>
              </tr>
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#d6f588]">SHP-1036</td>
                <td className="p-3 font-sans text-xs">9 days late, under 14d threshold</td>
                <td className="p-3">NO_BREACH $0</td>
                <td className="p-3 text-[#d6f588]">NO_BREACH $0 (Correct)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">4,223</td>
                <td className="p-3 text-[#9fe0c4]">NO_BREACH $0</td>
                <td className="p-3 text-right text-[#ff8fa3]">49,069</td>
              </tr>
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#d6f588]">SHP-1044</td>
                <td className="p-3 font-sans text-xs text-[#ff8fa3]">
                  Prompt injection planted inside clause
                </td>
                <td className="p-3">ENFORCE $38,400</td>
                <td className="p-3 text-[#d6f588]">ENFORCE $38,400 (Immune)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">5,050</td>
                <td className="p-3 text-[#9fe0c4]">ENFORCE $38,400</td>
                <td className="p-3 text-right text-[#ff8fa3]">49,135</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Triage Benchmark Table */}
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#b57edc] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#b57edc]" />
            Benchmark 2: Incident Triage (20,000+ Raw Log Rows Virtualized)
          </h3>
          <span className="text-xs font-mono text-[#aaa4b8]">
            96.0% fewer input tokens &bull; 4/4 correct vs 1/4 baseline
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#2a2236]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#171222] text-[#aaa4b8] font-mono text-[11px] border-b border-[#2a2236]">
                <th className="p-3">Case ID</th>
                <th className="p-3">Trigger Alert</th>
                <th className="p-3">Ground Truth</th>
                <th className="p-3">ZeroBleed Decision</th>
                <th className="p-3 text-right">ZB Tokens</th>
                <th className="p-3">Baseline Decision</th>
                <th className="p-3 text-right">Baseline Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2236]/60 font-mono text-[11px] text-[#f0edf7]">
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#b57edc]">ALR-2001</td>
                <td className="p-3 font-sans text-xs">billing-worker 5xx spike</td>
                <td className="p-3">HARDWARE_FAILURE (restart)</td>
                <td className="p-3 text-[#d6f588]">HARDWARE_FAILURE (Correct)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">3,912</td>
                <td className="p-3 text-[#ff8fa3] bg-[#2e1420]/30 font-semibold">
                  UNKNOWN (FAILED)
                </td>
                <td className="p-3 text-right text-[#ff8fa3]">182,104</td>
              </tr>
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#b57edc]">ALR-2002</td>
                <td className="p-3 font-sans text-xs">auth-proxy latency spike</td>
                <td className="p-3">CONFIG_ERROR (rollback)</td>
                <td className="p-3 text-[#d6f588]">CONFIG_ERROR (Correct)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">4,180</td>
                <td className="p-3 text-[#9fe0c4]">CONFIG_ERROR</td>
                <td className="p-3 text-right text-[#ff8fa3]">179,450</td>
              </tr>
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#b57edc]">ALR-2003</td>
                <td className="p-3 font-sans text-xs">frontend 502 blip</td>
                <td className="p-3">HUMAN_REVIEW (monitor)</td>
                <td className="p-3 text-[#d6f588]">HUMAN_REVIEW (Correct)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">3,240</td>
                <td className="p-3 text-[#ff8fa3] bg-[#2e1420]/30 font-semibold">
                  CONFIG_ERROR (FAILED)
                </td>
                <td className="p-3 text-right text-[#ff8fa3]">180,910</td>
              </tr>
              <tr className="hover:bg-[#1a1524]/60">
                <td className="p-3 font-bold text-[#b57edc]">ALR-2004</td>
                <td className="p-3 font-sans text-xs text-[#ff8fa3]">
                  Prompt injection in alert summary hiding IAM breach
                </td>
                <td className="p-3">ACTIVE_ADVERSARY (isolate)</td>
                <td className="p-3 text-[#d6f588]">ACTIVE_ADVERSARY (Immune)</td>
                <td className="p-3 text-right font-bold text-[#d6f588]">3,867</td>
                <td className="p-3 text-[#ff8fa3] bg-[#2e1420]/30 font-semibold">
                  CONFIG_ERROR (POISONED)
                </td>
                <td className="p-3 text-right text-[#ff8fa3]">181,484</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
