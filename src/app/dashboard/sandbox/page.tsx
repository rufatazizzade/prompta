"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Columns,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Flame,
} from "lucide-react";
import { scanForPII, redactPII, getPIIWarningMessage } from "@/lib/security";

const AVAILABLE_MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Meta", speed: "Very Fast" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Mistral", speed: "Fast" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", provider: "Google", speed: "Ultra Fast" },
];

export default function SandboxPage() {
  const [prompt, setPrompt] = useState("");
  const [isSplitScreen, setIsSplitScreen] = useState(false);

  // Model A settings & results
  const [modelA, setModelA] = useState("llama-3.3-70b-versatile");
  const [outputA, setOutputA] = useState("");
  const [evalA, setEvalA] = useState<any>(null);
  const [loadingA, setLoadingA] = useState(false);

  // Model B settings & results (split-screen mode)
  const [modelB, setModelB] = useState("mixtral-8x7b-32768");
  const [outputB, setOutputB] = useState("");
  const [evalB, setEvalB] = useState<any>(null);
  const [loadingB, setLoadingB] = useState(false);

  // PII Warning states
  const [piiWarnings, setPiiWarnings] = useState<any[]>([]);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  // Run scans when prompt changes
  useEffect(() => {
    const detected = scanForPII(prompt);
    setPiiWarnings(detected);
  }, [prompt]);

  const handleRedact = () => {
    const safe = redactPII(prompt);
    setPrompt(safe);
  };

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async () => {
    if (!prompt) return;

    // Run Model A
    setLoadingA(true);
    try {
      const res = await fetch("/api/ai/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: modelA }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutputA(data.output);
      setEvalA(data.evaluation);
    } catch (err: any) {
      setOutputA(`Error: ${err.message || "Failed to execute"}`);
      setEvalA(null);
    } finally {
      setLoadingA(false);
    }

    // Run Model B if in split screen mode
    if (isSplitScreen) {
      setLoadingB(true);
      try {
        const res = await fetch("/api/ai/sandbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, model: modelB }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOutputB(data.output);
        setEvalB(data.evaluation);
      } catch (err: any) {
        setOutputB(`Error: ${err.message || "Failed to execute"}`);
        setEvalB(null);
      } finally {
        setLoadingB(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary animate-pulse" />
            AI Sandbox
          </h1>
          <p className="text-muted-foreground">
            Test prompts across different LLM backends, verify privacy standards, and review prompt efficiency.
          </p>
        </div>
        <button
          onClick={() => setIsSplitScreen(!isSplitScreen)}
          className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            isSplitScreen
              ? "bg-primary/20 border-primary text-primary"
              : "border-border hover:bg-muted"
          }`}
        >
          <Columns className="h-4 w-4" />
          {isSplitScreen ? "Disable Split Screen" : "Enable Split Screen"}
        </button>
      </div>

      {/* Editor & Input Panel */}
      <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Write Your Prompt
          </span>
          {piiWarnings.length > 0 ? (
            <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
              <ShieldAlert className="h-4 w-4 animate-bounce" />
              {piiWarnings.length} PII Warning(s)
            </span>
          ) : (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              Safe Workspace
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here... (e.g. 'Act as a product manager. Audit the following project scope...')"
            rows={5}
            className="w-full rounded-xl border border-input bg-background/50 p-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 font-sans"
          />
        </div>

        {/* Dynamic PII Alert Warning Box */}
        <AnimatePresence>
          {piiWarnings.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <p className="text-xs text-amber-500 leading-relaxed font-semibold">
                  {getPIIWarningMessage(piiWarnings)}
                </p>
                <button
                  onClick={handleRedact}
                  className="px-3 py-1 rounded bg-amber-500 text-background text-xs font-bold hover:bg-amber-600 transition-all shrink-0"
                >
                  Auto-Redact Prompt
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleExecute}
            disabled={!prompt || loadingA || loadingB}
            className="animated-gradient glow-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4 fill-white" />
            {isSplitScreen ? "Compare Models" : "Execute Prompt"}
          </button>
        </div>
      </div>

      {/* Outputs Comparison Workspace */}
      <div className={`grid gap-6 ${isSplitScreen ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Model A Container */}
        <div className="glass p-6 rounded-xl border border-border/50 flex flex-col min-h-[400px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Model A</span>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                className="bg-background border border-input text-xs font-semibold rounded p-1"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>
            {outputA && (
              <button
                onClick={() => handleCopy(outputA, setCopiedA)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-2 py-1 rounded transition-all"
              >
                {copiedA ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copiedA ? "Copied!" : "Copy Output"}
              </button>
            )}
          </div>

          {/* Execution Output area */}
          <div className="flex-1 rounded-xl bg-background/30 p-4 border border-border/20 overflow-y-auto text-sm min-h-[200px] max-h-[400px]">
            {loadingA ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span>Running prompt against model...</span>
              </div>
            ) : outputA ? (
              <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                {outputA}
              </pre>
            ) : (
              <span className="text-muted-foreground text-xs italic">
                Execution output will appear here after prompt is submitted.
              </span>
            )}
          </div>

          {/* Audit Metrics Panel */}
          {evalA && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-4 border-t border-border/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prompt Quality Rating</span>
                <span className={`text-sm font-bold flex items-center gap-1 ${
                  evalA.score >= 80 ? "text-emerald-500" : evalA.score >= 60 ? "text-amber-500" : "text-destructive"
                }`}>
                  <Flame className="h-4 w-4" />
                  {evalA.score}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{evalA.feedback}</p>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase">Suggestions:</span>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 pl-1">
                  {evalA.suggestions.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Model B Container */}
        <AnimatePresence>
          {isSplitScreen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass p-6 rounded-xl border border-border/50 flex flex-col min-h-[400px] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Model B</span>
                  <select
                    value={modelB}
                    onChange={(e) => setModelB(e.target.value)}
                    className="bg-background border border-input text-xs font-semibold rounded p-1"
                  >
                    {AVAILABLE_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.provider})
                      </option>
                    ))}
                  </select>
                </div>
                {outputB && (
                  <button
                    onClick={() => handleCopy(outputB, setCopiedB)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-2 py-1 rounded transition-all"
                  >
                    {copiedB ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedB ? "Copied!" : "Copy Output"}
                  </button>
                )}
              </div>

              {/* Execution Output area */}
              <div className="flex-1 rounded-xl bg-background/30 p-4 border border-border/20 overflow-y-auto text-sm min-h-[200px] max-h-[400px]">
                {loadingB ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    <span>Running prompt against model...</span>
                  </div>
                ) : outputB ? (
                  <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                    {outputB}
                  </pre>
                ) : (
                  <span className="text-muted-foreground text-xs italic">
                    Execution output will appear here after prompt is submitted.
                  </span>
                )}
              </div>

              {/* Audit Metrics Panel */}
              {evalB && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-border/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prompt Quality Rating</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${
                      evalB.score >= 80 ? "text-emerald-500" : evalB.score >= 60 ? "text-amber-500" : "text-destructive"
                    }`}>
                      <Flame className="h-4 w-4" />
                      {evalB.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{evalB.feedback}</p>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase">Suggestions:</span>
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 pl-1">
                      {evalB.suggestions.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
