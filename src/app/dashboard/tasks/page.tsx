"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks,
  Filter,
  Search,
  BookOpen,
  ArrowRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
} from "lucide-react";
import { getDifficultyBg, getToolColor } from "@/lib/utils";
import { DEPARTMENTS, AI_TOOLS } from "@/lib/constants";

// Mock tasks data
const MOCK_TASKS = [
  {
    id: "task-1",
    title: "HR Resume Screening Assistant Setup",
    description: "Create a system prompt for screening 200+ CVs against a specific job role, filtering for core competencies and flag detection without losing diversity.",
    expectedOutcome: "A structured system prompt template and evaluation guidelines.",
    difficulty: "intermediate",
    xpReward: 100,
    department: "HR",
    aiTools: ["Claude", "ChatGPT"],
    status: "Completed",
  },
  {
    id: "task-2",
    title: "Competitor Market Research Report",
    description: "Use web search AI to compile a detailed SWOT analysis of 3 major competitors in our space. Provide structured citations and format output as markdown.",
    expectedOutcome: "SWOT analysis markdown file with at least 5 credible source links.",
    difficulty: "beginner",
    xpReward: 50,
    department: "Marketing",
    aiTools: ["Perplexity", "Gemini"],
    status: "In Progress",
  },
  {
    id: "task-3",
    title: "Quarterly Financial Analysis Automation",
    description: "Write an advanced Excel/Python script via code generation to compute variance analysis and generate bullet points explaining high deviations.",
    expectedOutcome: "Excel workbook structure or python script + prompt used to generate it.",
    difficulty: "advanced",
    xpReward: 150,
    department: "Finance",
    aiTools: ["ChatGPT", "Copilot"],
    status: "Not Started",
  },
  {
    id: "task-4",
    title: "Supply Chain Log Bottleneck Detection",
    description: "Analyze a CSV shipment log using AI data interpreter. Identify where the delays occur, estimate cost impact, and suggest 3 mitigations.",
    expectedOutcome: "Brief analytical summary report (max 2 pages) and raw chart visual recommendation.",
    difficulty: "expert",
    xpReward: 200,
    department: "Operations",
    aiTools: ["Claude", "ChatGPT"],
    status: "Not Started",
  },
  {
    id: "task-5",
    title: "Cold Email Sequencing Campaign",
    description: "Draft a 3-step cold outreach sequence tailored for mid-market CEOs. Test variants for subject lines, keeping length under 150 words.",
    expectedOutcome: "Copy of the 3 templates, along with prompt iterations used to refine body copy.",
    difficulty: "beginner",
    xpReward: 50,
    department: "Sales",
    aiTools: ["ChatGPT"],
    status: "Completed",
  },
  {
    id: "task-6",
    title: "Customer Support Macro Refinements",
    description: "Iterate on our support macros. Inject empathetic wording for frustrated customers facing product delivery delays, optimizing for CSAT improvement.",
    expectedOutcome: "5 response macros, comparing original drafts to AI-refined output.",
    difficulty: "intermediate",
    xpReward: 100,
    department: "Customer Support",
    aiTools: ["Claude", "Gemini"],
    status: "Submitted",
  },
  {
    id: "task-7",
    title: "Performance Appraisal Framework Prompt",
    description: "Design a structured prompt that acts as an unbiased coach, helping managers write constructive feedback based on raw performance logs.",
    expectedOutcome: "Unbiased coaching prompt template and evaluation guidelines.",
    difficulty: "advanced",
    xpReward: 150,
    department: "HR",
    aiTools: ["Claude"],
    status: "Not Started",
  },
  {
    id: "task-8",
    title: "SEO Article Brief Generation",
    description: "Develop a workflow for generating SEO optimized blog briefs. Include search intent keyword mapping, heading structure, and competitor gap focus.",
    expectedOutcome: "Workflow description document and target layout output sample.",
    difficulty: "intermediate",
    xpReward: 100,
    department: "Marketing",
    aiTools: ["Perplexity", "ChatGPT"],
    status: "Not Started",
  },
];

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<typeof MOCK_TASKS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Submission Form State
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [solutionLink, setSolutionLink] = useState("");

  const filteredTasks = MOCK_TASKS.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || task.department === selectedDept;
    const matchesDifficulty = selectedDifficulty === "All" || task.difficulty === selectedDifficulty.toLowerCase();
    
    let matchesStatus = true;
    if (selectedStatus !== "All") {
      if (selectedStatus === "Not Started") matchesStatus = task.status === "Not Started";
      if (selectedStatus === "In Progress") matchesStatus = task.status === "In Progress";
      if (selectedStatus === "Submitted") matchesStatus = task.status === "Submitted";
      if (selectedStatus === "Completed") matchesStatus = task.status === "Completed";
    }

    return matchesSearch && matchesDept && matchesDifficulty && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Submitted":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const handleSolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedTask(null);
        setSolutionText("");
        setSolutionLink("");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-primary" />
            Learning Tasks
          </h1>
          <p className="text-muted-foreground">
            Complete real-world tasks using AI, earn XP, and get reviews from peers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Award className="h-4 w-4" />
            <span>Active Path: Marketing AI</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass p-4 rounded-xl border border-border/50 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.name} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Submitted">Submitted</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setSelectedTask(task)}
              className="group glass p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBg(task.difficulty)}`}>
                    {task.difficulty}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span>+{task.xpReward} XP</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {task.aiTools.map((tool) => (
                    <span
                      key={tool}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${getToolColor(tool)}`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">No tasks found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any tasks matching your selected filters. Try broadening your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Task Modal Detail */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-border/50 max-w-2xl w-full rounded-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setSolutionText("");
                  setSolutionLink("");
                }}
                className="absolute right-6 top-6 h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                &times;
              </button>

              {success ? (
                <div className="py-16 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading">Solution Submitted!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your solution has been submitted. Colleagues in the {selectedTask.department} team will review your work soon. You will receive notifications when reviews are completed.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Category & Title */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                        {selectedTask.department}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBg(selectedTask.difficulty)}`}>
                        {selectedTask.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold font-heading">{selectedTask.title}</h2>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/30 text-sm leading-relaxed">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">Task Prompt & Objectives</h4>
                      <p className="text-muted-foreground">{selectedTask.description}</p>
                    </div>
                    <div className="space-y-1 pt-2 border-t border-border/30">
                      <h4 className="font-semibold text-foreground">Expected Outcome</h4>
                      <p className="text-muted-foreground">{selectedTask.expectedOutcome}</p>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleSolutionSubmit} className="space-y-4 border-t border-border/30 pt-6">
                    <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      Submit Your Solution
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Your prompt template or solution write-up:
                      </label>
                      <textarea
                        required
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value)}
                        placeholder="Paste your system prompts, workflow steps, or AI responses here..."
                        rows={6}
                        className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Link to document/sandbox (optional):
                      </label>
                      <input
                        type="url"
                        value={solutionLink}
                        onChange={(e) => setSolutionLink(e.target.value)}
                        placeholder="https://example.com/share-link"
                        className="w-full bg-background border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Solution</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
