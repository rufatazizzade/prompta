"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  Search,
  MessageCircle,
  Sparkles,
  ChevronRight,
  UserPlus,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Mail,
  Award,
} from "lucide-react";
import { generateAvatar } from "@/lib/utils";
import { DEPARTMENTS } from "@/lib/constants";

// Mock Champions Data
const MOCK_CHAMPIONS = [
  {
    id: "champ-1",
    name: "Sarah Chen",
    department: "HR",
    specialization: "AI Recruitment & HR Policy Prompting",
    followers: 124,
    email: "sarah.chen@company.com",
    isFollowing: true,
  },
  {
    id: "champ-2",
    name: "Liam O'Connor",
    department: "Marketing",
    specialization: "SEO Outlines & Copywriting Workflows",
    followers: 98,
    email: "liam.oconnor@company.com",
    isFollowing: false,
  },
  {
    id: "champ-3",
    name: "Marcus Vance",
    department: "Finance",
    specialization: "Prisma Reports & Financial Modeling Codes",
    followers: 156,
    email: "marcus.vance@company.com",
    isFollowing: true,
  },
  {
    id: "champ-4",
    name: "Elena Rostova",
    department: "Operations",
    specialization: "Logistics Optimization & CSV Parsing",
    followers: 82,
    email: "elena.rostova@company.com",
    isFollowing: false,
  },
  {
    id: "champ-5",
    name: "Alex Mercer",
    department: "Sales",
    specialization: "B2B Outreach Sequences & CRM Syncuras",
    followers: 110,
    email: "alex.mercer@company.com",
    isFollowing: false,
  },
  {
    id: "champ-6",
    name: "Devon Lane",
    department: "Customer Support",
    specialization: "EM empath-first macro generation",
    followers: 74,
    email: "devon.lane@company.com",
    isFollowing: false,
  },
];

export default function AIChampionsPage() {
  const [champions, setChampions] = useState(MOCK_CHAMPIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Question Form modal
  const [selectedChampion, setSelectedChampion] = useState<typeof MOCK_CHAMPIONS[0] | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFollowToggle = (id: string) => {
    setChampions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isFollowing: !c.isFollowing,
            followers: c.isFollowing ? c.followers - 1 : c.followers + 1,
          };
        }
        return c;
      })
    );
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedChampion(null);
        setQuestionText("");
      }, 2000);
    }, 1500);
  };

  const filteredChampions = champions.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500" />
            AI Champions
          </h1>
          <p className="text-muted-foreground">
            Connect with internal experts who lead AI adoption in their departments. Ask questions or view their shared prompt templates.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 rounded-xl border border-border/50 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by champion name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* Grid of Champions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChampions.map((c) => (
          <div
            key={c.id}
            className="glass p-6 rounded-xl border border-border/50 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
          >
            {/* Background Sparkles Accent */}
            <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-primary/10 via-transparent to-transparent flex items-start justify-end p-2 pointer-events-none">
              <Award className="h-5 w-5 text-primary/30" />
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xl font-bold shrink-0">
                  {generateAvatar(c.name)}
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg leading-snug">{c.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/30">
                      {c.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {c.followers} Followers
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div className="space-y-1 text-sm leading-relaxed">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Specialization:</span>
                <p className="text-foreground">{c.specialization}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-border/30 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleFollowToggle(c.id)}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  c.isFollowing
                    ? "bg-muted border-border text-foreground hover:bg-muted/80"
                    : "bg-primary/10 hover:bg-primary/15 border-primary/20 text-primary"
                }`}
              >
                {c.isFollowing ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setSelectedChampion(c);
                  setSuccess(false);
                }}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Ask Question</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {selectedChampion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-border/50 max-w-md w-full rounded-2xl p-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedChampion(null)}
                className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                &times;
              </button>

              {success ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-heading">Question Sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Your question has been sent to {selectedChampion.name}. You will be notified in your inbox once they provide an answer.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg">Ask {selectedChampion.name}</h3>
                    <p className="text-xs text-muted-foreground">Specialist in {selectedChampion.department}</p>
                  </div>

                  <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Your Question:</label>
                      <textarea
                        required
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="State your prompt issue or describe the AI task you need guidance with..."
                        rows={4}
                        className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Submit Question</span>
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
