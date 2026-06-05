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

export default function WasteTrackerPage() {
  const [activeRange, setActiveRange] = useState("30d");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Waste Tracker
          </h1>
          <p className="text-muted-foreground">
            Track AI interaction success rates, calculate total time savings, and audit software license utilization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveRange("7d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              activeRange === "7d"
                ? "bg-primary border-transparent text-primary-foreground"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setActiveRange("30d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              activeRange === "30d"
                ? "bg-primary border-transparent text-primary-foreground"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

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
          <h3 className="font-heading font-bold text-lg">AI Interactions Over Time</h3>
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
          <h3 className="font-heading font-bold text-lg">Department Time & Cost Savings</h3>
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
    </div>
  );
}
