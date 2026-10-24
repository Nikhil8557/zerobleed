import React, { useState } from "react";
import { Terminal, Send, Play, Copy, Check, RefreshCw, FileJson } from "lucide-react";

export const ApiTester: React.FC = () => {
  const examples: Record<string, any> = {
    "example-1": {
      run_id: "example-1",
      input: { shipment_id: "SHP-1017" },
      options: { sample_mode: true, compare_baseline: false },
    },
    "example-2": {
      run_id: "example-2",
      input: { shipment_id: "SHP-1029" },
      options: { sample_mode: true, compare_baseline: true },
    },
    "example-3": {
      run_id: "example-3",
      input: { shipment_id: "SHP-1036" },
      options: { sample_mode: true, compare_baseline: false },
    },
    "example-4": {
      run_id: "example-4",
      input: { shipment_id: "SHP-1044" },
      options: { sample_mode: true, compare_baseline: true },
    },
    "example-5": {
      run_id: "example-5",
      input: { alert_id: "ALR-2001" },
      options: { sample_mode: true, compare_baseline: false },
    },
    "example-6": {
      run_id: "example-6",
      input: { alert_id: "ALR-2002" },
      options: { sample_mode: true, compare_baseline: true },
    },
    "example-7": {
      run_id: "example-7",
      input: { alert_id: "ALR-2003" },
      options: { sample_mode: true, compare_baseline: false },
    },
    "example-8": {
      run_id: "example-8",
      input: { alert_id: "ALR-2004" },
      options: { sample_mode: true, compare_baseline: true },
    },
  };

  const [selectedExample, setSelectedExample] = useState<string>("example-1");
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(examples["example-1"], null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectExample = (key: string) => {
    setSelectedExample(key);
    setJsonInput(JSON.stringify(examples[key], null, 2));
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseOutput(null);
    setStatusCode(null);
    const t0 = performance.now();

    try {
      const parsed = JSON.parse(jsonInput);
      const res = await fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const elapsed = Math.round(performance.now() - t0);
      setLatencyMs(elapsed);
      setStatusCode(res.status);

      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err) {
      const elapsed = Math.round(performance.now() - t0);
      setLatencyMs(elapsed);
      setStatusCode(500);
      setResponseOutput(
        JSON.stringify(
          {
            status: "error",
            error: {
              type: "ExecutionError",
              message: (err as Error).message,
              recoverable: true,
            },
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(responseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="rounded-xl border border-[#2a2236] bg-gradient-to-b from-[#171222] to-[#110e19] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#d6f588] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#d6f588]" />
              Programmatic API Playground: POST /run
            </h2>
            <p className="text-xs text-[#aaa4b8] mt-1">
              Standardized HTTP interface used by automated evaluators and benchmark scripts.
            </p>
          </div>

          {/* Example presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.keys(examples).map((key) => (
              <button
                key={key}
                onClick={() => handleSelectExample(key)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  selectedExample === key
                    ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/40"
                    : "bg-[#110e19] text-[#aaa4b8] hover:text-[#f0edf7] border border-[#2a2236]"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column editor and response */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Request Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#aaa4b8]">
              <span className="font-semibold text-[#f0edf7] flex items-center gap-1.5">
                <FileJson className="w-3.5 h-3.5 text-[#d6f588]" />
                Request Payload (JSON)
              </span>
              <span className="text-[11px]">POST /run</span>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={14}
              className="w-full bg-[#110e19] border border-[#2a2236] rounded-xl p-3 text-xs font-mono text-[#f0edf7] focus:outline-none focus:border-[#d6f588]/60 resize-none"
            />

            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#d6f588] hover:bg-[#c4e672] text-[#08070d] font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing POST /run...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Request</span>
                </>
              )}
            </button>
          </div>

          {/* Response Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#aaa4b8]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#f0edf7]">Response Output</span>
                {statusCode !== null && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      statusCode >= 200 && statusCode < 300
                        ? "bg-[#232b12] text-[#d6f588] border border-[#d6f588]/40"
                        : "bg-[#2e1420] text-[#ff8fa3] border border-[#ff8fa3]/40"
                    }`}
                  >
                    HTTP {statusCode}
                  </span>
                )}
                {latencyMs !== null && (
                  <span className="text-[11px] text-[#aaa4b8]">{latencyMs}ms</span>
                )}
              </div>

              {responseOutput && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-[11px] text-[#aaa4b8] hover:text-[#f0edf7] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-[#d6f588]" />
                      <span className="text-[#d6f588]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="bg-[#110e19] border border-[#2a2236] rounded-xl p-3 h-[326px] overflow-auto text-xs font-mono text-[#f0edf7]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-[#aaa4b8]">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#d6f588] mb-2" />
                  <span>Streaming /run completion...</span>
                </div>
              ) : responseOutput ? (
                <pre className="text-[11px] text-[#cdb6ea] whitespace-pre-wrap break-all">
                  {responseOutput}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#aaa4b8] italic text-center px-4">
                  <span>Send a request to inspect the structured ZeroBleed verdict, citations and tokens ledger.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
