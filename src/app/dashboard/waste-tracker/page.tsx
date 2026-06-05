"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Info,
  Calendar,
  Database,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// Mock usage over time data (30 days)
const usageData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  success: Math.floor(Math.random() * 40) + 15,
  failed: Math.floor(Math.random() * 10) + 2,
}));

// Mock tool usage distribution data
const toolUsageData = [
  { name: "ChatGPT", usage: 456, color: "#10a37f" },
  { name: "Claude", usage: 289, color: "#d97706" },
  { name: "Gemini", usage: 198, color: "#4285f4" },
  { name: "Perplexity", usage: 167, color: "#20808d" },
  { name: "Copilot", usage: 137, color: "#0078d4" },
];

// Mock success rate pie chart data
const successRateData = [
  { name: "Success", value: 1047, color: "var(--primary)" },
  { name: "Failed / Wasted", value: 200, color: "var(--destructive)" },
];

// Mock department comparison data
const departmentData = [
  { name: "Marketing", hours: 142, cost: 5680 },
  { name: "HR", hours: 68, cost: 2720 },
  { name: "Sales", hours: 54, cost: 2160 },
  { name: "Finance", hours: 45, cost: 1800 },
  { name: "Operations", hours: 22, cost: 880 },
  { name: "Support", hours: 11, cost: 440 },
];

// Mock repeated queries data
const MOCK_REPEATED_QUERIES = [
  { id: "q-1", query: "Draft constructive performance feedback for supervisor appraisal form...", count: 24, savedMins: 480, tool: "Claude" },
  { id: "q-2", query: "VBA script variance threshold variance calculationsActual vs Budget...", count: 18, savedMins: 540, tool: "ChatGPT" },
  { id: "q-3", query: "SEO outline competitive checklist framework React NextJS roadmap...", count: 15, savedMins: 300, tool: "Perplexity" },
  { id: "q-4", query: "Translate legal terms of agreement clauses HR confidentiality...", count: 12, savedMins: 240, tool: "Claude" },
];

// Mock token optimization datasets for CLI context
const tokenSavingsData = [
  { name: "Day 1", before: 22000, after: 6800 },
  { name: "Day 5", before: 28000, after: 8400 },
  { name: "Day 10", before: 34000, after: 9800 },
  { name: "Day 15", before: 31000, after: 8900 },
  { name: "Day 20", before: 42000, after: 12100 },
  { name: "Day 25", before: 49000, after: 13900 },
  { name: "Day 30", before: 54000, after: 15400 },
];

const modelTokenSavings = [
  { name: "ChatGPT", before: 45000, after: 12000, efficiency: 73.3, color: "#10a37f" },
  { name: "Claude", before: 80000, after: 24000, efficiency: 70.0, color: "#d97706" },
  { name: "Qwen", before: 30000, after: 8000, efficiency: 73.3, color: "#4f46e5" },
  { name: "Gemini", before: 50000, after: 15000, efficiency: 70.0, color: "#4285f4" },
];

const projectTokenSavings = [
  { name: "Prompta-CLI", before: 32000, after: 9200, savings: 22800 },
  { name: "Logistics-Audit", before: 18000, after: 5400, savings: 12600 },
  { name: "Fintech-Parser", before: 45000, after: 13000, savings: 32000 },
  { name: "Docs-Indexer", before: 12000, after: 3600, savings: 8400 },
];

const MOCK_PROMPT_OPTIMIZATIONS = [
  { id: "o-1", query: "generate typescript schemas from raw database query response...", before: 450, after: 120, pct: "73.3%", saved: 330, date: "2 mins ago" },
  { id: "o-2", query: "construct custom mock user profiles for loading state test inputs...", before: 280, after: 90, pct: "67.8%", saved: 190, date: "10 mins ago" },
  { id: "o-3", query: "write automated test script in playwright for clicking layout...", before: 620, after: 170, pct: "72.5%", saved: 450, date: "1 hr ago" },
  { id: "o-4", query: "regex capture groupings extract phone formats standard formats...", before: 180, after: 50, pct: "72.2%", saved: 130, date: "2 hrs ago" },
];

