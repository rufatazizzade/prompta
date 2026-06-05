"use client";

import { useState } from "react";
import {
  Building,
  Users,
  Award,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";

// Mock stats per department
const MOCK_DEPT_DETAILS = [
  { name: "HR", members: 12, avgXp: 1140, champion: "Sarah Chen" },
  { name: "Marketing", members: 28, avgXp: 920, champion: "Liam O'Connor" },
  { name: "Finance", members: 18, avgXp: 1420, champion: "Marcus Vance" },
  { name: "Operations", members: 22, avgXp: 880, champion: "Elena Rostova" },
  { name: "Sales", members: 42, avgXp: 1050, champion: "Alex Mercer" },
  { name: "Customer Support", members: 26, avgXp: 740, champion: "Devon Lane" },
];

export default function AdminDepartmentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
            <Building className="h-8 w-8 text-purple-500" />
            Departments
          </h1>
          <p className="text-muted-foreground">
            Monitor AI adoption metrics, view total headcount, and identify top performers across corporate divisions.
          </p>
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DEPT_DETAILS.map((dept) => {
          // Find color from constants mapping
          const baseColor = DEPARTMENTS.find(d => d.name === dept.name)?.color || "var(--primary)";
          return (
            <div
              key={dept.name}
              className="glass p-6 rounded-xl border border-border/50 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
            >
              {/* Colored side ribbon */}
              <div
                className="absolute top-0 left-0 bottom-0 w-1.5"
                style={{ backgroundColor: baseColor }}
              />

              <div className="space-y-5 pl-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading font-bold text-xl">{dept.name}</h3>
                  <Building className="h-5 w-5 text-muted-foreground/40" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground uppercase text-[10px]">Headcount</span>
                    <p className="text-base font-bold text-foreground flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {dept.members} Users
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground uppercase text-[10px]">Average XP</span>
                    <p className="text-base font-bold text-foreground flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      {dept.avgXp} XP
                    </p>
                  </div>
                </div>

                {/* Top Performer */}
                <div className="pt-3 border-t border-border/30 text-xs">
                  <span className="text-muted-foreground uppercase text-[10px]">Department Champion:</span>
                  <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                    {dept.champion}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
