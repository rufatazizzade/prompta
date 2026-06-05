"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { AI_TOOLS } from "@/lib/constants";
import { getToolColor } from "@/lib/utils";

// Mock scenarios data
const MOCK_SCENARIOS = [
  {
    id: "scen-1",
    department: "HR",
    title: "Review 100 CVs in 2 hours",
    difficulty: "Intermediate",
    timeLimit: 15,
    description: "Our recruiting team has received a surge of applicant profiles. Filter for candidates with React and Next.js skills within a strict timeline.",
    context: "You are the lead HR coordinator. We have 120 applicants for a Senior Frontend Engineer role. The hiring manager is review-blocked and needs the top 10 profiles in a structured spreadsheet formats. There are both standard CV sheets and raw text bios.",
    objectives: [
      "Extract skills profile from documents",
      "Assign matching score",
      "Format output as structured table",
    ],
    idealAnswer: "Should use Claude or ChatGPT. Ask for structured JSON extraction candidate-by-candidate, avoiding personal criteria to prevent gender/demographic bias. Format columns: Name, Tech Stack, Years Exp, Matching Score.",
  },
  {
    id: "scen-2",
    department: "Marketing",
    title: "Create a Product Launch Campaign",
    difficulty: "Beginner",
    timeLimit: 20,
    description: "Plan and draft copy for a multi-channel social media launch campaign for our new SaaS reporting module.",
    context: "The Marketing VP wants an outline for LinkedIn, Twitter, and Email newsletters. We want to emphasize that the dashboard solves Excel manual data entry waste. Tone should be engaging, professional, and highlight time-savings data.",
    objectives: [
      "Create LinkedIn text post outlining pain-point",
      "Draft 3 tweet hooks linking features",
      "Synthesize an email newsletter text brief",
    ],
    idealAnswer: "ChatGPT or Gemini are great choices. Prompt must request a specific structure, using details about variance tracking. Set word count constraints and request 3 alternative headlines.",
  },
  {
    id: "scen-3",
    department: "Finance",
    title: "Prepare Quarterly Financial Report",
    difficulty: "Expert",
    timeLimit: 30,
    description: "Write code to parse month-end department spreadsheets, highlight overruns, and outline strategic explanations.",
    context: "A finance supervisor needs to compare Actual vs Budget columns across 14 divisions. Division data is raw CSV files. You need an automated script to output variance statistics and draft email comments explaining over-budget items.",
    objectives: [
      "Process spreadsheet data using code runner",
      "Generate variance percentage thresholds",
      "Write constructive budget explanatory outline",
    ],
    idealAnswer: "Use ChatGPT or Copilot for code compilation. Prompt should supply mock columns and specify: 1. Python script using pandas, 2. Exception handling, 3. Constructive summarization of variance.",
  },
  {
    id: "scen-4",
    department: "Operations",
    title: "Optimize Supply Chain Process",
    difficulty: "Advanced",
    timeLimit: 25,
    description: "Extract log statistics, highlight bottleneck routes, and outline three logistics refinement alternatives.",
    context: "Logistics coordinators are facing customs clearance blockages on the Rotterdam route. We have a CSV file detailing shipment lead times, routes, and custom tariffs. We want to outline strategic alternative shipping routes.",
    objectives: [
      "Parse Dutch customs bottleneck reports",
      "Highlight cost-effective rerouting alternatives",
      "Summarize recommendations for board review",
    ],
    idealAnswer: "Use Claude or ChatGPT. Prompt should request competitor pricing analyses, list constraints (tariffs, port storage rates), and output pros/cons in markdown.",
  },
];

