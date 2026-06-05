"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  UserCheck,
  Edit2,
  Trash2,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { generateAvatar } from "@/lib/utils";
import { DEPARTMENTS } from "@/lib/constants";

// Mock User database entries
const MOCK_USERS_DB = [
  { id: "u-1", name: "Sarah Chen", email: "sarah.chen@company.com", dept: "HR", role: "champion", level: 5, xp: 2450 },
  { id: "u-2", name: "Liam O'Connor", email: "liam.oconnor@company.com", dept: "Marketing", role: "user", level: 3, xp: 1250 },
  { id: "u-3", name: "Marcus Vance", email: "marcus.vance@company.com", dept: "Finance", role: "champion", level: 6, xp: 2980 },
  { id: "u-4", name: "Elena Rostova", email: "elena.rostova@company.com", dept: "Operations", role: "user", level: 2, xp: 850 },
  { id: "u-5", name: "Alex Mercer", email: "alex.mercer@company.com", dept: "Sales", role: "admin", level: 4, xp: 1980 },
  { id: "u-6", name: "Courtney Henry", email: "courtney@company.com", dept: "HR", role: "user", level: 1, xp: 150 },
  { id: "u-7", name: "Albert Flores", email: "albert@company.com", dept: "Marketing", role: "user", level: 1, xp: 200 },
  { id: "u-8", name: "Jenny Wilson", email: "jenny@company.com", dept: "Finance", role: "user", level: 2, xp: 600 },
];

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState(MOCK_USERS_DB);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const handlePromoteToChampion = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newRole = u.role === "champion" ? "user" : "champion";
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id));
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || u.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "champion":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <Users className="h-8 w-8 text-purple-500" />
          Manage Users
        </h1>
        <p className="text-muted-foreground">
          Audit credentials, manage department assignments, promote AI Champions, and delete accounts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 rounded-xl border border-border/50 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by candidate name or email address..."
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

      {/* Users Database Table */}
      <div className="glass rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs text-foreground uppercase border-b border-border/40 bg-muted/20">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Department</th>
                <th className="py-3 px-4 text-center">Role</th>
                <th className="py-3 px-4 text-center">Lvl / XP</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                  {/* User Profile Info */}
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {generateAvatar(u.name)}
                    </div>
                    <span className="font-semibold text-foreground">{u.name}</span>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4">{u.email}</td>

                  {/* Department */}
                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md border bg-muted font-bold">
                      {u.dept}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold capitalize ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Level / XP */}
                  <td className="py-4 px-4 text-center font-semibold text-foreground text-xs">
                    Lvl {u.level} ({u.xp} XP)
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right flex items-center justify-end gap-2.5">
                    {/* Champion Promotion Toggles */}
                    <button
                      onClick={() => handlePromoteToChampion(u.id)}
                      className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                        u.role === "champion"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                          : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                      }`}
                      title={u.role === "champion" ? "Demote from AI Champion" : "Promote to AI Champion"}
                    >
                      <Award className="h-4 w-4" />
                    </button>

                    {/* Delete Action */}
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="h-8 w-8 rounded-lg border border-destructive/20 hover:border-destructive text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Deactivate Account"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No accounts found matching search constraints.
          </div>
        )}
      </div>
    </div>
  );
}
