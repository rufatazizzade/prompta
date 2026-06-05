"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Calendar,
  User,
  Star,
  ChevronRight,
  TrendingUp,
  Award,
} from "lucide-react";

// Mock reviews to complete
const MOCK_PENDING_REVIEWS = [
  {
    id: "sub-1",
    taskTitle: "HR Resume Screening Assistant Setup",
    submitterName: "Sarah Chen",
    department: "HR",
    submissionDate: "2026-06-04T10:15:00Z",
    content: "System Prompt: You are a Constructive HR assistant. Screen the CV and extract: 1. Relevant experience (years), 2. Top 3 skills matching description, 3. Discrepancies. Avoid bias. Output as JSON format.",
    xpReward: 30,
  },
  {
    id: "sub-2",
    taskTitle: "Competitor Market Research Report",
    submitterName: "Liam O'Connor",
    department: "Marketing",
    submissionDate: "2026-06-05T09:30:00Z",
    content: "SWOT analysis compiled via web lookup. Summary highlights: Competitor A has 40% market share but slow customer support response. Competitor B is launching a mobile app next month. Prompt used: 'List all recent news and SWOT details for Competitor A and B in 2026...'",
    xpReward: 30,
  },
];

// Mock received feedback
const MOCK_RECEIVED_FEEDBACK = [
  {
    id: "fb-1",
    taskTitle: "Cold Email Sequencing Campaign",
    reviewerName: "Alex Mercer",
    reviewerRole: "Sales Champion",
    date: "2026-06-03T15:40:00Z",
    strengths: "The second email in the sequence is extremely strong. Clear value proposition and a very soft, easy-to-answer call to action that reduces friction.",
    weaknesses: "The first email is a bit wordy (around 190 words). CEOs usually scan their inbox on mobile, so they might miss your core pitch.",
    improvements: "Try using the prompt 'condense this email to under 120 words while keeping the problem-agitate-solve framework' to make the intro punchier.",
    rating: 5,
    helpful: null, // null | true | false
  },
  {
    id: "fb-2",
    taskTitle: "Customer Support Macro Refinements",
    reviewerName: "Elena Rostova",
    reviewerRole: "Support Team Lead",
    date: "2026-06-01T11:20:00Z",
    strengths: "Excellent emotional intelligence in the draft responses. The phrasing shows true alignment with the user's frustration.",
    weaknesses: "Some of the AI generated macros are slightly repetitive in the closing remarks.",
    improvements: "Add a constraint to your prompt: 'Ensure each response uses a distinct call to action, avoiding standard corporate signoffs.'",
    rating: 4,
    helpful: true,
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "received">("pending");
  const [selectedSubmission, setSelectedSubmission] = useState<typeof MOCK_PENDING_REVIEWS[0] | null>(null);

  // Form states
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [improvements, setImprovements] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Helpful states
  const [receivedFeedback, setReceivedFeedback] = useState(MOCK_RECEIVED_FEEDBACK);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedSubmission(null);
        setStrengths("");
        setWeaknesses("");
        setImprovements("");
        setRating(5);
      }, 2000);
    }, 1500);
  };

  const handleHelpfulToggle = (id: string, isHelpful: boolean) => {
    setReceivedFeedback((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, helpful: isHelpful } : fb))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          Peer Reviews
        </h1>
        <p className="text-muted-foreground">
          Give constructive feedback to earn XP, and review insights shared by your colleagues.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => {
            setActiveTab("pending");
            setSelectedSubmission(null);
          }}
          className={`pb-4 px-6 font-heading font-semibold text-sm transition-colors relative ${
            activeTab === "pending" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Reviews to Complete ({MOCK_PENDING_REVIEWS.length})
          {activeTab === "pending" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("received");
            setSelectedSubmission(null);
          }}
          className={`pb-4 px-6 font-heading font-semibold text-sm transition-colors relative ${
            activeTab === "received" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Feedback ({receivedFeedback.length})
          {activeTab === "received" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "pending" ? (
              <motion.div
                key="pending-reviews"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-4"
              >
                {MOCK_PENDING_REVIEWS.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`glass p-6 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                      selectedSubmission?.id === sub.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                          {sub.department}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(sub.submissionDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-lg">{sub.taskTitle}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        Submitted by: <span className="font-medium text-foreground">{sub.submitterName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="text-sm font-bold text-primary">+{sub.xpReward} XP</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                        selectedSubmission?.id === sub.id ? "rotate-90 text-primary" : ""
                      }`} />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="received-feedback"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-6"
              >
                {receivedFeedback.map((fb) => (
                  <div key={fb.id} className="glass p-6 rounded-xl border border-border/50 space-y-6 relative overflow-hidden">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-heading font-bold text-lg">{fb.taskTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{fb.reviewerName}</span>
                          <span>({fb.reviewerRole})</span>
                          <span>&bull;</span>
                          <span>{new Date(fb.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${
                              idx < fb.rating ? "text-amber-500 fill-amber-500" : "text-muted border-none"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Feedback Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10 space-y-1">
                        <h4 className="font-bold text-emerald-500">Strengths</h4>
                        <p className="text-muted-foreground leading-relaxed">{fb.strengths}</p>
                      </div>
                      <div className="bg-rose-500/5 p-4 rounded-lg border border-rose-500/10 space-y-1">
                        <h4 className="font-bold text-rose-500">Weaknesses</h4>
                        <p className="text-muted-foreground leading-relaxed">{fb.weaknesses}</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-1">
                        <h4 className="font-bold text-primary">Suggestions</h4>
                        <p className="text-muted-foreground leading-relaxed">{fb.improvements}</p>
                      </div>
                    </div>

                    {/* Helpful? */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">Was this feedback helpful to you?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleHelpfulToggle(fb.id, true)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            fb.helpful === true
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                              : "border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Yes
                        </button>
                        <button
                          onClick={() => handleHelpfulToggle(fb.id, false)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            fb.helpful === false
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                              : "border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Form Panel */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-xl border border-border/50 sticky top-6">
            {selectedSubmission ? (
              <div className="space-y-6">
                <div className="border-b border-border/50 pb-4">
                  <h3 className="font-heading font-bold text-lg">Reviewing Submission</h3>
                  <p className="text-sm text-muted-foreground">Submitter: {selectedSubmission.submitterName}</p>
                </div>

                {/* Submitter Content Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Solution Content:</span>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border/30 text-sm max-h-40 overflow-y-auto leading-relaxed">
                    {selectedSubmission.content}
                  </div>
                </div>

                {success ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="font-bold">Review Submitted!</h4>
                    <p className="text-xs text-muted-foreground">Thank you for helping colleagues master AI skills.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Strengths (What did they do well?):</label>
                      <textarea
                        required
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        placeholder="Highlight clear prompting, correct tools choice, or well-structured outcomes..."
                        rows={2}
                        className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Weaknesses (Any potential flaws?):</label>
                      <textarea
                        required
                        value={weaknesses}
                        onChange={(e) => setWeaknesses(e.target.value)}
                        placeholder="Mention hallucination risk, missing details, or bloated system instructions..."
                        rows={2}
                        className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Actionable Suggestions:</label>
                      <textarea
                        required
                        value={improvements}
                        onChange={(e) => setImprovements(e.target.value)}
                        placeholder="Suggest concrete prompts to test, parameters to tweak, or workflow adjustments..."
                        rows={2}
                        className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    {/* Rating Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                        <span>Rating Score:</span>
                        <span className="text-amber-500 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {rating} / 5
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full accent-primary bg-muted rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {submitting ? "Submitting Review..." : "Submit Peer Review"}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3 text-muted-foreground">
                <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm font-semibold">No Submission Selected</p>
                <p className="text-xs max-w-[200px] mx-auto">
                  Click on any pending submission card to write your peer evaluation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
