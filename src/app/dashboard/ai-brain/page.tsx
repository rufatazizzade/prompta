"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Award,
  BookOpen,
  CheckCircle,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  User,
  Building,
  Database,
} from "lucide-react";
import { getToolColor } from "@/lib/utils";

// ─── GRAPH TYPES ──────────────────────────────────────────────
interface GraphNode {
  id: string;
  label: string;
  type: "department" | "user" | "prompt" | "project" | "file_cluster";
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  details?: string;
  promptContent?: string;
}

interface GraphLink {
  source: string;
  target: string;
}

// ─── MOCK DATA ───────────────────────────────────────────────
const MOCK_TRENDING_WORKFLOWS = [
  { rank: 1, title: "Structured CV Competency Extractor", dept: "HR", clones: 284, success: 97.2 },
  { rank: 2, title: "Financial Variance Script Coder", dept: "Finance", clones: 220, success: 95.0 },
  { rank: 3, title: "Empathy-First Support Macro Builder", dept: "Customer Support", clones: 198, success: 98.4 },
  { rank: 4, title: "Blog SEO Content Brief Builder", dept: "Marketing", clones: 158, success: 91.5 },
  { rank: 5, title: "Competitor SWOT Report Compiler", dept: "Sales", clones: 112, success: 94.4 },
];

const MOCK_COMMON_MISTAKES = [
  { id: "m-1", title: "Copying raw sensitive payroll tables directly to public ChatGPT prompts.", dept: "HR", count: 18, risk: "High (Security Leak)" },
  { id: "m-2", title: "Using Perplexity to summarize competitor reports without citation verification.", dept: "Marketing", count: 14, risk: "Medium (Hallucinations)" },
  { id: "m-3", title: "Generating VBA budget macros without setting boundary error handling rules.", dept: "Finance", count: 12, risk: "High (Calculations Error)" },
  { id: "m-4", title: "Drafting CEO outreach emails containing standard bloated AI intro hooks.", dept: "Sales", count: 9, risk: "Low (Poor Conversion)" },
];

const MOCK_BEST_PRACTICES = [
  { title: "Always use system-role constraints", desc: "Frame models with: 'You are an objective auditor' or 'You are an empathetic support agent' before submitting raw datasets.", icon: Lightbulb },
  { title: "Request JSON/Markdown table formats", desc: "Ensure consistency by ending prompts with: 'Return only structured markdown columns or key-value JSON.'", icon: Award },
  { title: "Add negative constraints", desc: "Use instructions like: 'Do not use corporate jargon (e.g., utilize, leverage) and do not explain steps.'", icon: ShieldAlert },
  { title: "Sanitize PII data", desc: "Replace employee name headers, emails, and address strings with bracketed placeholders like [candidate_name] before copying.", icon: Brain },
];

const MOCK_FLOWS = [
  { from: "Marketing", to: "Sales", topic: "SWOT markdown guides", impact: "High" },
  { from: "Finance", to: "Operations", topic: "VBA CSV scripting templates", impact: "Medium" },
  { from: "HR", to: "Support", topic: "Constructive feedback prompt builders", impact: "High" },
];

