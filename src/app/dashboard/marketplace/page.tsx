"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  Filter,
  Star,
  Copy,
  CheckCircle,
  TrendingUp,
  User,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { getToolColor, generateAvatar } from "@/lib/utils";
import { DEPARTMENTS, AI_TOOLS } from "@/lib/constants";

// Mock prompts data
const MOCK_PROMPTS = [
  {
    id: "prompt-1",
    title: "Empathy-First Support Macro Builder",
    content: "System Prompt: You are a customer advocacy expert. Rewrite this customer support response: '[text]'. Infuse authentic empathy, avoid standard corporate jargon, keep response under 120 words, and structure with: 1. Apology & Validation, 2. Solution/Next Steps, 3. CSAT Closing. Tone constraints: warm, transparent, non-defensive.",
    useCase: "Iterate on customer macros to inject high emotional intelligence for delayed packages or billing concerns.",
    aiTool: "Claude",
    category: "Customer Support",
    successRate: 98.4,
    rating: 4.9,
    ratingCount: 42,
    cloneCount: 312,
    creatorName: "Sarah Chen",
    creatorDept: "HR",
  },
  {
    id: "prompt-2",
    title: "Structured SWOT Analysis Generator",
    content: "Act as a senior business analyst. Analyze the following competitor profile data: '[data]'. Produce a SWOT analysis. Requirements: 1. Markdown tables for layout, 2. Minimum of 4 items per quadrant, 3. Explicit citation linkages in footnotes, 4. Highlight 2 emerging strategic recommendations based on the overlaps. Source credibility must be strictly checked.",
    useCase: "Compile comprehensive market analysis reports on competing products with structured reference citation grids.",
    aiTool: "Perplexity",
    category: "Marketing",
    successRate: 92.1,
    rating: 4.7,
    ratingCount: 18,
    cloneCount: 145,
    creatorName: "Liam O'Connor",
    creatorDept: "Marketing",
  },
  {
    id: "prompt-3",
    title: "Financial Variance Script Coder",
    content: "You are an expert Python data engineer. Write a pandas script that loads a variance spreadsheet (columns: Actual, Budget, Department), calculates the deviation percentage, and generates a formatted HTML table highlighting rows with deviation > 10% in light red. Add a summary function that returns the top 3 departments driving budget overrun. Return clean code only.",
    useCase: "Generate variance analysis code to parse month-end spreadsheets and flag cost centers automatically.",
    aiTool: "ChatGPT",
    category: "Finance",
    successRate: 95.0,
    rating: 4.8,
    ratingCount: 29,
    cloneCount: 220,
    creatorName: "Marcus Vance",
    creatorDept: "Finance",
  },
  {
    id: "prompt-4",
    title: "Structured CV Competency Extractor",
    content: "System Prompt: Extract criteria from the CV provided. Job description criteria: [skills]. Extract matching candidates with: 1. Years of experience in criteria, 2. Missing criteria list, 3. Degree verification. Return ONLY JSON output matching format: { candidateName: '', matchedYears: 0, missingSkills: [], educationVerified: true }.",
    useCase: "Screen large volumes of applicant resumes against core vacancy frameworks without manual pre-filtering.",
    aiTool: "Claude",
    category: "HR",
    successRate: 97.2,
    rating: 4.9,
    ratingCount: 38,
    cloneCount: 284,
    creatorName: "Sarah Chen",
    creatorDept: "HR",
  },
  {
    id: "prompt-5",
    title: "B2B Outreach sequence body optimizer",
    content: "Rewrite this outreach email using the 'Problem-Agitate-Solve' structure. Word count must not exceed 130 words. Focus on a single friction point: [pain_point]. End with a low-commitment question: 'Would you be open to a 5-minute feedback call next Tuesday?' Tone should be professional, direct, and completely free of sales pitches.",
    useCase: "Draft high-converting cold sequencing templates targeting mid-market executives.",
    aiTool: "ChatGPT",
    category: "Sales",
    successRate: 89.6,
    rating: 4.5,
    ratingCount: 12,
    cloneCount: 94,
    creatorName: "Alex Mercer",
    creatorDept: "Sales",
  },
  {
    id: "prompt-6",
    title: "SQL Query optimizer and explainer",
    content: "Analyze the following SQL query for performance issues: '[query]'. Identify indexes missing, slow join types, or subquery inefficiencies. Output: 1. Optimized query, 2. Bullet point list of explanation, 3. Estimated performance gain percentage. Use PostgreSQL v16 guidelines.",
    useCase: "Refine dashboard queries and explain database query plans in plain English.",
    aiTool: "Copilot",
    category: "Operations",
    successRate: 94.4,
    rating: 4.6,
    ratingCount: 15,
    cloneCount: 112,
    creatorName: "Elena Rostova",
    creatorDept: "Operations",
  },
  {
    id: "prompt-7",
    title: "Unbiased Performance Review Coach",
    content: "You are an objective management consultant. Review the following performance raw notes for employee [name]: '[notes]'. Draft a structured performance summary. Guardrails: Remove adjectives implying personal bias (e.g., 'lazy', 'difficult', 'fantastic'), instead describe the behavioral facts. Provide: 1. Demonstrated Strengths, 2. Areas for Growth, 3. Constructive Next Steps.",
    useCase: "Support team managers in drafting balanced, construct-oriented appraisal forms.",
    aiTool: "Claude",
    category: "HR",
    successRate: 96.8,
    rating: 4.9,
    ratingCount: 22,
    cloneCount: 176,
    creatorName: "Sarah Chen",
    creatorDept: "HR",
  },
  {
    id: "prompt-8",
    title: "Blog SEO Content Brief Builder",
    content: "Create an SEO content outline brief for keyword: '[keyword]'. Analyze Google search intent and deliver: 1. Recommended Word Count, 2. Hierarchy of Headings (H2/H3) covering competitor gaps, 3. 5 essential semantic keywords, 4. Meta description draft, 5. Primary user intent analysis. Provide all criteria in a structured markdown page layout.",
    useCase: "Generate content briefs for writers, ensuring structural optimization before drafting begins.",
    aiTool: "Perplexity",
    category: "Marketing",
    successRate: 91.5,
    rating: 4.6,
    ratingCount: 24,
    cloneCount: 158,
    creatorName: "Liam O'Connor",
    creatorDept: "Marketing",
  },
];

