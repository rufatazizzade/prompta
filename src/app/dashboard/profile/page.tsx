"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Building,
  Award,
  Sparkles,
  Edit2,
  Calendar,
  BookOpen,
  MessageCircle,
  ListChecks,
  Key,
  LogOut,
  Trophy,
  CheckCircle,
} from "lucide-react";
import { DEPARTMENTS, SKILL_LEVELS } from "@/lib/constants";
import { getXPProgress, getXPForNextLevel, getLevelFromXP, generateAvatar } from "@/lib/utils";

// Mock user stats
const MOCK_STATS = {
  xp: 1250,
  tasksCompleted: 8,
  reviewsGiven: 5,
  articlesPublished: 2,
};

// Mock achievements (earned)
const MOCK_EARNED_ACHIEVEMENTS = [
  { name: "First Prompt", desc: "Submit your first template solution.", date: "2026-05-20" },
  { name: "AI Enthusiast", desc: "Run 10 recommendation queries.", date: "2026-05-24" },
  { name: "Critical Thinker", desc: "Submit 5 constructive peer reviews.", date: "2026-06-01" },
  { name: "AI Champion", desc: "Appointed as an AI Champion.", date: "2026-06-03" },
];

// Mock activity timeline
const MOCK_ACTIVITIES = [
  { id: "act-1", action: "Submitted solution to 'HR Resume Screening Assistant Setup'", time: "2 hours ago" },
  { id: "act-2", action: "Voted in the 'B2B Sales Outreach Subject Lines' Arena Battle", time: "5 hours ago" },
  { id: "act-3", action: "Received constructive review from Alex Mercer (+30 XP)", time: "1 day ago" },
  { id: "act-4", action: "Published article: 'Claude parameters - how temperature changes creativity'", time: "2 days ago" },
];

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [editing, setEditing] = useState(false);

  // Form states
  const [name, setName] = useState(session?.user?.name || "User");
  const [bio, setBio] = useState("AI explorer, eager to automate administrative reports and master prompting frameworks.");
  const [selectedDept, setSelectedDept] = useState(session?.user?.department || "Marketing");
  const [skillLevel, setSkillLevel] = useState(session?.user?.skillLevel || "beginner");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const userEmail = session?.user?.email || "user@company.com";
  const userXP = session?.user?.xp || MOCK_STATS.xp;
  const level = getLevelFromXP(userXP);
  const xpProgress = getXPProgress(userXP);
  const xpToNext = getXPForNextLevel(userXP);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API save
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal AI training account details, view statistics, and review earned certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account info card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-border/50 text-center relative overflow-hidden">
            {/* Crown Icon if Level is high */}
            <div className="absolute top-4 right-4 text-amber-500">
              <Trophy className="h-5 w-5 fill-amber-500/20" />
            </div>

            <div className="space-y-4">
              {/* Large Avatar */}
              <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/30 text-primary flex items-center justify-center text-3xl font-black mx-auto">
                {generateAvatar(name)}
              </div>

              <div>
                <h2 className="text-xl font-bold font-heading">{name}</h2>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-border/20">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase">
                  {selectedDept}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-muted border border-border/30 text-foreground uppercase">
                  Level {level} ({skillLevel})
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed italic px-2">
                "{bio}"
              </p>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={() => setEditing(!editing)}
                  className="w-full bg-muted hover:bg-muted/80 text-foreground border border-border/50 font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Profile Parameters</span>
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full bg-destructive/10 hover:bg-destructive/15 text-destructive border border-destructive/20 font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* Level Stats Summary */}
          <div className="glass p-6 rounded-2xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-sm text-foreground">XP Progression Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>Next Level Progress</span>
                <span className="text-primary">{xpToNext} XP to Lvl {level + 1}</span>
              </div>
              <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden border border-border/30">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Forms, Stats & timeline */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            // Profile Edit Form Card
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-2xl border border-border/50 space-y-6"
            >
              <h3 className="font-heading font-bold text-xl">Edit Profile Parameters</h3>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Full Name:</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Department:</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Short Bio (Displayed on cards):</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Self-Assessed Skill Level:</label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none"
                  >
                    {SKILL_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} &mdash; {level.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground rounded-lg text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Parameters"}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            // Statistics Overview Grid
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-4 rounded-xl border border-border/50 text-center">
                <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Total XP</span>
                <p className="text-2xl font-bold mt-1 text-foreground">{userXP}</p>
              </div>

              <div className="glass p-4 rounded-xl border border-border/50 text-center">
                <ListChecks className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Tasks Completed</span>
                <p className="text-2xl font-bold mt-1 text-foreground">{MOCK_STATS.tasksCompleted}</p>
              </div>

              <div className="glass p-4 rounded-xl border border-border/50 text-center">
                <MessageCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Reviews Written</span>
                <p className="text-2xl font-bold mt-1 text-foreground">{MOCK_STATS.reviewsGiven}</p>
              </div>

              <div className="glass p-4 rounded-xl border border-border/50 text-center">
                <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Articles Shared</span>
                <p className="text-2xl font-bold mt-1 text-foreground">{MOCK_STATS.articlesPublished}</p>
              </div>
            </div>
          )}

          {/* Unlocked milestones row */}
          <div className="glass p-6 rounded-2xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Latest Earned Milestones
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_EARNED_ACHIEVEMENTS.map((ac, i) => (
                <div key={i} className="p-4 bg-muted/40 border border-border/30 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{ac.name}</h4>
                    <p className="text-muted-foreground mt-0.5">{ac.desc}</p>
                    <span className="text-[10px] text-muted-foreground block mt-1">Earned on: {ac.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass p-6 rounded-2xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Platform Activities
            </h3>

            <div className="relative border-l border-border/40 pl-4 ml-2 space-y-5 text-xs">
              {MOCK_ACTIVITIES.map((act) => (
                <div key={act.id} className="relative">
                  {/* Timeline bullet */}
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <div className="space-y-0.5">
                    <p className="text-foreground leading-relaxed">{act.action}</p>
                    <span className="text-muted-foreground text-[10px]">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
