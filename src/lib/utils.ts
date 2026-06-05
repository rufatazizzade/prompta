import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function getXPProgress(xp: number): number {
  return (xp % 500) / 500 * 100;
}

export function getXPForNextLevel(xp: number): number {
  return 500 - (xp % 500);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner": return "text-emerald-500";
    case "intermediate": return "text-amber-500";
    case "advanced": return "text-orange-500";
    case "expert": return "text-red-500";
    default: return "text-muted-foreground";
  }
}

export function getDifficultyBg(difficulty: string): string {
  switch (difficulty) {
    case "beginner": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "intermediate": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "advanced": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "expert": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getToolColor(tool: string): string {
  switch (tool.toLowerCase()) {
    case "chatgpt": return "bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/20";
    case "claude": return "bg-[#d97706]/10 text-[#d97706] border-[#d97706]/20";
    case "gemini": return "bg-[#4285f4]/10 text-[#4285f4] border-[#4285f4]/20";
    case "perplexity": return "bg-[#20808d]/10 text-[#20808d] border-[#20808d]/20";
    case "copilot": return "bg-[#0078d4]/10 text-[#0078d4] border-[#0078d4]/20";
    default: return "bg-primary/10 text-primary border-primary/20";
  }
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

export function generateAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return initials;
}