export default function WasteTrackerPage() {
  const [activeRange, setActiveRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("license"); // "license" | "tokens"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Waste & Optimization Tracker
          </h1>
          <p className="text-muted-foreground">
            Track AI interaction success rates, calculate total time savings, and audit token compression metrics.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/40 p-1.5 rounded-lg border border-border/40 shrink-0">
          <button
            onClick={() => setActiveTab("license")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "license"
                ? "bg-primary border-transparent text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            License & Time Savings
          </button>
          <button
            onClick={() => setActiveTab("tokens")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === "tokens"
                ? "bg-primary border-transparent text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="h-3 w-3" />
            CLI Token Savings
          </button>
        </div>
      </div>

      {activeTab === "license" ? (
        <>
          {/* Top Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Interactions */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Total Interactions</span>
                <h2 className="text-3xl font-bold font-heading">1,247</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+14.2% since last month</span>
                </p>
              </div>
            </div>

            {/* Success Rate */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Success Rate</span>
                <h2 className="text-3xl font-bold font-heading">84%</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Industry benchmark: 72%</span>
                </p>
              </div>
            </div>

            {/* Hours Saved */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Hours Saved</span>
                <h2 className="text-3xl font-bold font-heading">342 hrs</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Avg 16.4 mins per successful query</span>
                </p>
              </div>
            </div>

            {/* Cost Savings */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Cost Savings</span>
                <h2 className="text-3xl font-bold font-heading">$12,450</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>ROI: 3.4x on licensing overhead</span>
                </p>
              </div>
            </div>
          </div>

          {/* Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Usage Over Time */}
            <div className="lg:col-span-2 glass p-6 rounded-xl border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg">AI Interactions Over Time</h3>
                <div className="flex items-center gap-1 bg-background/50 border border-border/40 p-1 rounded-md text-[10px]">
                  <button onClick={() => setActiveRange("7d")} className={`px-2 py-0.5 rounded ${activeRange === "7d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>7d</button>
                  <button onClick={() => setActiveRange("30d")} className={`px-2 py-0.5 rounded ${activeRange === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>30d</button>
                </div>
              </div>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tickLine={false} />
                    <YAxis tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Area type="monotone" dataKey="success" stroke="var(--primary)" fillOpacity={1} fill="url(#colorSuccess)" name="Successful Queries" />
                    <Area type="monotone" dataKey="failed" stroke="var(--destructive)" fillOpacity={1} fill="url(#colorFailed)" name="Wasted / Failed Queries" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Success breakdown */}
            <div className="lg:col-span-1 glass p-6 rounded-xl border border-border/50 flex flex-col justify-between">
              <h3 className="font-heading font-bold text-lg">Efficiency Breakdown</h3>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={successRateData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                      {successRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Successful Tasks
                  </span>
                  <span>1,047 ({Math.round(1047/1247*100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    Fails / Duplicate Waste
                  </span>
                  <span>200 ({Math.round(200/1247*100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row of Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tool usage comparison */}
            <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
              <h3 className="font-heading font-bold text-lg">Interactions by AI Model</h3>
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={toolUsageData} layout="vertical" margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tickLine={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="usage" radius={[0, 4, 4, 0]}>
                      {toolUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department savings */}
            <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
              <h3 className="font-heading font-bold text-lg">Department Time Savings</h3>
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="hours" fill="var(--primary)" name="Hours Saved" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Section: Repeated Queries Table */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg">Repeated Query Audit</h3>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                Common duplicates fit for global templates.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-foreground uppercase border-b border-border/40">
                  <tr>
                    <th className="py-3 px-4">Repeated Query Segment</th>
                    <th className="py-3 px-4 text-center">Repeat Count</th>
                    <th className="py-3 px-4 text-center">AI Tool used</th>
                    <th className="py-3 px-4 text-right">Potential Hours Wasted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {MOCK_REPEATED_QUERIES.map((q) => (
                    <tr key={q.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground truncate max-w-[300px]">
                        "{q.query}"
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-foreground">
                        {q.count} times
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full border bg-muted font-semibold">
                          {q.tool}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-rose-500 font-semibold">
                        {Math.round(q.savedMins / 60)} hrs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* CLI Token Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tokens Optimized */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Total Tokens Optimized</span>
                <h2 className="text-3xl font-bold font-heading">198.4K</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  <span>Compressed via CLI pipeline</span>
                </p>
              </div>
            </div>

            {/* Avg Efficiency Gain */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Avg Efficiency Gain</span>
                <h2 className="text-3xl font-bold font-heading">71.2%</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  <span>Reduction in prompt redundancy</span>
                </p>
              </div>
            </div>

            {/* Tokens Saved */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Tokens Saved</span>
                <h2 className="text-3xl font-bold font-heading">142.5K</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>Equivalent context window savings</span>
                </p>
              </div>
            </div>

            {/* CLI Saved Time */}
            <div className="glass p-6 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">CLI Saved Time</span>
                <h2 className="text-3xl font-bold font-heading">75 hrs</h2>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>From automated context generation</span>
                </p>
              </div>
            </div>
          </div>

          {/* CLI Token Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Token Savings Over Time */}
            <div className="lg:col-span-2 glass p-6 rounded-xl border border-border/50 space-y-4">
              <h3 className="font-heading font-bold text-lg">CLI Token Optimization Over Time</h3>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tokenSavingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Area type="monotone" dataKey="before" stroke="var(--destructive)" fillOpacity={1} fill="url(#colorBefore)" name="Original Prompt Tokens" />
                    <Area type="monotone" dataKey="after" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAfter)" name="Optimized Prompt Tokens" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model optimization stats */}
            <div className="lg:col-span-1 glass p-6 rounded-xl border border-border/50 space-y-4">
              <h3 className="font-heading font-bold text-lg">Avg Efficiency by LLM</h3>
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelTokenSavings} layout="vertical" margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tickLine={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="efficiency" radius={[0, 4, 4, 0]} name="Efficiency %">
                      {modelTokenSavings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Project savings bar chart */}
          <div className="grid grid-cols-1 gap-8">
            <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
              <h3 className="font-heading font-bold text-lg">Tokens Saved per Project Workspace</h3>
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectTokenSavings} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="before" fill="var(--destructive)" name="Original Tokens" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="after" fill="var(--primary)" name="Compressed Tokens" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Prompt Auditing List Table */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg">CLI Optimizations Audit Feed</h3>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                Live prompt compaction audit stream.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-foreground uppercase border-b border-border/40">
                  <tr>
                    <th className="py-3 px-4">User Query Segment</th>
                    <th className="py-3 px-4 text-center">Original Tokens</th>
                    <th className="py-3 px-4 text-center">Optimized Tokens</th>
                    <th className="py-3 px-4 text-center">Savings Ratio</th>
                    <th className="py-3 px-4 text-right">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {MOCK_PROMPT_OPTIMIZATIONS.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground truncate max-w-[300px]">
                        "{o.query}"
                      </td>
                      <td className="py-4 px-4 text-center font-mono">{o.before}</td>
                      <td className="py-4 px-4 text-center font-mono">{o.after}</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">{o.pct}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
