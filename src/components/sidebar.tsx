"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  ListChecks,
  MessageCircle,
  Search,
  PlayCircle,
  BookOpen,
  Store,
  Trophy,
  Swords,
  BarChart3,
  Brain,
  Users,
  Building,
  Shield,
  BarChart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Flame,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants";
import { cn, generateAvatar } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  compass: Compass,
  "graduation-cap": GraduationCap,
  "list-checks": ListChecks,
  "message-circle": MessageCircle,
  search: Search,
  "play-circle": PlayCircle,
  "book-open": BookOpen,
  store: Store,
  trophy: Trophy,
  swords: Swords,
  "bar-chart-3": BarChart3,
  brain: Brain,
  users: Users,
  building: Building,
  shield: Shield,
  "bar-chart": BarChart,
  flame: Flame,
  settings: Settings,
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const user = session?.user;
  const userRole = user?.role;
  const isAdmin = userRole === "admin";
  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";
  const initials = generateAvatar(userName);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold tracking-tight font-heading">
            Prompta
          </span>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <NavIcon
                name={item.icon}
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="my-4 px-3">
              <div className="h-px bg-sidebar-border" />
              {!collapsed && (
                <span className="mt-4 mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin
                </span>
              )}
            </div>
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <NavIcon
                    name={item.icon}
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={userName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
}
