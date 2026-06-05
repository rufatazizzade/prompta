"use client";

import { useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";

// Mock Learning Paths
const MOCK_PATHS = [
  { id: "path-1", title: "HR AI Mastery", dept: "HR", levelsCount: 4, lessonsCount: 16 },
  { id: "path-2", title: "Marketing Content Workflow", dept: "Marketing", levelsCount: 4, lessonsCount: 12 },
  { id: "path-3", title: "Finance VBA & Python Scripting", dept: "Finance", levelsCount: 4, lessonsCount: 14 },
  { id: "path-4", title: "Operations Bottleneck Audits", dept: "Operations", levelsCount: 4, lessonsCount: 10 },
  { id: "path-5", title: "Sales Cold Sequencer Hacks", dept: "Sales", levelsCount: 4, lessonsCount: 11 },
];

export default function AdminLearningPathsPage() {
  const [pathsList, setPathsList] = useState(MOCK_PATHS);
  const [title, setTitle] = useState("");
  const [formDept, setFormDept] = useState("Marketing");

  const handleDeletePath = (id: string) => {
    setPathsList(prev => prev.filter(p => p.id !== id));
  };

  const handleCreatePath = (e: React.FormEvent) => {
    e.preventDefault();
    const newPath = {
      id: `path-${Date.now()}`,
      title,
      dept: formDept,
      levelsCount: 4,
      lessonsCount: 8,
    };
    setPathsList(prev => [newPath, ...prev]);
    setTitle("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-purple-500" />
            Learning Paths Management
          </h1>
          <p className="text-muted-foreground">
            Configure department curricula, manage lesson counts, and review vertical timeline branches.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create new pathway */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Pathway
            </h3>

            <form onSubmit={handleCreatePath} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Pathway Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Customer Support CSAT Mastery..."
                  className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Department:</label>
                <select
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                Create Pathway
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Path Lists */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-bold text-lg">Configured Pathways ({pathsList.length})</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathsList.map((path) => (
              <div
                key={path.id}
                className="glass p-5 rounded-xl border border-border/50 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                      {path.dept}
                    </span>
                    <button
                      onClick={() => handleDeletePath(path.id)}
                      className="h-7 w-7 rounded-lg border border-destructive/20 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Pathway"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-base">{path.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Levels: <strong className="text-foreground">{path.levelsCount} levels</strong> &bull; Lessons: <strong className="text-foreground">{path.lessonsCount} lessons</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center text-xs font-semibold text-primary">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    Manage Lessons Timeline
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
