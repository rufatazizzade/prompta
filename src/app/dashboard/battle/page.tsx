"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Swords,
  Users,
  Award,
  Vote,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// Mock Battles data
const MOCK_ACTIVE_BATTLE = {
  id: "battle-1",
  title: "B2B Sales Outreach Subject Lines",
  challenge: "Craft a subject line for a cold outreach email to a SaaS CTO. Constraints: Under 7 words, high click rate, strictly professional without sounding clickbait-y.",
  bonusXp: 150,
  endsInMins: 45,
  competitorA: {
    id: "comp-a",
    promptUsed: "Subject: Audit of 3 security holes in [domain]'s frontend.",
    outputReceived: "Hi [name], identified three unpatched endpoint exposures in your customer portal. Script attached. - Mercer",
  },
  competitorB: {
    id: "comp-b",
    promptUsed: "Subject: Solving Dutch customs Rotterdam blockages.",
    outputReceived: "Hi [name], compiled cost-analysis comparing Rotterdam container charges vs Antwerp rail routing. Brief outline. - Liam",
  },
};

const MOCK_PAST_BATTLES = [
  {
    id: "battle-past-1",
    title: "Excel Macro Variance Analysis Script",
    winnerName: "Marcus Vance (Finance)",
    winningPrompt: "Generate a VBA macro that highlights budget deviations over 15% across dynamic columns.",
    xpEarned: 150,
    votesRatio: "74% vs 26%",
  },
  {
    id: "battle-past-2",
    title: "Empathetic support macros",
    winnerName: "Sarah Chen (HR)",
    winningPrompt: "Act as CSAT expert. Rewrite delayed shipping notifications to show empathy without liability.",
    xpEarned: 150,
    votesRatio: "62% vs 38%",
  },
];

