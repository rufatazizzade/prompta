"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Activity,
  CheckCircle,
  AlertTriangle,
  FolderKanban,
  FileText,
  UserPlus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock daily active users (14 days)
const activeUsersData = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  active: Math.floor(Math.random() * 20) + 30,
}));

// Mock recent registrations
const MOCK_REGISTRATIONS = [
  { id: "reg-1", name: "Courtney Henry", email: "courtney@company.com", dept: "HR", date: "2026-06-05" },
  { id: "reg-2", name: "Albert Flores", email: "albert@company.com", dept: "Marketing", date: "2026-06-05" },
  { id: "reg-3", name: "Jenny Wilson", email: "jenny@company.com", dept: "Finance", date: "2026-06-04" },
  { id: "reg-4", name: "Bessie Cooper", email: "bessie@company.com", dept: "Operations", date: "2026-06-04" },
  { id: "reg-5", name: "Annette Black", email: "annette@company.com", dept: "Sales", date: "2026-06-03" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            Admin Overview
          </h1>
          <p className="text-muted-foreground">
            Manage global settings, audit registrations, examine system status, and configure prompt frameworks.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl border border-border/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Users</span>
            <h2 className="text-2xl font-bold font-heading">148</h2>
            <p className="text-[10px] text-emerald-500 font-semibold">+12 this week</p>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-border/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Active Today</span>
            <h2 className="text-2xl font-bold font-heading">42</h2>
            <p className="text-[10px] text-emerald-500 font-semibold">28.3% daily active</p>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-border/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
            <FolderKanban className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Tasks Created</span>
            <h2 className="text-2xl font-bold font-heading">35</h2>
            <p className="text-[10px] text-muted-foreground">Across 6 departments</p>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-border/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Average XP</span>
            <h2 className="text-2xl font-bold font-heading">1,250 XP</h2>
            <p className="text-[10px] text-emerald-500 font-semibold">Level 3 avg progress</p>
          </div>
        </div>
      </div>

      {/* Main split dashboard panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Area: Active users line chart and registrations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Users Chart */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg">Daily Active Users Trend</h3>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeUsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line type="monotone" dataKey="active" stroke="var(--primary)" strokeWidth={2} dot={{ fill: "var(--primary)" }} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Registrations List */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg">Recent User Registrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-foreground uppercase border-b border-border/40">
                  <tr>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4 text-center">Department</th>
                    <th className="py-2.5 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {MOCK_REGISTRATIONS.map((reg) => (
                    <tr key={reg.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4 text-foreground font-semibold">{reg.name}</td>
                      <td className="py-3 px-4">{reg.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted border font-semibold">
                          {reg.dept}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">{reg.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Area: System health and actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg">Administrative Actions</h3>
            <div className="flex flex-col gap-2.5 text-xs font-semibold">
              <Link
                href="/dashboard/admin/users"
                className="w-full py-2.5 px-4 border border-border hover:border-primary/50 rounded-lg flex items-center justify-between hover:bg-muted/30 transition-all"
              >
                <span>Manage Users & Roles</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link
                href="/dashboard/admin/tasks"
                className="w-full py-2.5 px-4 border border-border hover:border-primary/50 rounded-lg flex items-center justify-between hover:bg-muted/30 transition-all"
              >
                <span>Create Learning Task</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link
                href="/dashboard/admin/moderation"
                className="w-full py-2.5 px-4 border border-border hover:border-primary/50 rounded-lg flex items-center justify-between hover:bg-muted/30 transition-all"
              >
                <span>Audit Content Moderation</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg">System Health Status</h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Prisma Database Client:</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Groq AI Recommendation API:</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">NextAuth Authentication:</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
