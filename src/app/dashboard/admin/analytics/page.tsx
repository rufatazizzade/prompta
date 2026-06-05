"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Sparkles,
  Award,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// Mock user growth data
const userGrowthData = [
  { month: "Jan", users: 40 },
  { month: "Feb", users: 58 },
  { month: "Mar", users: 78 },
  { month: "Apr", users: 104 },
  { month: "May", users: 128 },
  { month: "Jun", users: 148 },
];

// Mock department engagement (average XP)
const deptEngagementData = [
  { name: "HR", xp: 1140 },
  { name: "Marketing", xp: 920 },
  { name: "Finance", xp: 1420 },
  { name: "Operations", xp: 880 },
  { name: "Sales", xp: 1050 },
  { name: "Support", xp: 740 },
];

// Mock tool popularity
const toolUsageData = [
  { name: "ChatGPT", value: 456, color: "#10a37f" },
  { name: "Claude", value: 289, color: "#d97706" },
  { name: "Gemini", value: 198, color: "#4285f4" },
  { name: "Perplexity", value: 167, color: "#20808d" },
  { name: "Copilot", value: 137, color: "#0078d4" },
];

// Mock learning path completion rates
const completionRateData = [
  { name: "HR Path", completed: 85, active: 15 },
  { name: "Marketing Path", completed: 62, active: 38 },
  { name: "Finance Path", completed: 78, active: 22 },
  { name: "Operations Path", completed: 45, active: 55 },
  { name: "Sales Path", completed: 70, active: 30 },
];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("6m");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-purple-500" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            View deep insights on AI literacy, department engagement rates, tool licensing allocations, and user growth curves.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all cursor-pointer">
            <Download className="h-3.5 w-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth curve */}
        <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
          <h3 className="font-heading font-bold text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Platform Headcount Growth
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="var(--primary)" fillOpacity={1} fill="url(#colorUsers)" name="Headcount" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department engagement */}
        <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
          <h3 className="font-heading font-bold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Department Engagement (Average XP)
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="xp" fill="var(--primary)" name="Average XP" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model breakdown */}
        <div className="glass p-6 rounded-xl border border-border/50 space-y-4 flex flex-col justify-between">
          <h3 className="font-heading font-bold text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Model Interactions Share
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={toolUsageData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {toolUsageData.map((entry, index) => (
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[10px] text-center pt-2">
            {toolUsageData.map((t, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="font-semibold block truncate" style={{ color: t.color }}>{t.name}</span>
                <span className="font-bold text-muted-foreground">{t.value} ({Math.round(t.value / 1187 * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Path Completion rate */}
        <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
          <h3 className="font-heading font-bold text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Learning Path Completion Rate (%)
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="completed" fill="var(--primary)" name="Completion Rate (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
