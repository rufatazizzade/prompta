'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Megaphone,
  Banknote,
  Settings,
  TrendingUp,
  Headphones,
  Check,
  Lock,
  Star,
  Zap,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type LevelStatus = 'completed' | 'current' | 'locked';

interface PathLevel {
  level: number;
  title: string;
  description: string;
  xp: number;
  status: LevelStatus;
}

interface LearningPath {
  id: string;
  department: string;
  title: string;
  icon: LucideIcon;
  color: string;
  xpEarned: number;
  xpTotal: number;
  currentLevel: number;
  totalLevels: number;
  levels: PathLevel[];
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'hr',
    department: 'HR',
    title: 'HR AI Mastery',
    icon: Users,
    color: '#8b5cf6',
    xpEarned: 750,
    xpTotal: 2000,
    currentLevel: 2,
    totalLevels: 4,
    levels: [
      { level: 1, title: 'Prompt Engineering Basics', description: 'Master the fundamentals of crafting effective prompts for HR workflows', xp: 250, status: 'completed' },
      { level: 2, title: 'AI-Powered Recruitment', description: 'Leverage AI for resume screening, candidate matching, and interview prep', xp: 500, status: 'current' },
      { level: 3, title: 'Employee Engagement Analytics', description: 'Use AI to analyze sentiment, predict attrition, and boost culture', xp: 500, status: 'locked' },
      { level: 4, title: 'Strategic HR Intelligence', description: 'Build AI-driven workforce planning and policy recommendation systems', xp: 750, status: 'locked' },
    ],
  },
  {
    id: 'marketing',
    department: 'Marketing',
    title: 'Marketing AI Mastery',
    icon: Megaphone,
    color: '#ec4899',
    xpEarned: 1250,
    xpTotal: 2000,
    currentLevel: 3,
    totalLevels: 4,
    levels: [
      { level: 1, title: 'Prompt Engineering Basics', description: 'Learn core prompt techniques for marketing content generation', xp: 250, status: 'completed' },
      { level: 2, title: 'Content & Copy Generation', description: 'Create compelling campaigns, social posts, and ad copy with AI', xp: 500, status: 'completed' },
      { level: 3, title: 'Audience Insights & SEO', description: 'Harness AI for keyword research, audience segmentation, and trend analysis', xp: 500, status: 'current' },
      { level: 4, title: 'Brand Strategy Automation', description: 'Automate brand monitoring, competitive analysis, and strategic planning', xp: 750, status: 'locked' },
    ],
  },
  {
    id: 'finance',
    department: 'Finance',
    title: 'Finance AI Mastery',
    icon: Banknote,
    color: '#10b981',
    xpEarned: 250,
    xpTotal: 2000,
    currentLevel: 1,
    totalLevels: 4,
    levels: [
      { level: 1, title: 'Prompt Engineering Basics', description: 'Understand effective prompting for financial data interpretation', xp: 250, status: 'completed' },
      { level: 2, title: 'Financial Report Automation', description: 'Automate data extraction, report writing, and reconciliation tasks', xp: 500, status: 'current' },
      { level: 3, title: 'Risk & Compliance AI', description: 'Build AI workflows for risk assessment and regulatory compliance', xp: 500, status: 'locked' },
      { level: 4, title: 'Predictive Financial Modeling', description: 'Create AI-powered forecasts, budgets, and strategic models', xp: 750, status: 'locked' },
    ],
  },
  {
    id: 'operations',
    department: 'Operations',
    title: 'Operations AI Mastery',
    icon: Settings,
    color: '#f59e0b',
    xpEarned: 500,
    xpTotal: 2000,
    currentLevel: 2,
    totalLevels: 4,
    levels: [
      { level: 1, title: 'Prompt Engineering Basics', description: 'Master prompting for process optimization and efficiency', xp: 250, status: 'completed' },
      { level: 2, title: 'Process Optimization', description: 'Use AI to map, analyze, and streamline operational workflows', xp: 500, status: 'current' },
      { level: 3, title: 'Supply Chain Intelligence', description: 'Apply AI for demand forecasting, inventory optimization, and logistics', xp: 500, status: 'locked' },
      { level: 4, title: 'Autonomous Operations', description: 'Design self-optimizing systems with AI agents and automation', xp: 750, status: 'locked' },
    ],
  },
  {
    id: 'sales',
    department: 'Sales',
    title: 'Sales AI Mastery',
    icon: TrendingUp,
    color: '#3b82f6',
    xpEarned: 2000,
    xpTotal: 2000,
    currentLevel: 4,
    totalLevels: 4,
    levels: [
      { level: 1, title: 'Prompt Engineering Basics', description: 'Craft prompts for lead generation and customer interaction', xp: 250, status: 'completed' },
      { level: 2, title: 'AI-Assisted Prospecting', description: 'Use AI for lead scoring, outreach personalization, and CRM enrichment', xp: 500, status: 'completed' },
      { level: 3, title: 'Sales Intelligence & Forecasting', description: 'Leverage AI for pipeline analysis, deal scoring, and forecasting', xp: 500, status: 'completed' },
      { level: 4, title: 'Revenue Operations Mastery', description: 'Build full-stack AI revenue engines with predictive analytics', xp: 750, status: 'completed' },
    ],
  },
  {
    id: 'support',
    department: 'Customer Support',
    title: 'Support AI Mastery',
    icon: Headphones,
    color: '#06b6d4',
    xpEarned: 0,
    xpTotal: 2000,
    currentLevel: 0,
    totalLevels: 4,
    levels: [
      { level: 1, title: 'Prompt Engineering Basics', description: 'Learn to prompt AI for customer query resolution and routing', xp: 250, status: 'current' },
      { level: 2, title: 'Smart Ticket Resolution', description: 'Automate ticket categorization, response drafting, and escalation', xp: 500, status: 'locked' },
      { level: 3, title: 'Knowledge Base Generation', description: 'Use AI to auto-generate and maintain support documentation', xp: 500, status: 'locked' },
      { level: 4, title: 'Proactive Support Intelligence', description: 'Build predictive support systems that resolve issues before they happen', xp: 750, status: 'locked' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
      <motion.div
        className="h-full rounded-full xp-bar-fill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

function StatusIcon({ status }: { status: LevelStatus }) {
  if (status === 'completed') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
        <Check className="h-4 w-4" />
      </div>
    );
  }
  if (status === 'current') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulse">
        <Star className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Lock className="h-4 w-4" />
    </div>
  );
}

