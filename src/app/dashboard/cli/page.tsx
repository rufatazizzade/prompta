"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  FolderGit,
  Database,
  Code,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";

export default function CliPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedLogin, setCopiedLogin] = useState(false);
  
  // Dashboard statistics
  const [projects, setProjects] = useState<any[]>([]);
  const [optimizations, setOptimizations] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [patternsCount, setPatternsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/cli/v1/keys");
      const data = await res.json();
      if (data.status === "success") {
        setKeys(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/cli/v1/dashboard");
      const data = await res.json();
      if (data.status === "success") {
        setProjects(data.data.projects);
        setOptimizations(data.data.optimizations);
        setLogs(data.data.logs);
        setPatternsCount(data.data.patternsCount);
      }
    } catch (err) {
      console.error("Failed to fetch CLI dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
    fetchDashboardData();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    try {
      const res = await fetch("/api/cli/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setGeneratedKey(data.data.key);
        setNewKeyName("");
        fetchKeys();
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to create key:", err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Access will be terminated immediately.")) return;

    try {
      const res = await fetch("/api/cli/v1/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.status === "success") {
        if (keys.find((k) => k.id === id)?.key === generatedKey) {
          setGeneratedKey(null);
        }
        fetchKeys();
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to revoke key:", err);
    }
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <Terminal className="h-8 w-8 text-primary" />
          CLI Connect Center
        </h1>
        <p className="text-muted-foreground">
          Deploy Prompta directly inside your local development terminal. Index codebases, optimize context, and save model tokens.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* API Credentials Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Creator */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h2 className="text-lg font-bold font-heading flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              CLI API Keys
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              API keys are personal credentials used by the Prompta CLI compiler tool to securely index and authenticate code requests. Keep them private.
            </p>

            <form onSubmit={handleCreateKey} className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key label (e.g. Work MacBook, Desktop)"
                className="flex-1 h-10 rounded-lg border border-input bg-background/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                required
              />
              <button
                type="submit"
                className="animated-gradient flex items-center gap-1.5 px-4 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all shrink-0"
              >
                <Plus className="h-4 w-4" />
                Generate Key
              </button>
            </form>

            {generatedKey && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                <span className="text-xs text-emerald-500 font-bold uppercase tracking-wide block">
                  New API Key Generated
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Make sure to copy your API key now. For security reasons, you won't be able to see it again.
                </p>
                <div className="flex items-center gap-2 bg-background/80 border border-border rounded px-3 py-2">
                  <code className="text-xs text-emerald-400 break-all select-all flex-1">
                    {generatedKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(generatedKey, setCopiedKey)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all shrink-0"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Keys Table */}
            <div className="overflow-hidden border border-border/40 rounded-lg bg-background/30">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground font-bold">
                    <th className="p-3">Label</th>
                    <th className="p-3">Token Prefix</th>
                    <th className="p-3">Rate Limit</th>
                    <th className="p-3">Created</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground italic">
                        No active API keys found. Generate one above to connect the CLI.
                      </td>
                    </tr>
                  ) : (
                    keys.map((k) => (
                      <tr key={k.id} className="border-b border-border/20 hover:bg-muted/10">
                        <td className="p-3 font-semibold text-foreground">{k.name}</td>
                        <td className="p-3 font-mono text-muted-foreground">{k.key.substring(0, 15)}...</td>
                        <td className="p-3">{k.rateLimit} req/min</td>
                        <td className="p-3 text-muted-foreground">{new Date(k.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-all"
                            title="Revoke Key"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CLI Tutorial / Documentation */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h2 className="text-lg font-bold font-heading flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              CLI Terminal Connect Console
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground block">1. Install CLI Globally</span>
                <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <code className="text-xs text-zinc-300 flex-1 font-mono">npm install -g @prompta/cli</code>
                  <button
                    onClick={() => copyToClipboard("npm install -g @prompta/cli", setCopiedInstall)}
                    className="p-1 text-zinc-500 hover:text-zinc-300 transition-all"
                  >
                    {copiedInstall ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground block">2. Connect API Key</span>
                <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <code className="text-xs text-zinc-300 flex-1 font-mono">prompta login --key YOUR_API_KEY</code>
                  <button
                    onClick={() => copyToClipboard("prompta login --key YOUR_API_KEY", setCopiedLogin)}
                    className="p-1 text-zinc-500 hover:text-zinc-300 transition-all"
                  >
                    {copiedLogin ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-muted-foreground leading-relaxed list-decimal pl-4">
                <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono">prompta index</code> in your project folder to map directories.</li>
                <li>Optimize prompts locally via <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono">prompta optimize [file]</code>.</li>
                <li>Send token-efficient contexts into models directly from your terminal editor.</li>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Statistics & Ingestion Info */}
        <div className="space-y-6">
          {/* Active Projects */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FolderGit className="h-4 w-4 text-primary" />
              CLI Indexed Projects
            </h2>

            <div className="space-y-3">
              {loading ? (
                <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">
                  Loading indexed projects...
                </div>
              ) : projects.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No projects indexed yet. Run 'prompta index' inside your local repository.
                </p>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-muted/20 border border-border/40 rounded-lg hover:border-primary/30 transition-all space-y-1">
                    <span className="text-xs font-bold text-foreground block">{proj.name}</span>
                    <span className="text-[10px] text-muted-foreground block truncate">{proj.path || "No path set"}</span>
                    <div className="flex items-center gap-3 pt-1 text-[10px] text-primary font-semibold">
                      <span className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        {proj._count?.fileChunks || 0} Chunks
                      </span>
                      <span className="flex items-center gap-1">
                        <Code className="h-3 w-3" />
                        {proj._count?.contextSnapshots || 0} Snapshots
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Audit Logs Feed */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              CLI Connection Audit Log
            </h2>

            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
              {loading ? (
                <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">
                  Loading logs...
                </div>
              ) : logs.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No recent connection logs.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start text-[10px] border-b border-border/20 pb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded text-[9px] uppercase font-bold">
                          {log.method}
                        </span>
                        <code className="text-foreground font-mono">{log.endpoint}</code>
                      </div>
                      <span className="text-muted-foreground block text-[9px]">
                        Key: {log.apiKey?.name || "Deleted Key"}
                      </span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className={`font-semibold ${log.statusCode === 200 ? "text-emerald-500" : "text-destructive"}`}>
                        {log.statusCode}
                      </span>
                      <span className="text-muted-foreground block text-[9px]">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Workflow Ingested */}
          <div className="glass p-6 rounded-xl border border-border/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">CLI Ingested Patterns</span>
              <span className="text-2xl font-bold text-foreground font-heading">{patternsCount}</span>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
