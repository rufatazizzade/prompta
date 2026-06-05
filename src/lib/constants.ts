export const AI_TOOLS = [
  { name: "ChatGPT", icon: "message-square", color: "#10a37f", description: "Best for conversation, writing, and general tasks" },
  { name: "Claude", icon: "brain", color: "#d97706", description: "Best for analysis, reasoning, and long documents" },
  { name: "Gemini", icon: "sparkles", color: "#4285f4", description: "Best for research, multimodal tasks, and Google integration" },
  { name: "Perplexity", icon: "search", color: "#20808d", description: "Best for research, fact-checking, and citations" },
  { name: "Copilot", icon: "code", color: "#0078d4", description: "Best for Microsoft Office integration and productivity" },
] as const;

export const DEPARTMENTS = [
  { name: "HR", icon: "users", color: "#8b5cf6" },
  { name: "Marketing", icon: "megaphone", color: "#ec4899" },
  { name: "Finance", icon: "banknote", color: "#10b981" },
  { name: "Operations", icon: "settings", color: "#f59e0b" },
  { name: "Sales", icon: "trending-up", color: "#3b82f6" },
  { name: "Customer Support", icon: "headphones", color: "#06b6d4" },
] as const;

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner", description: "Just getting started with AI tools" },
  { value: "intermediate", label: "Intermediate", description: "Comfortable with basic AI usage" },
  { value: "advanced", label: "Advanced", description: "Experienced with multiple AI tools" },
  { value: "expert", label: "Expert", description: "Deep expertise in AI workflows" },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner", xpMultiplier: 1 },
  { value: "intermediate", label: "Intermediate", xpMultiplier: 1.5 },
  { value: "advanced", label: "Advanced", xpMultiplier: 2 },
  { value: "expert", label: "Expert", xpMultiplier: 3 },
] as const;

export const TASK_STATUSES = [
  { value: "not_started", label: "Not Started", color: "bg-gray-500" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { value: "submitted", label: "Submitted", color: "bg-amber-500" },
  { value: "reviewed", label: "Reviewed", color: "bg-purple-500" },
  { value: "completed", label: "Completed", color: "bg-emerald-500" },
] as const;

export const ARTICLE_TYPES = [
  { value: "tutorial", label: "Tutorial", icon: "book-open" },
  { value: "workflow", label: "Workflow", icon: "git-branch" },
  { value: "case_study", label: "Case Study", icon: "file-text" },
  { value: "prompt", label: "Prompt", icon: "terminal" },
  { value: "tip", label: "Quick Tip", icon: "lightbulb" },
] as const;

export const ACHIEVEMENT_CATEGORIES = [
  { value: "general", label: "General", icon: "star" },
  { value: "learning", label: "Learning", icon: "graduation-cap" },
  { value: "tasks", label: "Tasks", icon: "check-circle" },
  { value: "reviews", label: "Reviews", icon: "message-circle" },
  { value: "knowledge", label: "Knowledge", icon: "book" },
  { value: "social", label: "Social", icon: "users" },
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/dashboard/ai-gps", label: "AI GPS", icon: "compass" },
  { href: "/dashboard/sandbox", label: "AI Sandbox", icon: "flame" },
  { href: "/dashboard/learning", label: "Learning Paths", icon: "graduation-cap" },
  { href: "/dashboard/tasks", label: "Tasks", icon: "list-checks" },
  { href: "/dashboard/reviews", label: "Peer Reviews", icon: "message-circle" },
  { href: "/dashboard/detective", label: "AI Detective", icon: "search" },
  { href: "/dashboard/simulator", label: "AI Simulator", icon: "play-circle" },
  { href: "/dashboard/knowledge", label: "Knowledge Hub", icon: "book-open" },
  { href: "/dashboard/marketplace", label: "Prompt Marketplace", icon: "store" },
  { href: "/dashboard/champions", label: "AI Champions", icon: "trophy" },
  { href: "/dashboard/battle", label: "AI Battle", icon: "swords" },
  { href: "/dashboard/waste-tracker", label: "Waste Tracker", icon: "bar-chart-3" },
  { href: "/dashboard/ai-brain", label: "Company AI Brain", icon: "brain" },
  { href: "/dashboard/cli", label: "CLI Connect", icon: "terminal" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { href: "/dashboard/admin", label: "Overview", icon: "layout-dashboard" },
  { href: "/dashboard/admin/users", label: "Users", icon: "users" },
  { href: "/dashboard/admin/tasks", label: "Tasks", icon: "list-checks" },
  { href: "/dashboard/admin/departments", label: "Departments", icon: "building" },
  { href: "/dashboard/admin/achievements", label: "Achievements", icon: "trophy" },
  { href: "/dashboard/admin/learning", label: "Learning Paths", icon: "graduation-cap" },
  { href: "/dashboard/admin/moderation", label: "Moderation", icon: "shield" },
  { href: "/dashboard/admin/integrations", label: "Integrations", icon: "settings" },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: "bar-chart" },
] as const;
