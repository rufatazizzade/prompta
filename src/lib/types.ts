export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  department: string | null;
  skillLevel: string;
  xp: number;
  level: number;
  bio: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  expectedOutcome: string;
  aiTools: string;
  difficulty: string;
  xpReward: number;
  department: string | null;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  links: string | null;
  files: string | null;
  status: string;
  xpEarned: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  type: string;
  authorId: string;
  published: boolean;
  author?: User;
  _count?: { likes: number; comments: number; bookmarks: number };
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  useCase: string;
  aiTool: string;
  category: string;
  successRate: number;
  rating: number;
  ratingCount: number;
  cloneCount: number;
  creatorId: string;
  creator?: User;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpRequired: number;
  category: string;
}

export interface WasteMetric {
  id: string;
  userId: string;
  date: Date;
  toolUsed: string;
  taskType: string;
  success: boolean;
  timeSpent: number;
  timeSaved: number;
  queriesCount: number;
}