export default function PromptMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [sortBy, setSortBy] = useState<"clones" | "rating" | "newest">("clones");
  const [clonedId, setClonedId] = useState<string | null>(null);

  const handleCopyPrompt = (prompt: typeof MOCK_PROMPTS[0]) => {
    navigator.clipboard.writeText(prompt.content);
    setClonedId(prompt.id);
    setTimeout(() => setClonedId(null), 2000);
  };

  const filteredPrompts = MOCK_PROMPTS.filter((prompt) => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.useCase.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTool = selectedTool === "All" || prompt.aiTool === selectedTool;
    const matchesDept = selectedDept === "All" || prompt.category === selectedDept;

    return matchesSearch && matchesTool && matchesDept;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return b.successRate - a.successRate; // Use successRate as a proxy for this mockup
    return b.cloneCount - a.cloneCount;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Store className="h-8 w-8 text-primary" />
            Prompt Marketplace
          </h1>
          <p className="text-muted-foreground">
            Browse, copy, and share verified prompting templates tested by teams inside the company.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 rounded-xl border border-border/50 flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompt templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* AI Tool */}
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="All">All AI Tools</option>
            {AI_TOOLS.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Department */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.name} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="clones">Popular (Clones)</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Highest Success</option>
          </select>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredPrompts.map((prompt, idx) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass p-6 rounded-xl border border-border/50 hover:border-primary/45 transition-all duration-300 flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getToolColor(prompt.aiTool)}`}>
                      {prompt.aiTool}
                    </span>
                    <h3 className="font-heading font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                      {prompt.title}
                    </h3>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-lg text-xs font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{prompt.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  <span className="font-semibold text-foreground">Use Case:</span> {prompt.useCase}
                </p>

                {/* Prompt Preview Code Box */}
                <div className="relative bg-muted/40 border border-border/40 p-3 rounded-lg text-xs leading-relaxed max-h-36 overflow-y-auto">
                  <pre className="font-mono whitespace-pre-wrap text-muted-foreground">{prompt.content}</pre>
                </div>
              </div>

              {/* Footer Row */}
              <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
                {/* Creator Profile */}
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                    {generateAvatar(prompt.creatorName)}
                  </div>
                  <div className="text-[11px]">
                    <p className="font-semibold">{prompt.creatorName}</p>
                    <p className="text-muted-foreground">{prompt.creatorDept}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Success Rate</span>
                    <span className="font-bold text-emerald-500">{prompt.successRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Clones</span>
                    <span className="font-bold">{prompt.cloneCount}</span>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopyPrompt(prompt)}
                    className={`flex h-9 px-3 rounded-lg border text-xs font-semibold items-center justify-center gap-1.5 transition-all ${
                      clonedId === prompt.id
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "bg-primary hover:bg-primary/95 text-primary-foreground border-transparent cursor-pointer"
                    }`}
                  >
                    {clonedId === prompt.id ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Cloned!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Clone Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPrompts.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3">
            <Store className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">No templates found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              No templates matching your selected filter. Try choosing another tool or department.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