export default function AIBattlePage() {
  const [activeBattle, setActiveBattle] = useState(MOCK_ACTIVE_BATTLE);
  const [voted, setVoted] = useState<"A" | "B" | null>(null);
  const [votedCountA, setVotedCountA] = useState(48);
  const [votedCountB, setVotedCountB] = useState(52);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  // Form Join Battle State
  const [submittedPrompt, setSubmittedPrompt] = useState("");

  const handleVote = (competitor: "A" | "B") => {
    if (voted) return;
    setVoted(competitor);
    if (competitor === "A") {
      setVotedCountA(prev => prev + 1);
    } else {
      setVotedCountB(prev => prev + 1);
    }
  };

  const handleJoinBattle = (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    setTimeout(() => {
      setJoining(false);
      setJoined(true);
      setTimeout(() => {
        setJoined(false);
        setSubmittedPrompt("");
      }, 2000);
    }, 1500);
  };

  const totalVotes = votedCountA + votedCountB;
  const ratioA = Math.round((votedCountA / totalVotes) * 100);
  const ratioB = Math.round((votedCountB / totalVotes) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Swords className="h-8 w-8 text-rose-500" />
            AI Battle Arena
          </h1>
          <p className="text-muted-foreground">
            A weekly competitive prompt-off. Vote anonymously on solutions submitted by your colleagues, or submit your own.
          </p>
        </div>
        <Link
          href="/dashboard/battle/hackathons"
          className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-rose-500/20 transition-all shrink-0"
        >
          <Award className="h-4 w-4 text-rose-500" />
          Active Department Sprints
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Active Battle Arena */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-2xl border border-border/50 space-y-6 relative overflow-hidden">
            {/* Live Indicator */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              <Clock className="h-3.5 w-3.5" />
              <span>Ends in {activeBattle.endsInMins} mins</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 fill-rose-500" />
                ACTIVE WEEKLY CHALLENGE
              </span>
              <h2 className="text-2xl font-bold font-heading">{activeBattle.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{activeBattle.challenge}</p>
            </div>

            {/* Voting Arena */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Option A */}
              <div
                onClick={() => handleVote("A")}
                className={`glass p-6 rounded-xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  voted
                    ? voted === "A"
                      ? "border-primary bg-primary/5 cursor-default"
                      : "border-border/30 opacity-60 cursor-default"
                    : "border-border/50 hover:border-primary/40 cursor-pointer"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground">SUBMISSION A</span>
                    {voted && voted === "A" && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Output Preview:</p>
                    <p className="text-sm font-medium italic text-foreground leading-relaxed">
                      "{activeBattle.competitorA.outputReceived}"
                    </p>
                  </div>
                  {voted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1 pt-2 border-t border-border/30 text-xs"
                    >
                      <p className="font-semibold text-muted-foreground uppercase">Prompt Used:</p>
                      <pre className="font-mono text-muted-foreground whitespace-pre-wrap">{activeBattle.competitorA.promptUsed}</pre>
                    </motion.div>
                  )}
                </div>

                {voted && (
                  <div className="mt-6 text-3xl font-black font-heading text-primary">
                    {ratioA}% <span className="text-xs text-muted-foreground font-medium">({votedCountA} votes)</span>
                  </div>
                )}
              </div>

              {/* Option B */}
              <div
                onClick={() => handleVote("B")}
                className={`glass p-6 rounded-xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  voted
                    ? voted === "B"
                      ? "border-primary bg-primary/5 cursor-default"
                      : "border-border/30 opacity-60 cursor-default"
                    : "border-border/50 hover:border-primary/40 cursor-pointer"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground">SUBMISSION B</span>
                    {voted && voted === "B" && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Output Preview:</p>
                    <p className="text-sm font-medium italic text-foreground leading-relaxed">
                      "{activeBattle.competitorB.outputReceived}"
                    </p>
                  </div>
                  {voted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1 pt-2 border-t border-border/30 text-xs"
                    >
                      <p className="font-semibold text-muted-foreground uppercase">Prompt Used:</p>
                      <pre className="font-mono text-muted-foreground whitespace-pre-wrap">{activeBattle.competitorB.promptUsed}</pre>
                    </motion.div>
                  )}
                </div>

                {voted && (
                  <div className="mt-6 text-3xl font-black font-heading text-primary">
                    {ratioB}% <span className="text-xs text-muted-foreground font-medium">({votedCountB} votes)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Voting prompt warning */}
            {!voted && (
              <div className="bg-muted/40 p-4 rounded-xl border border-border/30 flex items-start gap-2.5 text-xs text-muted-foreground">
                <Vote className="h-5 w-5 text-primary shrink-0" />
                <p>
                  Click on either Submission A or B above to cast your anonymous vote. Once you vote, the voting ratios and the actual prompt templates used by the competitors will be revealed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Submissions Entry & Past Winners */}
        <div className="lg:col-span-1 space-y-6">
          {/* Join Battle */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg">Join the Battle</h3>
            <p className="text-xs text-muted-foreground">
              Submit your prompt template. The system will run it in the background, crop the output, and display it for anonymous voting.
            </p>

            {joined ? (
              <div className="py-6 text-center space-y-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm">Submission Live!</h4>
                <p className="text-[11px] text-muted-foreground px-4">Your prompt is queued for routing reviews.</p>
              </div>
            ) : (
              <form onSubmit={handleJoinBattle} className="space-y-3">
                <textarea
                  required
                  value={submittedPrompt}
                  onChange={(e) => setSubmittedPrompt(e.target.value)}
                  placeholder="Paste your prompt blueprint here..."
                  rows={4}
                  className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {joining ? "Queueing..." : "Submit to Arena"}
                </button>
              </form>
            )}
          </div>

          {/* Past Winners */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg">Arena Hall of Fame</h3>
            <div className="space-y-3">
              {MOCK_PAST_BATTLES.map((pb) => (
                <div key={pb.id} className="p-3 bg-muted/30 border border-border/30 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-foreground truncate max-w-[150px]">{pb.title}</span>
                    <span className="text-primary">+{pb.xpEarned} XP</span>
                  </div>
                  <div className="text-muted-foreground">
                    Winner: <span className="font-semibold text-foreground">{pb.winnerName}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Winning Prompt: "{pb.winningPrompt.slice(0, 35)}..."</span>
                    <span className="font-bold text-emerald-500">{pb.votesRatio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
