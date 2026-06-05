"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  GraduationCap,
  ListChecks,
  MessageCircle,
  BookOpen,
  Users,
  Award,
  Zap,
  Lock,
  Unlock,
  CheckCircle,
} from "lucide-react";
import { getXPProgress, getXPForNextLevel, getLevelFromXP, formatXP } from "@/lib/utils";

// Mock user XP
const USER_XP = 1250;

// Mock achievements data
const MOCK_ACHIEVEMENTS = [
  {
    id: "ac-1",
    name: "First Prompt",
    description: "Successfully submit your first prompt template solution.",
    category: "Tasks",
    xpReward: 50,
    earned: true,
    earnedDate: "2026-05-20T14:30:00Z",
    progress: 100,
    target: 100,
    icon: Sparkles,
  },
  {
    id: "ac-2",
    name: "AI Enthusiast",
    description: "Run 10 AI recommend queries through the AI GPS.",
    category: "General",
    xpReward: 100,
    earned: true,
    earnedDate: "2026-05-24T18:12:00Z",
    progress: 10,
    target: 10,
    icon: Zap,
  },
  {
    id: "ac-3",
    name: "Critical Thinker",
    description: "Submit 5 peer reviews with detailed recommendations.",
    category: "Reviews",
    xpReward: 150,
    earned: true,
    earnedDate: "2026-06-01T09:45:00Z",
    progress: 5,
    target: 5,
    icon: MessageCircle,
  },
  {
    id: "ac-4",
    name: "AI Champion",
    description: "Be appointed as an AI Champion for your department.",
    category: "Social",
    xpReward: 300,
    earned: true,
    earnedDate: "2026-06-03T11:00:00Z",
    progress: 1,
    target: 1,
    icon: Award,
  },
  {
    id: "ac-5",
    name: "Knowledge Sharer",
    description: "Publish 3 articles in the internal AI Knowledge Hub.",
    category: "Knowledge",
    xpReward: 150,
    earned: false,
    progress: 2,
    target: 3,
    icon: BookOpen,
  },
  {
    id: "ac-6",
    name: "Learning Explorer",
    description: "Complete your department's Level 2 Learning Path.",
    category: "Learning",
    xpReward: 200,
    earned: false,
    progress: 75,
    target: 100,
    icon: GraduationCap,
  },
  {
    id: "ac-7",
    name: "Master Detective",
    description: "Spot 5 hallucination bugs in the AI Detective arena.",
    category: "Tasks",
    xpReward: 150,
    earned: false,
    progress: 3,
    target: 5,
    icon: ListChecks,
  },
  {
    id: "ac-8",
    name: "Super Colleague",
    description: "Receive 10 'Helpful' votes on reviews you've written.",
    category: "Reviews",
    xpReward: 200,
    earned: false,
    progress: 6,
    target: 10,
    icon: Users,
  },
  {
    id: "ac-9",
    name: "Prompt Engineer",
    description: "Clone 15 prompts from the Prompt Marketplace.",
    category: "Knowledge",
    xpReward: 100,
    earned: false,
    progress: 12,
    target: 15,
    icon: BookOpen,
  },
  {
    id: "ac-10",
    name: "AI Battle Legend",
    description: "Win 3 prompt battle challenges against colleagues.",
    category: "Social",
    xpReward: 250,
    earned: false,
    progress: 1,
    target: 3,
    icon: Trophy,
  },
  {
    id: "ac-11",
    name: "Perfect Streak",
    description: "Log an AI interaction in the Waste Tracker for 7 consecutive days.",
    category: "General",
    xpReward: 100,
    earned: false,
    progress: 4,
    target: 7,
    icon: Zap,
  },
  {
    id: "ac-12",
    name: "Simulation Master",
    description: "Achieve a score of 95%+ in 3 AI Simulator scenarios.",
    category: "Learning",
    xpReward: 250,
    earned: false,
    progress: 1,
    target: 3,
    icon: GraduationCap,
  },
];

const CATEGORIES = ["All", "General", "Learning", "Tasks", "Reviews", "Knowledge", "Social"];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredAchievements = MOCK_ACHIEVEMENTS.filter(
    (ac) => selectedCategory === "All" || ac.category === selectedCategory
  );

  const level = getLevelFromXP(USER_XP);
  const xpProgress = getXPProgress(USER_XP);
  const xpToNext = getXPForNextLevel(USER_XP);

  const totalEarned = MOCK_ACHIEVEMENTS.filter((ac) => ac.earned).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-500" />
          Achievements
        </h1>
        <p className="text-muted-foreground">
          Track your personal milestones and gamified challenges on the Prompta platform.
        </p>
      </div>

      {/* Level XP Card */}
      <div className="glass p-6 rounded-2xl border border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Level Circle */}
          <div className="md:col-span-1 flex flex-col items-center justify-center border-b border-border/30 md:border-b-0 md:border-r border-border/30 pb-6 md:pb-0">
            <span className="text-sm text-muted-foreground font-semibold">CURRENT LEVEL</span>
            <div className="mt-2 text-6xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent drop-shadow-sm">
              Lvl {level}
            </div>
            <span className="text-xs text-muted-foreground mt-1">XP Total: {formatXP(USER_XP)}</span>
          </div>

          {/* Progress Bar */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Next Level (Lvl {level + 1})</span>
              <span className="text-primary">{xpToNext} XP Remaining</span>
            </div>
            <div className="w-full bg-muted/60 h-4 rounded-full overflow-hidden border border-border/35">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent xp-bar-fill rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{level * 500} XP</span>
              <span>{(level + 1) * 500} XP</span>
            </div>
          </div>

          {/* Ratio Statistics */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground font-semibold">MILESTONES COMPLETED</span>
            <div className="mt-2 text-5xl font-bold font-heading text-foreground">
              {totalEarned} <span className="text-2xl text-muted-foreground">/ {MOCK_ACHIEVEMENTS.length}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((totalEarned / MOCK_ACHIEVEMENTS.length) * 100)}% Achievements Unlocked
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/30 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map((ac) => {
          const Icon = ac.icon;
          return (
            <div
              key={ac.id}
              className={`glass p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                ac.earned
                  ? "border-primary/30 shadow-md shadow-primary/5 bg-gradient-to-b from-primary/5 to-transparent"
                  : "border-border/50 opacity-60 hover:opacity-80"
              }`}
            >
              {ac.earned && (
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-primary/20 via-transparent to-transparent flex items-start justify-end p-2 pointer-events-none">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              )}

              <div className="space-y-4">
                {/* Icon Circle */}
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${
                  ac.earned
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-muted/50 border-border/50 text-muted-foreground"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg flex items-center gap-1.5">
                    {ac.name}
                    {!ac.earned && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ac.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30">
                {ac.earned ? (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Unlocked on:</span>
                    <span className="font-semibold">{new Date(ac.earnedDate!).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-muted-foreground">Progress:</span>
                      <span>
                        {ac.progress} / {ac.target}
                      </span>
                    </div>
                    {/* Tiny Progress Bar */}
                    <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden border border-border/20">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(ac.progress / ac.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
