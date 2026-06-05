"use client";

import { useState } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  Award,
  Sparkles,
  BookOpen,
  MessageCircle,
  ListChecks,
  Zap,
  Lock,
} from "lucide-react";

// Mock Achievements list
const MOCK_ADMIN_ACHIEVEMENTS = [
  { id: "ac-1", name: "First Prompt", desc: "Submit your first prompt template solution.", category: "Tasks", xp: 50 },
  { id: "ac-2", name: "AI Enthusiast", desc: "Run 10 recommendation queries through the AI GPS.", category: "General", xp: 100 },
  { id: "ac-3", name: "Critical Thinker", desc: "Submit 5 peer reviews with detailed recommendations.", category: "Reviews", xp: 150 },
  { id: "ac-4", name: "AI Champion", desc: "Be appointed as an AI Champion for your department.", category: "Social", xp: 300 },
  { id: "ac-5", name: "Knowledge Sharer", desc: "Publish 3 articles in the internal AI Knowledge Hub.", category: "Knowledge", xp: 150 },
  { id: "ac-6", name: "Learning Explorer", desc: "Complete your department's Level 2 Learning Path.", category: "Learning", xp: 200 },
];

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState(MOCK_ADMIN_ACHIEVEMENTS);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("General");
  const [xp, setXp] = useState(100);

  const handleDelete = (id: string) => {
    setAchievements((prev) => prev.filter((ac) => ac.id !== id));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAc = {
      id: `ac-${Date.now()}`,
      name,
      desc,
      category,
      xp: Number(xp),
    };
    setAchievements((prev) => [newAc, ...prev]);
    setName("");
    setDesc("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Trophy className="h-8 w-8 text-purple-500" />
            Achievements Management
          </h1>
          <p className="text-muted-foreground">
            Configure global badges, customize XP requirements, and monitor total users achievement rates.
          </p>
        </div>
      </div>

      {/* Main columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create new achievement */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Milestone
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Achievement Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Prompt Engineer..."
                  className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description:</label>
                <textarea
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe details candidate has to complete..."
                  rows={3}
                  className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Learning">Learning</option>
                    <option value="Tasks">Tasks</option>
                    <option value="Reviews">Reviews</option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Social">Social</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">XP Reward:</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={500}
                    step={50}
                    value={xp}
                    onChange={(e) => setXp(Number(e.target.value))}
                    className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                Create Milestone
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Achievements List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-bold text-lg">Configured Milestones ({achievements.length})</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ac) => (
              <div
                key={ac.id}
                className="glass p-5 rounded-xl border border-border/50 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                      {ac.category}
                    </span>
                    <button
                      onClick={() => handleDelete(ac.id)}
                      className="h-7 w-7 rounded-lg border border-destructive/20 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Badge"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-base">{ac.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ac.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center text-xs font-semibold text-primary">
                  <span>+{ac.xp} XP reward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
