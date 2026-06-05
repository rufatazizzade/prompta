"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Eye,
  Check,
  Flag,
  Trash2,
} from "lucide-react";

// Mock Pending Articles data
const MOCK_PENDING_ARTICLES = [
  { id: "art-1", title: "Claude parameters - how temperature changes response predictability", author: "Sarah Chen", date: "2026-06-05" },
  { id: "art-2", title: "SWOT markdown formatting - simple tips for marketing reports", author: "Liam O'Connor", date: "2026-06-04" },
];

// Mock Flagged Prompts data
const MOCK_FLAGGED_PROMPTS = [
  { id: "pr-1", title: "Corporate Compensation Audit Bot", reason: "Potential leak of employee salary details", flags: 3, author: "Marcus Vance" },
  { id: "pr-2", title: "Competitor LinkedIn Spam Bot", reason: "Violates corporate AI communication guidelines", flags: 2, author: "Liam O'Connor" },
];

export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState<"articles" | "prompts">("articles");
  const [pendingArticles, setPendingArticles] = useState(MOCK_PENDING_ARTICLES);
  const [flaggedPrompts, setFlaggedPrompts] = useState(MOCK_FLAGGED_PROMPTS);

  const handleApproveArticle = (id: string) => {
    setPendingArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleRejectArticle = (id: string) => {
    setPendingArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDismissPrompt = (id: string) => {
    setFlaggedPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRemovePrompt = (id: string) => {
    setFlaggedPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <Shield className="h-8 w-8 text-purple-500" />
          Content Moderation
        </h1>
        <p className="text-muted-foreground">
          Audit user-published resources, review automated flags, and clear pending submissions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-4 px-6 font-heading font-semibold text-sm transition-colors relative ${
            activeTab === "articles" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Articles ({pendingArticles.length})
          {activeTab === "articles" && (
            <motion.div
              layoutId="modTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("prompts")}
          className={`pb-4 px-6 font-heading font-semibold text-sm transition-colors relative ${
            activeTab === "prompts" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Flagged Prompts ({flaggedPrompts.length})
          {activeTab === "prompts" && (
            <motion.div
              layoutId="modTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "articles" ? (
          <motion.div
            key="articles-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {pendingArticles.map((art) => (
              <div key={art.id} className="glass p-6 rounded-xl border border-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg leading-snug">{art.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      Author: <strong className="text-foreground">{art.author}</strong>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Submitted: {art.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 md:self-end">
                  <button
                    onClick={() => handleRejectArticle(art.id)}
                    className="h-9 px-4 border border-rose-500/25 hover:border-rose-500 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApproveArticle(art.id)}
                    className="h-9 px-4 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingArticles.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No articles awaiting moderation clearance.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="prompts-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {flaggedPrompts.map((pr) => (
              <div key={pr.id} className="glass p-6 rounded-xl border border-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-lg leading-snug">{pr.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 fill-rose-500/10" />
                      <span>{pr.flags} flags</span>
                    </span>
                  </div>
                  <p className="text-xs text-rose-500 font-medium">Flag Reason: {pr.reason}</p>
                  <p className="text-xs text-muted-foreground">Creator: <strong className="text-foreground">{pr.author}</strong></p>
                </div>

                <div className="flex items-center gap-2.5 md:self-end">
                  <button
                    onClick={() => handleRemovePrompt(pr.id)}
                    className="h-9 px-4 border border-rose-500/25 hover:border-rose-500 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove Prompt</span>
                  </button>
                  <button
                    onClick={() => handleDismissPrompt(pr.id)}
                    className="h-9 px-4 border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Dismiss Flag</span>
                  </button>
                </div>
              </div>
            ))}

            {flaggedPrompts.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No prompts currently flagged by users.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
