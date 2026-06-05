"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Heart,
  MessageSquare,
  Bookmark,
  Plus,
  X,
  FileText,
  Workflow,
  Lightbulb,
  Zap,
  BookMarked,
} from "lucide-react";
import { cn, timeAgo, generateAvatar } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  type: "Tutorial" | "Workflow" | "Case Study" | "Prompt" | "Quick Tip";
  author: { name: string; avatar?: string };
  likes: number;
  comments: number;
  bookmarks: number;
  createdAt: Date;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["All", "HR", "Marketing", "Finance", "Operations", "Sales", "Support"] as const;
const TYPES = ["Tutorial", "Workflow", "Case Study", "Prompt", "Quick Tip"] as const;

const TYPE_META: Record<string, { color: string; icon: React.ElementType }> = {
  Tutorial:    { color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25", icon: BookOpen },
  Workflow:    { color: "bg-teal-500/15 text-teal-400 border-teal-500/25",   icon: Workflow },
  "Case Study":{ color: "bg-amber-500/15 text-amber-400 border-amber-500/25", icon: FileText },
  Prompt:      { color: "bg-violet-500/15 text-violet-400 border-violet-500/25", icon: Lightbulb },
  "Quick Tip": { color: "bg-rose-500/15 text-rose-400 border-rose-500/25",   icon: Zap },
};

const ARTICLES: Article[] = [
  {
    id: "1",
    title: "How to Write Effective Recruitment Prompts",
    content:
      "Discover the art of crafting AI prompts that surface the best candidates faster. This tutorial covers structuring role requirements, injecting company culture signals, and iterating on prompt output to reduce screening time by 60%. We walk through real examples from three Fortune 500 hiring pipelines and provide copy-paste templates you can adapt immediately.\n\nKey takeaways:\n• Use structured output formats (JSON) for ATS integration\n• Include anti-bias guardrails in every prompt\n• Always validate AI suggestions against your DEI policy\n• Iterate: the first prompt is never the best prompt",
    category: "HR",
    type: "Tutorial",
    author: { name: "Sarah Chen" },
    likes: 42,
    comments: 12,
    bookmarks: 28,
    createdAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: "2",
    title: "AI-Powered Social Media Calendar Workflow",
    content:
      "Automate your monthly content calendar with this step-by-step workflow. Learn to combine ChatGPT for ideation, Canva AI for visuals, and scheduling tools for a fully hands-off content pipeline. We cover prompt chaining, brand voice consistency checks, and approval workflows that keep stakeholders in the loop without bottlenecks.\n\nIncludes downloadable Notion template and Zapier integration guide.",
    category: "Marketing",
    type: "Workflow",
    author: { name: "James Rivera" },
    likes: 67,
    comments: 23,
    bookmarks: 45,
    createdAt: new Date(Date.now() - 5 * 3600000),
  },
  {
    id: "3",
    title: "How We Saved $2M Using AI in Forecasting",
    content:
      "A deep-dive case study into our finance team's journey from spreadsheet-based forecasting to AI-augmented predictions. We cover tool selection (Claude + internal data lake), prompt engineering for financial accuracy, validation against historical data, and the cultural change management that made adoption stick.\n\nResults:\n• 34% improvement in forecast accuracy\n• $2.1M annual savings from reduced over-ordering\n• 12 hours/week freed per analyst",
    category: "Finance",
    type: "Case Study",
    author: { name: "Priya Patel" },
    likes: 89,
    comments: 31,
    bookmarks: 56,
    createdAt: new Date(Date.now() - 24 * 3600000),
  },
  {
    id: "4",
    title: "The Ultimate Supply Chain Analysis Prompt",
    content:
      "Copy this battle-tested prompt to analyze supply chain bottlenecks using any major LLM. It handles multi-tier supplier networks, lead-time variability, and demand seasonality.\n\nPrompt:\n\"Analyze the following supply chain data and identify: (1) the top 3 bottleneck nodes by throughput constraint, (2) alternative routing options with cost impact, (3) risk scores for each tier-1 supplier based on geographic and financial stability factors. Output as a structured table.\"\n\nTips for customization included.",
    category: "Operations",
    type: "Prompt",
    author: { name: "Marcus Johnson" },
    likes: 54,
    comments: 18,
    bookmarks: 72,
    createdAt: new Date(Date.now() - 48 * 3600000),
  },
  {
    id: "5",
    title: "Quick Tip: Better CRM Data with AI Enrichment",
    content:
      "Use this 30-second trick to enrich your CRM records with AI: paste your lead list into Claude and ask it to infer company size, industry vertical, and likely tech stack from the company name and domain. You'll get 80%+ accuracy and save hours of manual research.\n\nBonus: Chain this with your outbound email prompt to auto-personalize at scale.",
    category: "Sales",
    type: "Quick Tip",
    author: { name: "Emily Watson" },
    likes: 31,
    comments: 8,
    bookmarks: 19,
    createdAt: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: "6",
    title: "Building an AI-First Customer Support Playbook",
    content:
      "Transform your support team with this comprehensive tutorial on integrating AI into ticket triage, response drafting, and knowledge-base maintenance. We cover selecting the right AI tool for each support tier, prompt templates for empathetic responses, escalation logic, and quality assurance loops.\n\nCase results from pilot:\n• 45% reduction in first-response time\n• 22% improvement in CSAT scores\n• 3x more tickets handled per agent per day",
    category: "Support",
    type: "Tutorial",
    author: { name: "David Kim" },
    likes: 76,
    comments: 29,
    bookmarks: 41,
    createdAt: new Date(Date.now() - 72 * 3600000),
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function KnowledgeHubPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      if (activeCategory !== "All" && a.category !== activeCategory) return false;
      if (activeTypes.size > 0 && !activeTypes.has(a.type)) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeCategory, activeTypes, search]);

  const toggleType = (type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Knowledge Hub</h1>
            <p className="text-sm text-muted-foreground">Internal AI knowledge base</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          Create Article
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "glass hover:bg-primary/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Type chips + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((type) => {
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            const active = activeTypes.has(type);
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  active ? meta.color : "border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                <Icon className="h-3 w-3" />
                {type}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20 sm:w-64"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((article, i) => {
            const meta = TYPE_META[article.type];
            const Icon = meta.icon;
            return (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                onClick={() => setSelectedArticle(article)}
                className="group glass gradient-border cursor-pointer rounded-xl p-5 transition-shadow hover:shadow-lg"
              >
                {/* Type badge */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                      meta.color
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {article.type}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 font-heading text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                {/* Author */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {generateAvatar(article.author.name)}
                  </div>
                  <span className="text-xs text-muted-foreground">{article.author.name}</span>
                </div>

                {/* Metrics */}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3 w-3" /> {article.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> {article.comments}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bookmark className="h-3 w-3" /> {article.bookmarks}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {timeAgo(article.createdAt)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <BookMarked className="mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">No articles match your filters.</p>
        </div>
      )}

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-2xl rounded-2xl border border-border p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium mb-3",
                  TYPE_META[selectedArticle.type].color
                )}
              >
                {selectedArticle.type}
              </span>

              <h2 className="font-heading text-xl font-bold mb-2">{selectedArticle.title}</h2>

              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {generateAvatar(selectedArticle.author.name)}
                </div>
                <span>{selectedArticle.author.name}</span>
                <span className="text-muted-foreground/50">·</span>
                <span>{timeAgo(selectedArticle.createdAt)}</span>
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                  {selectedArticle.category}
                </span>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                {selectedArticle.content}
              </div>

              <div className="mt-6 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                  <Heart className="h-4 w-4" /> {selectedArticle.likes}
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                  <MessageSquare className="h-4 w-4" /> {selectedArticle.comments}
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                  <Bookmark className="h-4 w-4" /> {selectedArticle.bookmarks}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Article Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-lg rounded-2xl border border-border p-6 shadow-2xl"
            >
              <button
                onClick={() => setShowCreate(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="font-heading text-lg font-bold mb-4">Create Article</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Article title"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50">
                  <option value="">Select category</option>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50">
                  <option value="">Select type</option>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Write your article content..."
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none resize-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.97]">
                  Publish Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
