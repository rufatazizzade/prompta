"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  HelpCircle,
  Award,
  BookOpen,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { getDifficultyBg, getToolColor } from "@/lib/utils";
import { DEPARTMENTS, AI_TOOLS } from "@/lib/constants";

// Mock admin task lists
const MOCK_ADMIN_TASKS = [
  { id: "task-1", title: "HR Resume Screening Assistant Setup", dept: "HR", difficulty: "intermediate", xp: 100, submissions: 14, status: "Active" },
  { id: "task-2", title: "Competitor Market Research Report", dept: "Marketing", difficulty: "beginner", xp: 50, submissions: 22, status: "Active" },
  { id: "task-3", title: "Quarterly Financial Analysis Automation", dept: "Finance", difficulty: "advanced", xp: 150, submissions: 8, status: "Active" },
  { id: "task-4", title: "Supply Chain Log Bottleneck Detection", dept: "Operations", difficulty: "expert", xp: 200, submissions: 3, status: "Draft" },
  { id: "task-5", title: "Cold Email Sequencing Campaign", dept: "Sales", difficulty: "beginner", xp: 50, submissions: 31, status: "Active" },
  { id: "task-6", title: "Customer Support Macro Refinements", dept: "Customer Support", difficulty: "intermediate", xp: 100, submissions: 19, status: "Active" },
];

export default function AdminTasksPage() {
  const [tasksList, setTasksList] = useState(MOCK_ADMIN_TASKS);
  const [editingTask, setEditingTask] = useState<typeof MOCK_ADMIN_TASKS[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState("Marketing");
  const [formDifficulty, setFormDifficulty] = useState("beginner");
  const [formXP, setFormXP] = useState(100);
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteTask = (id: string) => {
    setTasksList(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const newTask = {
        id: `task-${Date.now()}`,
        title: formTitle,
        dept: formDept,
        difficulty: formDifficulty,
        xp: Number(formXP),
        submissions: 0,
        status: "Active",
      };
      setTasksList(prev => [newTask, ...prev]);
      setSubmitting(false);
      setShowCreateModal(false);
      setFormTitle("");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-purple-500" />
            Task Management
          </h1>
          <p className="text-muted-foreground">
            Author and assign structured learning tasks, view total submissions metrics, and edit prompt guidelines.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Tasks Database Table */}
      <div className="glass rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs text-foreground uppercase border-b border-border/40 bg-muted/20">
              <tr>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4 text-center">Department</th>
                <th className="py-3 px-4 text-center">Difficulty</th>
                <th className="py-3 px-4 text-center">XP Reward</th>
                <th className="py-3 px-4 text-center">Submissions</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {tasksList.map((task) => (
                <tr key={task.id} className="hover:bg-muted/10 transition-colors">
                  {/* Title */}
                  <td className="py-4 px-4 font-semibold text-foreground">{task.title}</td>

                  {/* Department */}
                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md border bg-muted font-bold">
                      {task.dept}
                    </span>
                  </td>

                  {/* Difficulty */}
                  <td className="py-4 px-4 text-center">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBg(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                  </td>

                  {/* XP Reward */}
                  <td className="py-4 px-4 text-center font-semibold text-foreground text-xs">
                    +{task.xp} XP
                  </td>

                  {/* Submissions count */}
                  <td className="py-4 px-4 text-center font-bold text-foreground">
                    {task.submissions}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                      task.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    }`}>
                      {task.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-8 w-8 rounded-lg border border-destructive/20 hover:border-destructive text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-border/50 max-w-md w-full rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create Platform Task
                </h3>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Task Title:</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="E.g., Automated Legal Doc Translation Guidelines..."
                      className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Difficulty:</label>
                      <select
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value)}
                        className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-xs focus:outline-none"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">XP Reward:</label>
                    <input
                      type="number"
                      required
                      min={50}
                      max={500}
                      step={50}
                      value={formXP}
                      onChange={(e) => setFormXP(Number(e.target.value))}
                      className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Creating..." : "Save Learning Task"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