// Initial Graph dataset
const INITIAL_NODES: GraphNode[] = [
  // Departments
  { id: "dept-hr", label: "HR Dept", type: "department", color: "#8b5cf6", x: 100, y: 150, vx: 0, vy: 0, radius: 25, details: "HR training path and prompt automation hub." },
  { id: "dept-mktg", label: "Marketing", type: "department", color: "#ec4899", x: 300, y: 100, vx: 0, vy: 0, radius: 25, details: "Content generation, copywriting, and social campaign hub." },
  { id: "dept-fin", label: "Finance", type: "department", color: "#10b981", x: 500, y: 150, vx: 0, vy: 0, radius: 25, details: "Data reconciliations, forecasting models, and spreadsheet scripting." },
  { id: "dept-ops", label: "Operations", type: "department", color: "#f59e0b", x: 200, y: 350, vx: 0, vy: 0, radius: 25, details: "Logistics tracking, onboarding automations, and bottleneck audits." },
  { id: "dept-sales", label: "Sales", type: "department", color: "#3b82f6", x: 400, y: 350, vx: 0, vy: 0, radius: 25, details: "Lead enrichment and outreach sequence scripts." },

  // Champions
  { id: "champ-sarah", label: "Sarah Jenkins", type: "user", color: "#ec4899", x: 320, y: 40, vx: 0, vy: 0, radius: 18, details: "Marketing AI Champion specializing in copywriting automation." },
  { id: "champ-david", label: "David Kim", type: "user", color: "#3b82f6", x: 450, y: 410, vx: 0, vy: 0, radius: 18, details: "Sales Champion focused on bulk outreach personalization." },
  { id: "champ-admin", label: "Admin User", type: "user", color: "#f59e0b", x: 150, y: 400, vx: 0, vy: 0, radius: 18, details: "System administrator managing templates." },

  // Prompts
  {
    id: "prompt-swot",
    label: "SWOT Battlecard",
    type: "prompt",
    color: "#20808d",
    x: 420,
    y: 220,
    vx: 0,
    vy: 0,
    radius: 14,
    details: "Creates structured competitor SWOT battlecards instantly.",
    promptContent: "Act as a market researcher. Analyze this competitor page and produce a battlecard with 3 strengths, 3 weaknesses, and how to position our product against them: [URL]"
  },
  {
    id: "prompt-vlookup",
    label: "VLOOKUP Fixer",
    type: "prompt",
    color: "#0078d4",
    x: 550,
    y: 260,
    vx: 0,
    vy: 0,
    radius: 14,
    details: "Checks and optimizes Excel VLOOKUP matching functions.",
    promptContent: "Check this Excel spreadsheet schema for inconsistencies and write a VLOOKUP formula that retrieves data from column B to column H: [schema]"
  },
  {
    id: "prompt-resume",
    label: "CV Scorer",
    type: "prompt",
    color: "#8b5cf6",
    x: 50,
    y: 240,
    vx: 0,
    vy: 0,
    radius: 14,
    details: "Screens resume text against role requirements.",
    promptContent: "Evaluate this candidate's CV against our job descriptions and provide a match percentage: [CV]"
  },

  // CLI Integration Nodes (Cyan for Project, Orange for File Clusters)
  {
    id: "proj-cli-connect",
    label: "CLI: Prompta-CLI",
    type: "project",
    color: "#06b6d4",
    x: 200,
    y: 220,
    vx: 0,
    vy: 0,
    radius: 20,
    details: "External CLI workspace indexed locally at /Users/admin/projects/prompta-cli."
  },
  {
    id: "cluster-cli-files",
    label: "Source Files Cluster",
    type: "file_cluster",
    color: "#ff7a00",
    x: 250,
    y: 270,
    vx: 0,
    vy: 0,
    radius: 15,
    details: "Ingested codebase context chunk including src/index.ts and src/utils/auth.ts."
  }
];

const INITIAL_LINKS: GraphLink[] = [
  // Champions to Depts
  { source: "champ-sarah", target: "dept-mktg" },
  { source: "champ-david", target: "dept-sales" },
  { source: "champ-admin", target: "dept-ops" },

  // Prompts to Depts/Champions
  { source: "prompt-swot", target: "dept-mktg" },
  { source: "prompt-swot", target: "champ-sarah" },
  { source: "prompt-vlookup", target: "dept-fin" },
  { source: "prompt-resume", target: "dept-hr" },
  
  // CLI Ingestion links
  { source: "proj-cli-connect", target: "dept-ops" },
  { source: "cluster-cli-files", target: "proj-cli-connect" },
  { source: "cluster-cli-files", target: "prompt-vlookup" },

  // Cross-dept flows
  { source: "dept-mktg", target: "dept-sales" },
  { source: "dept-fin", target: "dept-ops" },
  { source: "dept-hr", target: "dept-sales" },
];

