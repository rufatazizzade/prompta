"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Settings2,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
  Terminal,
  RefreshCw,
  Eye,
} from "lucide-react";

interface SlackMessage {
  id: string;
  sender: "user" | "bot";
  senderName: string;
  avatar: string;
  time: string;
  text: string;
  recommendation?: {
    recommendedTool: string;
    reason: string;
    promptTemplate: string;
    timeSavings: string;
    difficulty: string;
    alternatives: string[];
  };
}

export default function IntegrationsPage() {
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Chat simulator state
  const [chatInput, setChatInput] = useState("/prompta I need to compare quarterly marketing pricing sheets");
  const [messages, setMessages] = useState<SlackMessage[]>([
    {
      id: "m-1",
      sender: "bot",
      senderName: "Prompta Bot",
      avatar: "PB",
      time: "10:24 AM",
      text: "👋 Hello! I am the Prompta AI GPS Bot. Type `/prompta [describe your task]` to get instant tool recommendations and prompt templates directly in Slack.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const handleCopyKey = () => {
    navigator.clipboard.writeText("xoxb-prompta-security-token-93821049281");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append User Message
    const userMsgId = `m-u-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        senderName: "You (Admin)",
        avatar: "YA",
        time: timeString,
        text: userText,
      },
    ]);
    setChatInput("");

    // Start Typing indicator
    setIsTyping(true);

    try {
      // Check if command starts with /prompta
      if (userText.startsWith("/prompta ")) {
        const taskDescription = userText.replace("/prompta ", "");

        // Call the live AI recommendations endpoint!
        const res = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskDescription }),
        });
        const recommendation = await res.json();

        if (recommendation.error) throw new Error(recommendation.error);

        // Append Bot Response
        setMessages((prev) => [
          ...prev,
          {
            id: `m-b-${Date.now()}`,
            sender: "bot",
            senderName: "Prompta Bot",
            avatar: "PB",
            time: timeString,
            text: `Here is your AI GPS recommendation for: "${taskDescription}"`,
            recommendation: {
              recommendedTool: recommendation.recommendedTool,
              reason: recommendation.reason,
              promptTemplate: recommendation.promptTemplate,
              timeSavings: recommendation.timeSavings || "1-2 hours",
              difficulty: recommendation.difficulty || "intermediate",
              alternatives: recommendation.alternatives || [],
            },
          },
        ]);
      } else {
        // Echo back guidance
        setMessages((prev) => [
          ...prev,
          {
            id: `m-b-${Date.now()}`,
            sender: "bot",
            senderName: "Prompta Bot",
            avatar: "PB",
            time: timeString,
            text: "⚠️ Unknown command. Type `/prompta [describe task]` to get tool recommendations.",
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-b-${Date.now()}`,
          sender: "bot",
          senderName: "Prompta Bot",
          avatar: "PB",
          time: timeString,
          text: `❌ Error querying Prompta AI GPS API: ${err.message || "Request failed"}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-pink-500" />
          Intranet Integrations
        </h1>
        <p className="text-muted-foreground">
          Connect Prompta directly to your corporate workspaces, configure API webhooks, and test communication flows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Slack Connector */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                <h3 className="font-heading font-bold text-sm">Slack Integration</h3>
              </div>
              <button
                onClick={() => setSlackEnabled(!slackEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  slackEnabled ? "bg-primary" : "bg-muted border border-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    slackEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Exposes the `/prompta` slash command in your organization Slack workspace.
            </p>
            {slackEnabled && (
              <div className="space-y-2.5 pt-2">
                <div className="text-xs">
                  <span className="block text-[10px] text-muted-foreground uppercase font-bold">Bot Secret Token</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="password"
                      value="xoxb-prompta-security-token-93821049281"
                      disabled
                      className="flex-1 bg-background/50 border border-input rounded p-1.5 text-xs text-muted-foreground"
                    />
                    <button
                      onClick={handleCopyKey}
                      className="p-1.5 border border-border hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all"
                    >
                      {copiedKey ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teams Connector */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h3 className="font-heading font-bold text-sm">Microsoft Teams</h3>
              </div>
              <button
                onClick={() => setTeamsEnabled(!teamsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  teamsEnabled ? "bg-primary" : "bg-muted border border-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    teamsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enables the Prompta chatbot app inside Microsoft Teams group chats and direct messages.
            </p>
          </div>

          {/* Custom Webhook API Config */}
          <div className="glass p-6 rounded-xl border border-border/50 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-heading font-bold text-sm">Outbound Webhooks</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Notify external APIs or security auditing hubs whenever sensitive prompt violations are flagged by the PII Shield.
            </p>
            <div className="text-xs space-y-2">
              <span className="block text-[10px] text-muted-foreground uppercase font-bold">Webhook Endpoint URL</span>
              <input
                type="text"
                placeholder="https://api.yourcompany.com/v1/security-logs"
                className="w-full bg-background/50 border border-input rounded p-2 text-xs text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Slack Simulator Console */}
        <div className="lg:col-span-2 flex flex-col h-[600px] border border-border/60 rounded-xl bg-[#1a1d21] text-white overflow-hidden shadow-2xl">
          {/* Channel Header */}
          <div className="px-5 py-3 border-b border-white/10 bg-[#121517] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-bold text-sm block">#ai-gps-bot</span>
                <span className="text-[10px] text-muted-foreground">Intranet-integrated bot playground</span>
              </div>
            </div>
            <span className="text-xs bg-[#2e343b] px-2.5 py-1 rounded text-muted-foreground font-semibold flex items-center gap-1">
              <Terminal className="h-3 w-3" />
              Slack Sandbox Mode
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#1a1d21]">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 text-sm"
                >
                  <div className={`h-9 w-9 rounded flex items-center justify-center shrink-0 font-bold ${
                    msg.sender === "bot" ? "bg-pink-600 text-white" : "bg-purple-600 text-white"
                  }`}>
                    {msg.avatar}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-white text-xs">{msg.senderName}</span>
                      <span className="text-[9px] text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-[#d1d2d3] text-xs leading-relaxed">{msg.text}</p>

                    {/* Rich Bot Recommendation Card output */}
                    {msg.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 bg-[#222529] border border-white/10 rounded-lg p-4 space-y-3 max-w-xl"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-pink-500">🏆 Recommended: {msg.recommendation.recommendedTool}</span>
                            <span className="text-[10px] bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded uppercase font-bold">
                              {msg.recommendation.difficulty}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#2ebd7f] font-bold">⏱️ Saves {msg.recommendation.timeSavings}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{msg.recommendation.reason}</p>
                        
                        {/* Copyable Prompt block */}
                        <div className="bg-[#121517] p-3 rounded border border-white/5 space-y-2 relative group">
                          <span className="block text-[9px] uppercase font-bold text-[#616061]">Suggested Prompt Template</span>
                          <pre className="text-xs text-[#2ebd7f] whitespace-pre-wrap font-mono leading-normal">
                            {msg.recommendation.promptTemplate}
                          </pre>
                          <button
                            onClick={() => handleCopyTemplate(msg.recommendation!.promptTemplate, msg.id)}
                            className="absolute top-2 right-2 p-1 bg-[#222529] border border-white/10 rounded hover:bg-[#1a1d21] text-muted-foreground hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            {copiedPrompt === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 text-sm text-muted-foreground"
                >
                  <div className="h-9 w-9 rounded bg-[#2e343b] flex items-center justify-center shrink-0 font-bold">
                    PB
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-white text-xs">Prompta Bot</span>
                    <div className="flex gap-1 items-center mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce delay-100" />
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#121517] border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type /prompta [task]..."
              disabled={isTyping}
              className="flex-1 bg-[#222529] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-pink-500/50"
            />
            <button
              type="submit"
              disabled={isTyping || !chatInput.trim()}
              className="p-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
