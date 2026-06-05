"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  Zap,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

// Mock AI output scenarios
const MOCK_SCENARIOS = [
  {
    id: "sc-1",
    title: "Financial Market Outlook Analysis",
    description: "Review this AI-generated summary of quarterly market performance. Find the hallucinations or factual errors.",
    textSegments: [
      { id: "s1", text: "In Q1 2026, tech shares drove index growth, with the S&P 500 rising 7.2%. " },
      { id: "s2", text: "Apple stock hit an all-time high of $450 per share following the launch of their holographic contact lens. ", isIssue: true, type: "Hallucination", explanation: "Apple has not launched holographic contact lenses; this is a hallucinated product." },
      { id: "s3", text: "Interest rates remained stable as the Federal Reserve signaled a holding pattern. " },
      { id: "s4", text: "Meanwhile, unemployment rate in the US dropped to an record low of -1.5%, showing negative joblessness. ", isIssue: true, type: "Misinformation", explanation: "An unemployment rate cannot be negative (-1.5%)." }
    ],
    xpReward: 100,
  },
  {
    id: "sc-2",
    title: "HR Hiring Recommendation Draft",
    description: "Examine this screening bot's automated recommendation for a Senior Project Manager candidate. Spot any bias.",
    textSegments: [
      { id: "s1", text: "Candidate has 10 years of scrum master experience and holds a PMP certification. " },
      { id: "s2", text: "However, given the demanding travel schedules and high overtime commitment in this leadership position, we should prioritize male candidates who typically have fewer domestic obligations. ", isIssue: true, type: "Bias", explanation: "This contains illegal gender discrimination and bias regarding domestic roles." },
      { id: "s3", text: "Candidate has previously worked at three Fortune 500 companies with positive references." }
    ],
    xpReward: 100,
  },
  {
    id: "sc-3",
    title: "SEO Article Draft on 'Healthy Sleep'",
    description: "Identify weak prompting outputs or missing authoritative sources in this draft snippet.",
    textSegments: [
      { id: "s1", text: "Sleeping 8 hours is good. You should sleep at night. Sleep helps your brain feel better. " },
      { id: "s2", text: "Many people sleep. Studies say sleep is crucial. (Source: some study on the internet). ", isIssue: true, type: "Missing Source", explanation: "Fails to provide specific, authoritative citations for claims, using vague placeholders." },
      { id: "s3", text: "To sleep well, you should sleep. Also, drink sleep tea. It works because it is good. ", isIssue: true, type: "Weak Prompt", explanation: "Repetitive, shallow structure indicating a lack of system role-play and poor prompting constraint." }
    ],
    xpReward: 100,
  }
];

export default function AIDetectivePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [streak, setStreak] = useState(3);
  const [xpEarned, setXpEarned] = useState(0);

  const scenario = MOCK_SCENARIOS[currentIdx];

  const handleSegmentClick = (id: string) => {
    if (submitted) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Calculate Score & XP
    const correctIds = scenario.textSegments.filter(s => s.isIssue).map(s => s.id);
    const selectedCorrect = selectedIds.filter(id => correctIds.includes(id)).length;
    const selectedWrong = selectedIds.filter(id => !correctIds.includes(id)).length;
    
    // Max XP if perfect, minus penalty for wrong selections
    const scoreRatio = Math.max(0, (selectedCorrect - selectedWrong) / correctIds.length);
    const earned = Math.round(scoreRatio * scenario.xpReward);
    
    setXpEarned(earned);
    if (earned === scenario.xpReward) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedIds([]);
    setXpEarned(0);
    setCurrentIdx((prev) => (prev + 1) % MOCK_SCENARIOS.length);
  };

  const getSegmentStyles = (seg: typeof scenario.textSegments[0]) => {
    const isSelected = selectedIds.includes(seg.id);
    if (submitted) {
      if (seg.isIssue) {
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 border";
      } else if (isSelected && !seg.isIssue) {
        return "bg-rose-500/20 text-rose-300 border-rose-500/50 border";
      }
      return "text-muted-foreground opacity-60";
    }
    
    return isSelected
      ? "bg-primary/20 text-primary border-primary border cursor-pointer"
      : "hover:bg-muted/40 cursor-pointer";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            AI Detective
          </h1>
          <p className="text-muted-foreground">
            Analyze AI-generated drafts. Click on sentences that contain factual errors, bias, or poor prompting logic.
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-semibold">
            <Zap className="h-4 w-4 fill-orange-500" />
            <span>Streak: {streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            <span>Total Score: 320 XP</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Text Analyzer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-2xl border border-border/50 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                CHALLENGE {currentIdx + 1} OF {MOCK_SCENARIOS.length}
              </span>
              <h2 className="text-2xl font-bold font-heading">{scenario.title}</h2>
              <p className="text-sm text-muted-foreground">{scenario.description}</p>
            </div>

            {/* Interactive Text Display */}
            <div className="p-6 rounded-xl bg-muted/30 border border-border/30 font-sans text-base leading-loose select-none space-y-4">
              <div className="flex flex-wrap gap-x-1 gap-y-2">
                {scenario.textSegments.map((seg) => (
                  <span
                    key={seg.id}
                    onClick={() => handleSegmentClick(seg.id)}
                    className={`px-1.5 py-0.5 rounded transition-all duration-200 leading-relaxed ${getSegmentStyles(seg)}`}
                  >
                    {seg.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <span className="text-xs text-muted-foreground">
                {submitted
                  ? "Analysis submitted. Check segment details on the right."
                  : `${selectedIds.length} segments selected`}
              </span>

              <div className="flex gap-3">
                {submitted ? (
                  <button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-1.5 transition-all"
                  >
                    <span>Next Case</span>
                    <RotateCcw className="h-4 w-4 rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedIds.length === 0}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <span>Submit Analysis</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Scorecard and issue explanations */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-xl border border-border/50 sticky top-6 space-y-6">
            <h3 className="font-heading font-bold text-lg border-b border-border/30 pb-3">
              Case File Log
            </h3>

            {submitted ? (
              <div className="space-y-6">
                {/* Result XP info */}
                <div className="text-center bg-muted/40 p-4 rounded-xl border border-border/30 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">XP EARNED</p>
                  <p className="text-4xl font-black text-primary font-heading">+{xpEarned} XP</p>
                </div>

                {/* Explanations List */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-foreground">Identified AI Failures:</h4>
                  {scenario.textSegments.filter(s => s.isIssue).map(seg => {
                    const wasFound = selectedIds.includes(seg.id);
                    return (
                      <div
                        key={seg.id}
                        className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-1 ${
                          wasFound
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold">
                          <span>{seg.type}</span>
                          <span>{wasFound ? "Found (+XP)" : "Missed (0 XP)"}</span>
                        </div>
                        <p className="text-muted-foreground mt-1">{seg.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">How to spot mistakes:</p>
                    <p className="mt-0.5">Read the generated draft details carefully. Common AI pitfalls in companies include factual hallucinations, discriminatory bias, lacking citations, or generic weak responses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 mt-4">
                  <Award className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Score multipliers:</p>
                    <p className="mt-0.5">Selecting only correct issues earns full XP rewards. Selecting correct segments alongside incorrect ones decreases the overall score outcome.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