export default function CompanyAIBrainPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [links] = useState<GraphLink[]>(INITIAL_LINKS);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [copied, setCopied] = useState(false);

  // Dragging & Panning State
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Physics loop constants
  const repulsion = 400;
  const springLength = 80;
  const springStrength = 0.05;
  const damping = 0.85;

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      setNodes((currentNodes) => {
        const nextNodes = currentNodes.map((n) => ({ ...n }));

        // 1. Repulsion force between all node pairs
        for (let i = 0; i < nextNodes.length; i++) {
          const nodeA = nextNodes[i];
          for (let j = i + 1; j < nextNodes.length; j++) {
            const nodeB = nextNodes[j];
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            if (dist < 300) {
              const force = repulsion / (dist * dist);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (nodeA.id !== draggedNodeId) {
                nodeA.vx -= fx;
                nodeA.vy -= fy;
              }
              if (nodeB.id !== draggedNodeId) {
                nodeB.vx += fx;
                nodeB.vy += fy;
              }
            }
          }
        }

        // 2. Attraction force along link connections
        for (const link of links) {
          const sourceNode = nextNodes.find((n) => n.id === link.source);
          const targetNode = nextNodes.find((n) => n.id === link.target);

          if (sourceNode && targetNode) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (dist - springLength) * springStrength;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (sourceNode.id !== draggedNodeId) {
              sourceNode.vx += fx;
              sourceNode.vy += fy;
            }
            if (targetNode.id !== draggedNodeId) {
              targetNode.vx -= fx;
              targetNode.vy -= fy;
            }
          }
        }

        // 3. Central gravity to keep the graph centered
        const centerX = 300;
        const centerY = 225;
        for (const n of nextNodes) {
          if (n.id === draggedNodeId) continue;
          n.vx += (centerX - n.x) * 0.005;
          n.vy += (centerY - n.y) * 0.005;
        }

        // 4. Update node coordinates
        for (const n of nextNodes) {
          if (n.id === draggedNodeId) continue;
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= damping;
          n.vy *= damping;
        }

        return nextNodes;
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [draggedNodeId, links]);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Apply pan & zoom transform
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw Links (Lines)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.5;
    for (const link of links) {
      const source = nodes.find((n) => n.id === link.source);
      const target = nodes.find((n) => n.id === link.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    }

    // Draw Nodes
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Glowing outline for selected node
      if (selectedNode && selectedNode.id === node.id) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Render Labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px var(--font-inter)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y + node.radius + 12);
    }

    ctx.restore();
  }, [nodes, links, selectedNode, offsetX, offsetY, scale]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Mouse coords relative to canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Inverse transform mouse coordinates to check against node coordinates
    const graphX = (mouseX - offsetX) / scale;
    const graphY = (mouseY - offsetY) / scale;

    // Check if clicked a node
    const hitNode = nodes.find((n) => {
      const dx = n.x - graphX;
      const dy = n.y - graphY;
      return Math.sqrt(dx * dx + dy * dy) < n.radius;
    });

    if (hitNode) {
      setDraggedNodeId(hitNode.id);
      setSelectedNode(hitNode);
    } else {
      // Start panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedNodeId) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Map back to physics coordinate space
      const graphX = (mouseX - offsetX) / scale;
      const graphY = (mouseY - offsetY) / scale;

      setNodes((curr) =>
        curr.map((n) => (n.id === draggedNodeId ? { ...n, x: graphX, y: graphY, vx: 0, vy: 0 } : n))
      );
    } else if (isPanning) {
      setOffsetX(e.clientX - panStart.x);
      setOffsetY(e.clientY - panStart.y);
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      setScale((s) => Math.min(s * zoomFactor, 2.5));
    } else {
      setScale((s) => Math.max(s / zoomFactor, 0.5));
    }
  };

  const handleResetView = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScale(1);
    setSelectedNode(null);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary animate-pulse" />
          Company AI Brain
        </h1>
        <p className="text-muted-foreground">
          The centralized intelligence map of our organization. Learn from trending workflows, audit security risks, and clone top prompt scripts.
        </p>
      </div>

      {/* Interactive AI Knowledge Graph Section */}
      <div className="glass p-6 rounded-2xl border border-border/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-3">
          <div>
            <h2 className="font-heading font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Organizational AI Knowledge Graph
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag nodes to rearrange, scroll to zoom, click to audit details.
            </p>
          </div>
          <button
            onClick={handleResetView}
            className="text-xs border border-border hover:bg-muted font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            Reset View
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Wrapper */}
          <div className="lg:col-span-2 relative border border-border/40 rounded-xl bg-[#141517] overflow-hidden min-h-[300px] lg:min-h-[450px]">
            <canvas
              ref={canvasRef}
              width={600}
              height={450}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
          </div>

          {/* Node Inspector Sidebar */}
          <div className="lg:col-span-1 glass p-5 rounded-xl border border-border/40 bg-background/30 flex flex-col justify-between min-h-[300px]">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {selectedNode.type} Node
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white">{selectedNode.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedNode.details}</p>

                  {/* If selected node is a Prompt node, show code block */}
                  {selectedNode.type === "prompt" && selectedNode.promptContent && (
                    <div className="space-y-2 pt-2">
                      <span className="block text-[10px] font-bold text-primary uppercase">Prompt Template</span>
                      <div className="bg-background/80 p-3 rounded-lg border border-border/40 relative group">
                        <pre className="text-[11px] text-emerald-500 whitespace-pre-wrap font-mono leading-normal">
                          {selectedNode.promptContent}
                        </pre>
                        <button
                          onClick={() => handleCopyPrompt(selectedNode.promptContent!)}
                          className="absolute top-2 right-2 p-1.5 bg-[#222529] border border-border/40 rounded hover:bg-[#1a1d21] text-muted-foreground hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-[#2ebd7f] font-semibold block">Cloned 34 times in Marketplace</span>
                    </div>
                  )}

                  {/* If selected node is user / champion */}
                  {selectedNode.type === "user" && (
                    <div className="flex gap-2 items-center bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">Department Champion Expert</span>
                    </div>
                  )}

                  {/* If selected node is department */}
                  {selectedNode.type === "department" && (
                    <div className="flex gap-2 items-center bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                      <Building className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-500">Corporate Innovation Node</span>
                    </div>
                  )}

                  {/* If selected node is project */}
                  {selectedNode.type === "project" && (
                    <div className="flex gap-2 items-center bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3">
                      <Building className="h-4 w-4 text-cyan-500" />
                      <span className="text-xs font-semibold text-cyan-500">CLI Indexed Project Workspace</span>
                    </div>
                  )}

                  {/* If selected node is file_cluster */}
                  {selectedNode.type === "file_cluster" && (
                    <div className="flex gap-2 items-center bg-orange-500/5 border border-orange-500/10 rounded-lg p-3">
                      <Database className="h-4 w-4 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-500">CLI Context File Cluster</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground gap-3 flex-1">
                  <Brain className="h-8 w-8 text-border animate-pulse" />
                  <span className="text-xs italic leading-relaxed">
                    Click any node in the graph to inspect details, read prompt templates, or learn about team champions.
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Grid Layout (Workflows & Audit Warnings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Workflows and Prompt successes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trending Workflows */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending AI Workflows This Month
            </h3>

            <div className="space-y-3">
              {MOCK_TRENDING_WORKFLOWS.map((wf) => (
                <div
                  key={wf.rank}
                  className="p-4 bg-muted/30 border border-border/30 rounded-lg flex items-center justify-between text-sm hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                      #{wf.rank}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">{wf.title}</h4>
                      <p className="text-xs text-muted-foreground">Department: {wf.dept}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px] uppercase">Clones</span>
                      <span className="font-bold">{wf.clones}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px] uppercase">Success Rate</span>
                      <span className="font-bold text-emerald-500">{wf.success}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              Audited AI Mistakes (Privacy & Quality Risks)
            </h3>

            <div className="space-y-3">
              {MOCK_COMMON_MISTAKES.map((m) => (
                <div
                  key={m.id}
                  className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-center justify-between text-sm"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{m.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/30">
                        {m.dept}
                      </span>
                      <span>&bull;</span>
                      <span>Audited {m.count} times</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    m.risk.startsWith("High")
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-500"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-500"
                  }`}>
                    {m.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Best practices and flows */}
        <div className="lg:col-span-1 space-y-6">
          {/* Best Practices */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Emerging Best Practices
            </h3>

            <div className="space-y-4">
              {MOCK_BEST_PRACTICES.map((bp, i) => {
                const Icon = bp.icon;
                return (
                  <div key={i} className="flex gap-3 text-xs leading-relaxed">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-foreground">{bp.title}</h4>
                      <p className="text-muted-foreground">{bp.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Flows */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Knowledge Flows (Cross-Dept Shares)
            </h3>

            <div className="space-y-3">
              {MOCK_FLOWS.map((flow, i) => (
                <div key={i} className="p-3.5 bg-muted/40 border border-border/30 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-foreground">{flow.from} &rarr; {flow.to}</span>
                    <span className="text-emerald-500 font-bold">{flow.impact} Impact</span>
                  </div>
                  <p className="text-muted-foreground">Shared prompt: <strong className="text-foreground">"{flow.topic}"</strong></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
