"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Users,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  CheckCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Contribution {
  id: string;
  pointsEarned: number;
  promptUsed: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Sprint {
  id: string;
  title: string;
  description: string;
  targetScore: number;
  endDate: string;
  contributions: Contribution[];
}

export default function HackathonsPage() {
  const { data: session } = useSession();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [scoreboard, setScoreboard] = useState<Record<string, number>>({});
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchSprintData = async () => {
    try {
      const res = await fetch("/api/ai/sprints");
      const data = await res.json();
      setSprint(data.sprint);
      setScoreboard(data.scoreboard);
    } catch (err) {
      console.error("Failed to load sprint data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprintData();
  }, []);

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !sprint || !session?.user) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/ai/sprints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sprintId: sprint.id,
          userId: (session.user as any).id,
          promptUsed: prompt.trim(),
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess(true);
      setPrompt("");
      await fetchSprintData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to submit contribution:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <span>Loading sprint details...</span>
      </div>
    );
  }

  const userDept = (session?.user as any)?.department || "Operations";
  const totalSprintScore = Object.values(scoreboard).reduce((a, b) => a + b, 0);
  const progressPercent = Math.min(Math.round((totalSprintScore / (sprint?.targetScore || 5000)) * 100), 100);

  return (
    <div className="space-y-8">
      {/* Back button & Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/battle"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Battle Arena
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
              <Award className="h-8 w-8 text-rose-500" />
              Corporate AI Sprints
            </h1>
            <p className="text-muted-foreground">
              Collaborative hackathons where departments work together to construct the ultimate prompting templates.
            </p>
          </div>
        </div>
      </div>

      {/* Sprints Banner & Shared Target Progress */}
      {sprint && (
        <div className="glass p-6 rounded-2xl border border-border/50 space-y-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-rose-500/5 blur-3xl" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold w-fit">
            <Clock className="h-3.5 w-3.5" />
            <span>Active Sprint Week</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h2 className="text-xl font-bold font-heading">{sprint.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{sprint.description}</p>
          </div>

          {/* Shared target goal progress bar */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-bold">SHARED COMPANY TARGET</span>
              <span className="font-bold text-rose-500">
                {totalSprintScore.toLocaleString()} / {sprint.targetScore.toLocaleString()} XP ({progressPercent}%)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-primary"
              />
            </div>
            <span className="text-[10px] text-muted-foreground block">
              Every prompt you log earns 150 points for your department toward our shared goal. Let's build together!
            </span>
          </div>
        </div>
      )}

      {/* Scoreboard and Contributions Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Department Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-xl border border-border/50 space-y-6">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2 border-b border-border/40 pb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              Department Scoreboard
            </h3>
            <div className="space-y-4">
              {Object.entries(scoreboard)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, score], idx) => {
                  const isUserDept = dept === userDept;
                  const maxScore = Math.max(...Object.values(scoreboard)) || 1;
                  const ratio = Math.max(Math.round((score / maxScore) * 100), 5);

                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="text-muted-foreground w-4">{idx + 1}.</span>
                          <span className={isUserDept ? "text-primary font-bold" : "text-foreground"}>
                            {dept} {isUserDept && "(Your Dept)"}
                          </span>
                        </div>
                        <span className="font-bold">{score.toLocaleString()} XP</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ratio}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.05 }}
                          className={`h-full rounded-full ${isUserDept ? "bg-primary" : "bg-muted-foreground/40"}`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Sprint Activity Feed */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-6">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Live Sprint Contributions
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {sprint && sprint.contributions.length > 0 ? (
                sprint.contributions.map((c) => (
                  <div key={c.id} className="p-4 bg-muted/20 border border-border/20 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground">{c.user.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono bg-background/50 p-2 border border-border/10 rounded">
                      {c.promptUsed}
                    </p>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">
                        +150 XP for Department
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic block text-center py-4">
                  No contributions logged yet. Be the first to add a prompt!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Submit Prompt Form */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4 sticky top-6">
            <h3 className="font-heading font-bold text-lg">Log Department Prompt</h3>
            <p className="text-xs text-muted-foreground">
              Add a prompt template you engineered to solve logistics tasks. Submitting awards points immediately to your department score.
            </p>

            {success ? (
              <div className="py-6 text-center space-y-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm">Points Awarded!</h4>
                <p className="text-[11px] text-muted-foreground px-4">
                  You scored +150 points for the <strong>{userDept}</strong> department.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContribution} className="space-y-4">
                <textarea
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Paste your operational logistics prompt template here..."
                  rows={6}
                  className="w-full bg-background/50 border border-input rounded-lg p-3 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-foreground"
                />
                <button
                  type="submit"
                  disabled={submitting || !prompt.trim()}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Zap className="h-4 w-4 fill-white" />
                  {submitting ? "Logging prompt..." : "Log Prompt (+150 XP)"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
