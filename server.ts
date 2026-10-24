import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { AGENTS, handleRun } from "./src/api.ts";
import { runAudit, showValue } from "./src/broker/broker.ts";
import { domainForId, getDomain, DOMAINS } from "./src/domains/index.ts";
import { runBaseline } from "./src/baseline.ts";
import { startDataServer } from "./src/dataServer.ts";
import { isSampleMode, withSampleMode } from "./src/replay.ts";
import { query } from "./src/zetaris.ts";
import { modelFor, providerStatus } from "./src/llm.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const ALT_PORT = process.env.PORT && Number(process.env.PORT) !== 3000 ? Number(process.env.PORT) : null;
const isProduction = process.env.NODE_ENV === "production";

// Ensure Zetaris mock data silos are up
await startDataServer().catch(() => console.log("[INFO] data silos already running on :8787"));

const app = express();
app.use(cors());

// Programmatic entry point for judges: POST /run
app.post("/run", express.json(), async (req, res) => {
  try {
    const body = req.body;
    const id = body?.input?.shipment_id ?? body?.input?.alert_id ?? body?.input?.id ?? "";
    const domain = Object.values(DOMAINS).find((d) => d.targetPattern.test(id));
    if (!domain || (body?.input?.domain && body.input.domain !== domain.id)) {
      return res.status(400).json({
        status: "error",
        error: {
          type: "BadRequest",
          message: "input needs shipment_id like SHP-1017 or alert_id like ALR-2001",
          recoverable: true,
        },
      });
    }

    const started = Date.now();
    const run_id = body.run_id && /^[\w-]{1,64}$/.test(body.run_id) ? body.run_id : `${id}-${started}`;
    const result = await withSampleMode(body.options?.sample_mode, () =>
      runAudit({ id, domain: domain.id }, { runId: run_id, historyDir: ".zerobleed" })
    );

    const baseline = body.options?.compare_baseline
      ? await withSampleMode(body.options?.sample_mode, () => runBaseline(id, domain.id))
      : undefined;

    res.status(200).json({
      run_id,
      status: result.decision && !result.needsHumanReview ? "success" : "needs_review",
      domain: domain.id,
      target_id: id,
      decision: result.decision?.decision ?? "UNKNOWN",
      [result.valueKey]: result.decision?.[result.valueKey] ?? "-",
      value_display: showValue(domain, result.decision?.[result.valueKey]),
      rationale: result.decision?.rationale ?? "",
      needs_human_review: result.needsHumanReview,
      review_reasons: result.reviewReasons,
      reflection: result.run.reflection,
      ledger: result.ledger,
      totals: result.totals,
      citations: result.citations,
      baseline,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: {
        type: "InternalError",
        message: (err as Error).message,
        recoverable: true,
      },
    });
  }
});

// Health check endpoint
app.get("/health", async (req, res) => {
  const nightshift = isSampleMode() ? { status: "sample_mode" } : await providerStatus();
  res.json({
    status: "ok",
    sample_mode: isSampleMode(),
    nightshift: {
      status: nightshift.status,
      missing_models: (nightshift as any).missing ?? [],
    },
    agents: AGENTS.map((a) => a.name),
  });
});

// Status of sponsors for frontend header
app.get("/api/status", async (req, res) => {
  let ns = { status: "offline", missing: [] as string[] };
  try {
    ns = isSampleMode() ? { status: "sample_mode", missing: [] as string[] } : await providerStatus();
  } catch {}

  let zetaris = "offline";
  try {
    await query("SELECT 1");
    zetaris = "online";
  } catch {}

  let models = {
    fast: "nvidia/nemotron-3.5-lightning-30b-a3b",
    deep: "nvidia/nemotron-3-ultra-550b-a55b",
  };
  try {
    models = { fast: modelFor("fast"), deep: modelFor("deep") };
  } catch {}

  res.json({
    zetaris: isSampleMode() ? "sample_mode" : zetaris,
    nightshift: ns.status,
    models,
    missing: ns.missing || [],
    engine: "Markovian",
  });
});

// Target cases for procurement and incident
app.get("/api/targets", async (req, res) => {
  const domainId = (req.query.domain as string) ?? "procurement";
  const domain = getDomain(domainId);
  try {
    const rows =
      domain.id === "incident"
        ? (await query("SELECT alert_id, service, severity, alert_time, metric FROM incidents.alerts ORDER BY alert_id")).map(
            (r) => ({
              id: r.alert_id,
              title: `${r.alert_id} · ${r.service}`,
              detail: `${r.severity}, ${r.metric}, ${String(r.alert_time).slice(11, 16)} UTC`,
            })
          )
        : (await query(
            "SELECT shipment_id, vendor_id, hub_region, delay_days, breach_date FROM zerobleed.shipments WHERE delay_days > 5 ORDER BY delay_days DESC"
          )).map((r) => ({
            id: r.shipment_id,
            title: `${r.shipment_id} · ${r.vendor_id}`,
            detail: `${r.delay_days} days late, ${r.hub_region}, ${r.breach_date ?? ""}`,
          }));
    res.json(rows);
  } catch {
    try {
      const fallbackPath = path.join(__dirname, "site", "data", `targets-${domain.id}.json`);
      if (fs.existsSync(fallbackPath)) {
        return res.json(JSON.parse(fs.readFileSync(fallbackPath, "utf8")));
      }
    } catch {}
    res.json([]);
  }
});

// Real-time SSE stream for audit run
app.get("/api/audit", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const id = (req.query.id as string) ?? "SHP-1017";
    const domain = domainForId(id);
    const result = await runAudit(
      { id, domain: domain.id },
      { onEvent: (e) => send("step", e), historyDir: ".zerobleed" }
    );
    send("result", {
      decision: result.decision,
      valueKey: result.valueKey,
      valueText: showValue(domain, result.decision?.[result.valueKey]),
      needsHumanReview: result.needsHumanReview,
      reviewReasons: result.reviewReasons,
      plan: result.plan,
      citations: result.citations,
      ledger: result.ledger,
      totals: result.totals,
      traceFile: result.traceFile,
      chunks: result.run.chunks.map((c) => ({
        id: c.id,
        carryover: c.carryover,
        content: c.content,
        tool: c.toolCall,
      })),
      reflection: result.run.reflection,
    });
    res.end();
  } catch (err) {
    send("step", `Error: ${(err as Error).message}`);
    res.end();
  }
});

// Real-time SSE stream for baseline comparison
app.get("/api/baseline", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const id = (req.query.id as string) ?? "SHP-1017";
    const result = await runBaseline(id, domainForId(id).id);
    send("result", result);
    res.end();
  } catch (err) {
    send("step", `Error: ${(err as Error).message}`);
    res.end();
  }
});

// Serve static recordings and site assets
app.use("/site", express.static(path.join(__dirname, "site")));
app.use("/data", express.static(path.join(__dirname, "data")));

// In development, mount Vite dev server as middleware
if (!isProduction) {
  const vite = await createViteServer({
    server: { middlewareMode: true, host: "0.0.0.0" },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  // In production, serve the compiled dist directory
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// Start server listening on PORT 3000
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[INFO] ZeroBleed Auditor running on http://0.0.0.0:${PORT}`);
});

if (ALT_PORT) {
  try {
    app.listen(ALT_PORT, "0.0.0.0", () => {
      console.log(`[INFO] ZeroBleed Auditor also listening on http://0.0.0.0:${ALT_PORT}`);
    });
  } catch (e) {
    // ignore if already in use
  }
}

