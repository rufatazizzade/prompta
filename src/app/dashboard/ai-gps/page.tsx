'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Clock,
  BarChart3,
  Sparkles,
  RotateCcw,
  Zap,
  MessageSquare,
  Brain,
  Search,
  Code,
} from 'lucide-react';
import { cn, getToolColor, getDifficultyBg } from '@/lib/utils';
import type { AIRecommendation } from '@/lib/groq';

const EXAMPLE_TASKS = [
  { text: 'I need to analyze 200 CVs', icon: '📄' },
  { text: 'I need market research on competitors', icon: '📊' },
  { text: 'I need to prepare a monthly financial report', icon: '💰' },
  { text: 'I need to create a marketing campaign', icon: '📣' },
  { text: 'I need to draft a client email', icon: '✉️' },
  { text: 'I need help with Excel formulas', icon: '📈' },
];

const TOOL_ICONS: Record<string, typeof MessageSquare> = {
  chatgpt: MessageSquare,
  claude: Brain,
  gemini: Sparkles,
  perplexity: Search,
  copilot: Code,
};

function getToolIcon(tool: string) {
  const Icon = TOOL_ICONS[tool.toLowerCase()] ?? Sparkles;
  return Icon;
}

export default function AIGPSPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!taskDescription.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription: taskDescription.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get recommendation');
      }

      const data: AIRecommendation = await res.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [taskDescription, isLoading]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback – textarea trick
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleReset = useCallback(() => {
    setTaskDescription('');
    setRecommendation(null);
    setError(null);
  }, []);

  const ToolIcon = recommendation ? getToolIcon(recommendation.recommendedTool) : Sparkles;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ─── Page Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-heading">AI GPS</h1>
            <p className="text-sm text-muted-foreground">
              Describe your task and get the perfect AI tool recommendation
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Input Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="gradient-border"
      >
        <div className="rounded-[inherit] bg-card p-6 space-y-5">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Describe what you need to accomplish…"
              rows={4}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/50 select-none">
              Ctrl + Enter to submit
            </span>
          </div>

          {/* Example Chips */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_TASKS.map((task, i) => (
                <motion.button
                  key={task.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                  onClick={() => setTaskDescription(task.text)}
                  className="group flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  <span>{task.icon}</span>
                  <span>{task.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!taskDescription.trim() || isLoading}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200',
              'bg-primary text-primary-foreground',
              'hover:opacity-90 active:scale-[0.98]',
              'disabled:pointer-events-none disabled:opacity-50',
              !isLoading && taskDescription.trim() && 'glow-primary'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing your task…
              </>
            ) : (
              <>
                Find My AI Tool
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ─── Error State ─── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Recommendation Result ─── */}
      <AnimatePresence mode="wait">
        {recommendation && (
          <motion.div
            key="recommendation"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* ── Main Recommendation Card ── */}
            <div className="gradient-border glow-primary">
              <div className="glass rounded-[inherit] p-6 space-y-6">
                {/* Tool Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                      Recommended Tool
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ToolIcon className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-bold font-heading tracking-tight">
                        {recommendation.recommendedTool}
                      </h2>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                          getToolColor(recommendation.recommendedTool)
                        )}
                      >
                        Best Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="rounded-xl bg-secondary/50 p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    Why this tool
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {recommendation.reason}
                  </p>
                </div>

                {/* Prompt Template */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Prompt Template
                    </p>
                    <button
                      onClick={() => handleCopy(recommendation.promptTemplate)}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCopy(recommendation.promptTemplate)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleCopy(recommendation.promptTemplate);
                    }}
                    className="cursor-pointer rounded-xl border border-border bg-muted/60 p-4 font-mono text-sm leading-relaxed text-foreground/80 transition-colors hover:border-primary/30"
                  >
                    {recommendation.promptTemplate}
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Time Savings */}
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Time Savings
                      </p>
                      <p className="truncate text-sm font-bold text-foreground">
                        {recommendation.timeSavings}
                      </p>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Difficulty
                      </p>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold capitalize',
                          getDifficultyBg(recommendation.difficulty)
                        )}
                      >
                        {recommendation.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Alternative Tools ── */}
            {recommendation.alternatives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Alternative Tools
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recommendation.alternatives.map((alt, i) => {
                    const AltIcon = getToolIcon(alt);
                    return (
                      <motion.div
                        key={alt}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                        className="shine group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            getToolColor(alt).replace('text-', 'text-').replace('border-', 'border-')
                          )}
                        >
                          <AltIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{alt}</p>
                          <p className="text-xs text-muted-foreground">Also a great option</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Reset Button ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center pt-2"
            >
              <button
                onClick={handleReset}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-180 duration-500" />
                Try Another Task
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