export default function AISimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState<typeof MOCK_SCENARIOS[0] | null>(null);
  const [shouldUseAI, setShouldUseAI] = useState<boolean | null>(null);
  const [selectedTool, setSelectedTool] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [reasoning, setReasoning] = useState("");

  // Scoring results state
  const [scoring, setScoring] = useState(false);
  const [results, setResults] = useState<{
    toolScore: number;
    promptScore: number;
    reasoningScore: number;
    totalScore: number;
    feedback: string;
  } | null>(null);

  const handleStartScenario = (scen: typeof MOCK_SCENARIOS[0]) => {
    setSelectedScenario(scen);
    setShouldUseAI(null);
    setSelectedTool("");
    setPromptInput("");
    setReasoning("");
    setResults(null);
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setShouldUseAI(null);
    setSelectedTool("");
    setPromptInput("");
    setReasoning("");
    setResults(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScoring(true);

    // Simulate scenario scoring algorithm
    setTimeout(() => {
      let toolScore = 0;
      let promptScore = 0;
      let reasoningScore = 0;

      if (shouldUseAI === false) {
        // Incorrect decision for these enterprise tasks
        toolScore = 10;
        promptScore = 0;
        reasoningScore = 50;
      } else {
        // Tool evaluation
        const correctTools = ["Claude", "ChatGPT"];
        if (correctTools.includes(selectedTool)) {
          toolScore = 100;
        } else {
          toolScore = 60; // Partial credit for Gemini/Copilot/Perplexity
        }

        // Prompt Evaluation (simple keyword check)
        const lowercasePrompt = promptInput.toLowerCase();
        const keywords = ["format", "role", "constraint", "avoid", "json", "table", "step"];
        const hits = keywords.filter(kw => lowercasePrompt.includes(kw)).length;
        promptScore = Math.min(100, 40 + (hits * 10));

        // Reasoning Score (length check as proxy for quality)
        reasoningScore = Math.min(100, 30 + (reasoning.length / 5));
      }

      const totalScore = Math.round((toolScore * 0.3) + (promptScore * 0.4) + (reasoningScore * 0.3));
      
      let feedback = "Your prompt contains clear objectives, though adding constraints like 'avoid personal identifiers' would improve objectivity.";
      if (totalScore >= 90) {
        feedback = "Outstanding workflow! You correctly selected the optimal AI model and structured a prompt with clear parameters, constraints, and format specifications.";
      } else if (totalScore < 60) {
        feedback = "The prompt is too generic. Try framing the AI with a specific role, giving concrete examples of input data, and explicitly defining the output layout.";
      }

      setScoring(false);
      setResults({
        toolScore,
        promptScore,
        reasoningScore,
        totalScore,
        feedback,
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <PlayCircle className="h-8 w-8 text-primary" />
          AI Simulator
        </h1>
        <p className="text-muted-foreground">
          Step into real-world business scenarios. Practice prompt workflows and get scored on safety, efficiency, and prompting quality.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedScenario ? (
          // Selection view
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {MOCK_SCENARIOS.map((scen) => (
              <div
                key={scen.id}
                onClick={() => handleStartScenario(scen)}
                className="group glass p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                      {scen.department}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {scen.timeLimit} mins
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                      {scen.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {scen.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Difficulty: <strong className="text-foreground">{scen.difficulty}</strong></span>
                  <span className="flex items-center gap-1 text-primary font-bold">
                    Start Scenario
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          // Active Scenario Workspace
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Workspace Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass p-8 rounded-2xl border border-border/50 space-y-6">
                {/* Scenario details */}
                <div className="space-y-4">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Back to Scenarios
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                      {selectedScenario.department}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Difficulty: {selectedScenario.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-heading">{selectedScenario.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedScenario.context}</p>
                </div>

                {/* Objectives */}
                <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/30">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Key Objectives:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside pl-1">
                    {selectedScenario.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {results ? (
                  // Scoring Results View
                  <div className="space-y-6 pt-4 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-xl">Evaluation Breakdown</h3>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                        <Award className="h-4 w-4" />
                        <span>Score: {results.totalScore} / 100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-muted/40 p-4 rounded-xl border border-border/30">
                        <p className="text-xs text-muted-foreground font-semibold">AI Tool Choice (30%)</p>
                        <p className="text-2xl font-bold mt-1 text-foreground">{results.toolScore} / 100</p>
                      </div>
                      <div className="bg-muted/40 p-4 rounded-xl border border-border/30">
                        <p className="text-xs text-muted-foreground font-semibold">Prompt Structure (40%)</p>
                        <p className="text-2xl font-bold mt-1 text-foreground">{results.promptScore} / 100</p>
                      </div>
                      <div className="bg-muted/40 p-4 rounded-xl border border-border/30">
                        <p className="text-xs text-muted-foreground font-semibold">Reasoning Logic (30%)</p>
                        <p className="text-2xl font-bold mt-1 text-foreground">{results.reasoningScore} / 100</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm leading-relaxed">
                      <p className="font-semibold text-primary">Evaluator Feedback:</p>
                      <p className="text-muted-foreground mt-1">{results.feedback}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/40 border border-border/30 text-xs leading-relaxed space-y-2">
                      <p className="font-semibold text-foreground">Ideal Approach Guide:</p>
                      <p className="text-muted-foreground">{selectedScenario.idealAnswer}</p>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Complete Simulator</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  // Interaction Form
                  <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-border/30">
                    {/* Should AI be used */}
                    <div className="space-y-2.5">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Should an AI Tool be used in this scenario?
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setShouldUseAI(true)}
                          className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                            shouldUseAI === true
                              ? "bg-primary/10 border-primary text-primary"
                              : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Yes, AI is highly recommended
                        </button>
                        <button
                          type="button"
                          onClick={() => setShouldUseAI(false)}
                          className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                            shouldUseAI === false
                              ? "bg-rose-500/10 border-rose-500/40 text-rose-500"
                              : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          No, execute manually (Security/Quality risk)
                        </button>
                      </div>
                    </div>

                    {shouldUseAI && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Tool choice */}
                        <div className="space-y-2.5">
                          <label className="text-sm font-semibold text-muted-foreground">
                            Which AI tool will you utilize?
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {AI_TOOLS.map((t) => (
                              <button
                                key={t.name}
                                type="button"
                                onClick={() => setSelectedTool(t.name)}
                                className={`py-2 px-1 rounded-lg border text-xs font-semibold transition-all ${
                                  selectedTool === t.name
                                    ? getToolColor(t.name) + " border-primary/50"
                                    : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {t.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Prompt Input */}
                        <div className="space-y-2.5">
                          <label className="text-sm font-semibold text-muted-foreground">
                            Enter the Prompt you would send to the AI tool:
                          </label>
                          <textarea
                            required
                            value={promptInput}
                            onChange={(e) => setPromptInput(e.target.value)}
                            placeholder="State system role, context details, strict formats, constraints..."
                            rows={5}
                            className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </motion.div>
                    )}

                    {shouldUseAI !== null && (
                      <div className="space-y-2.5">
                        <label className="text-sm font-semibold text-muted-foreground">
                          Explain your reasoning for this choice:
                        </label>
                        <textarea
                          required
                          value={reasoning}
                          onChange={(e) => setReasoning(e.target.value)}
                          placeholder="Why did you select this tool or method? Outline structural details..."
                          rows={3}
                          className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    )}

                    {shouldUseAI !== null && (
                      <button
                        type="submit"
                        disabled={scoring || (shouldUseAI && (!selectedTool || !promptInput))}
                        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {scoring ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                            <span>Evaluating Workflow...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Workflow</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Right Instructions Info Card */}
            <div className="lg:col-span-1">
              <div className="glass p-6 rounded-xl border border-border/50 sticky top-6 space-y-6">
                <h3 className="font-heading font-bold text-lg border-b border-border/30 pb-3">
                  Evaluation Rules
                </h3>
                <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                  <p>
                    Each scenario evaluates your competence on three parameters:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-foreground">1. AI Tool Choice (30% weight)</h4>
                      <p className="mt-0.5">Selecting the right tool for the right capability. E.g., choosing Perplexity for citation-backed lookup or Claude for complex reasoning.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">2. Prompt Engineering (40% weight)</h4>
                      <p className="mt-0.5">Structuring your instructions correctly. You are penalized for generic single-sentence requests. Higher score for role-play, markdown guides, and formats.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">3. Reasoning & Logic (30% weight)</h4>
                      <p className="mt-0.5">Writing a clear explanation about time-savings estimates, data confidentiality risks, or task complexities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
