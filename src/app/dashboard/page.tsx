"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  TrendingUp,
  Compass,
  ListChecks,
  BookOpen,
  Trophy,
  ArrowRight,
  Clock,
  Star,
  Flame,
} from "lucide-react";
import { cn, formatXP, getXPProgress, getXPForNextLevel } from "@/lib/utils";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_USER = {
  name: "Alex",
  xp: 2_350,
  level: 5,
  tasksCompleted: 23,
  learningProgress: 67,
};

const MOCK_STATS = [
  {
    label: "Total XP",
    value: MOCK_USER.xp,
    formatted: formatXP(MOCK_USER.xp),
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    label: "Current Level",
    value: MOCK_USER.level,
    formatted: `Level ${MOCK_USER.level}`,
    icon: Star,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    label: "Tasks Completed",
    value: MOCK_USER.tasksCompleted,
    formatted: String(MOCK_USER.tasksCompleted),
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    label: "Learning Progress",
    value: MOCK_USER.learningProgress,
    formatted: `${MOCK_USER.learningProgress}%`,
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
];

const MOCK_ACTIVITY = [
  {
    id: "1",
    action: "Completed task",
    detail: "Write a ChatGPT prompt for customer email",
    xp: 75,
    time: "2h ago",
  },
  {
    id: "2",
    action: "Earned achievement",
    detail: "Prompt Engineer Lv. 2",
    xp: 100,
    time: "4h ago",
  },
  {
    id: "3",
    action: "Peer review received",
    detail: "Great use of structured prompts!",
    xp: 25,
    time: "Yesterday",
  },
  {
    id: "4",
    action: "Learning path progress",
    detail: "Advanced Prompt Engineering — Lesson 3",
    xp: 50,
    time: "Yesterday",
  },
  {
    id: "5",
    action: "AI Battle won",
    detail: "Best Claude summary challenge",
    xp: 150,
    time: "2 days ago",
  },
];

const QUICK_ACTIONS = [
  {
    label: "AI GPS",
    description: "Get tool recommendations",
    icon: Compass,
    href: "/dashboard/ai-gps",
    gradient: "from-primary to-violet-500",
  },
  {
    label: "Start Task",
    description: "Practice with real scenarios",
    icon: ListChecks,
    href: "/dashboard/tasks",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    label: "Knowledge Hub",
    description: "Browse articles & guides",
    icon: BookOpen,
    href: "/dashboard/knowledge",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    label: "Find Champion",
    description: "Connect with AI experts",
    icon: Trophy,
    href: "/dashboard/champions",
    gradient: "from-pink-500 to-rose-500",
  },
];

const MOCK_LEARNING_PATH = {
  title: "Advanced Prompt Engineering",
  progress: 60,
  currentLesson: "Chain-of-Thought Techniques",
  totalLessons: 12,
  completedLessons: 7,
};

// ─── Animated Counter ───────────────────────────────────────────────────────

function AnimatedCounter({
  value,
  formatted,
}: {
  value: number;
  formatted: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  // Use the formatted value when animation completes
  if (display >= value) {
    return <span>{formatted}</span>;
  }

  // During animation, show raw number for values, or formatted for percentage/level
  if (formatted.includes("%")) return <span>{display}%</span>;
  if (formatted.startsWith("Level")) return <span>Level {display}</span>;
  return <span>{formatXP(display)}</span>;
}

// ─── Stagger animation variants ─────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const xpProgress = getXPProgress(MOCK_USER.xp);
  const xpToNext = getXPForNextLevel(MOCK_USER.xp);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Welcome */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold font-heading">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {MOCK_USER.name}
          </span>
          ! 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your AI learning journey.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {MOCK_STATS.map((stat) => (
          <div
            key={stat.label}
            className="gradient-border shine group cursor-default"
          >
            <div className="rounded-[inherit] bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border",
                    stat.bgColor,
                    stat.borderColor
                  )}
                >
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold font-heading">
                <AnimatedCounter
                  value={stat.value}
                  formatted={stat.formatted}
                />
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* XP Progress Bar */}
      <motion.div variants={item} className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" />
            <span className="font-semibold font-heading">
              Level {MOCK_USER.level} Progress
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatXP(xpToNext)} XP to Level {MOCK_USER.level + 1}
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-violet-500 to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {xpProgress.toFixed(0)}% complete
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold font-heading mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.detail}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-emerald-500">
                      +{activity.xp} XP
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Active Learning Path */}
        <motion.div variants={item}>
          <div className="glass rounded-xl p-5 h-full">
            <h3 className="font-semibold font-heading mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              Active Learning Path
            </h3>
            <div className="gradient-border">
              <div className="rounded-[inherit] bg-card p-4 space-y-4">
                <p className="font-medium text-sm">
                  {MOCK_LEARNING_PATH.title}
                </p>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>
                      Lesson {MOCK_LEARNING_PATH.completedLessons}/
                      {MOCK_LEARNING_PATH.totalLessons}
                    </span>
                    <span>{MOCK_LEARNING_PATH.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${MOCK_LEARNING_PATH.progress}%`,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: 0.7,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="truncate">
                    Next: {MOCK_LEARNING_PATH.currentLesson}
                  </span>
                </div>
                <Link
                  href="/dashboard/learning"
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h3 className="font-semibold font-heading mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group shine gradient-border"
            >
              <div className="rounded-[inherit] bg-card p-5 transition-all duration-300 group-hover:bg-muted/50">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white mb-3",
                    action.gradient
                  )}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </p>
                <ArrowRight className="h-4 w-4 mt-3 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