function LevelNode({ level, isLast }: { level: PathLevel; isLast: boolean }) {
  return (
    <div className="relative flex gap-4">
      {/* Vertical connector line */}
      <div className="flex flex-col items-center">
        <StatusIcon status={level.status} />
        {!isLast && (
          <div
            className={cn(
              'w-0.5 flex-1 min-h-8',
              level.status === 'completed'
                ? 'bg-emerald-500/40'
                : 'bg-border'
            )}
          />
        )}
      </div>

      {/* Level content */}
      <div
        className={cn(
          'flex-1 pb-6 -mt-0.5',
          level.status === 'locked' && 'opacity-50'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Level {level.level}
          </span>
          {level.status === 'current' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Current
            </span>
          )}
        </div>
        <h4 className="mt-1 text-sm font-semibold text-foreground">
          {level.title}
        </h4>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
          {level.description}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-500">
          <Zap className="h-3 w-3" />
          {level.xp} XP
        </div>
      </div>
    </div>
  );
}

function PathCard({ path, index }: { path: LearningPath; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const progressPercent = Math.round((path.xpEarned / path.xpTotal) * 100);
  const Icon = path.icon;
  const isCompleted = path.xpEarned >= path.xpTotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        'group glass rounded-xl transition-all duration-300 cursor-pointer shine',
        expanded && 'glow-primary',
        isCompleted && 'ring-1 ring-emerald-500/30'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: `${path.color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color: path.color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground font-[family-name:var(--font-outfit)]">
                {path.title}
              </h3>
              <p className="text-xs text-muted-foreground">{path.department}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Level {path.currentLevel} / {path.totalLevels}
            </span>
            <span className="font-semibold" style={{ color: path.color }}>
              {progressPercent}%
            </span>
          </div>
          <ProgressBar value={progressPercent} color={path.color} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="font-medium">{path.xpEarned.toLocaleString()} XP</span>
            </div>
            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <Check className="h-3 w-3" /> Completed
              </span>
            ) : (
              <span>{path.xpTotal - path.xpEarned} XP remaining</span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded — Level Timeline */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 pt-4 pb-2">
              {path.levels.map((level, i) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <LevelNode
                    level={level}
                    isLast={i === path.levels.length - 1}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LearningPathsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
              Learning Paths
            </h1>
            <p className="text-sm text-muted-foreground">
              Master AI skills for your department — one level at a time
            </p>
          </div>
        </div>
      </div>

      {/* Path Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_PATHS.map((path, i) => (
          <PathCard key={path.id} path={path} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
