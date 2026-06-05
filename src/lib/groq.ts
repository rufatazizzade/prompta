import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AIRecommendation {
  recommendedTool: string;
  reason: string;
  promptTemplate: string;
  alternatives: string[];
  timeSavings: string;
  difficulty: string;
}

export async function getAIRecommendation(taskDescription: string): Promise<AIRecommendation> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI tool recommendation expert for enterprise employees. Given a task description, recommend the best AI tool and provide guidance.

Available tools: ChatGPT, Claude, Gemini, Perplexity, Copilot

Respond in this exact JSON format:
{
  "recommendedTool": "ToolName",
  "reason": "Clear explanation of why this tool is best for this specific task",
  "promptTemplate": "A ready-to-use prompt template for this task. Use [brackets] for placeholders.",
  "alternatives": ["Alternative1", "Alternative2"],
  "timeSavings": "Estimated time savings (e.g., '2-3 hours' or '60%')",
  "difficulty": "beginner|intermediate|advanced|expert"
}

Consider these tool strengths:
- ChatGPT: General text tasks, writing, brainstorming, conversation, code
- Claude: Long document analysis, reasoning, careful analysis, safety-critical tasks
- Gemini: Research, multimodal (images + text), Google Workspace integration
- Perplexity: Research with citations, fact-checking, real-time information
- Copilot: Microsoft Office integration, email drafting, Excel formulas, presentations`
        },
        {
          role: "user",
          content: taskDescription,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    return JSON.parse(content) as AIRecommendation;
  } catch (error) {
    console.error("Groq API error, falling back to rule-based:", error);
    return getFallbackRecommendation(taskDescription);
  }
}

export async function analyzeDetectiveContent(content: string, userAnalysis: string): Promise<{
  score: number;
  feedback: string;
  missedIssues: string[];
}> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI literacy expert evaluating a user's ability to detect issues in AI-generated content. 
Score their analysis from 0-100 and provide constructive feedback.

Respond in JSON:
{
  "score": 85,
  "feedback": "Great job identifying...",
  "missedIssues": ["Issue they missed"]
}`
        },
        {
          role: "user",
          content: `AI-generated content:\n${content}\n\nUser's analysis:\n${userAnalysis}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 512,
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) throw new Error("No response");
    return JSON.parse(result);
  } catch {
    return { score: 70, feedback: "Analysis received. Manual review pending.", missedIssues: [] };
  }
}

function getFallbackRecommendation(task: string): AIRecommendation {
  const lower = task.toLowerCase();

  if (lower.includes("cv") || lower.includes("resume") || lower.includes("hire") || lower.includes("interview")) {
    return {
      recommendedTool: "ChatGPT",
      reason: "ChatGPT excels at text analysis, summarization, and pattern recognition — perfect for screening CVs and preparing interview materials.",
      promptTemplate: "Analyze the following CV for a [Position] role. Evaluate: 1) Key qualifications, 2) Relevant experience, 3) Skills match, 4) Red flags. Provide a score from 1-10.\n\n[Paste CV here]",
      alternatives: ["Claude", "Gemini"],
      timeSavings: "3-4 hours per batch of 20 CVs",
      difficulty: "beginner",
    };
  }

  if (lower.includes("research") || lower.includes("market") || lower.includes("competitor")) {
    return {
      recommendedTool: "Perplexity",
      reason: "Perplexity provides real-time research with citations and sources, making it ideal for market research and competitive analysis.",
      promptTemplate: "Conduct a comprehensive market research analysis for [Industry/Product]. Include: 1) Market size and trends, 2) Key competitors, 3) Target audience insights, 4) Opportunities and threats. Provide sources.",
      alternatives: ["Gemini", "ChatGPT"],
      timeSavings: "4-6 hours of manual research",
      difficulty: "intermediate",
    };
  }

  if (lower.includes("report") || lower.includes("financial") || lower.includes("analysis")) {
    return {
      recommendedTool: "Claude",
      reason: "Claude is excellent at handling long documents and detailed analysis, with superior reasoning for financial and data-heavy reports.",
      promptTemplate: "Analyze the following [report type] data and create a comprehensive report. Include: 1) Executive summary, 2) Key metrics analysis, 3) Trends identified, 4) Recommendations.\n\n[Paste data here]",
      alternatives: ["ChatGPT", "Gemini"],
      timeSavings: "2-3 hours per report",
      difficulty: "intermediate",
    };
  }

  if (lower.includes("email") || lower.includes("presentation") || lower.includes("excel") || lower.includes("office")) {
    return {
      recommendedTool: "Copilot",
      reason: "Microsoft Copilot integrates directly with Office 365 apps, making it the best choice for email drafting, presentations, and spreadsheet tasks.",
      promptTemplate: "Create a professional [email/presentation/spreadsheet] for [purpose]. Key points to include: [list key points]. Tone: [formal/casual/persuasive].",
      alternatives: ["ChatGPT", "Gemini"],
      timeSavings: "1-2 hours per task",
      difficulty: "beginner",
    };
  }

  if (lower.includes("campaign") || lower.includes("content") || lower.includes("social media") || lower.includes("copy")) {
    return {
      recommendedTool: "ChatGPT",
      reason: "ChatGPT is excellent for creative content generation, copywriting, and brainstorming marketing campaigns.",
      promptTemplate: "Create a [social media/email/ad] campaign for [product/service]. Target audience: [describe]. Include: 1) Campaign concept, 2) Key messages, 3) 5 post/email variations, 4) Call-to-action suggestions.",
      alternatives: ["Claude", "Gemini"],
      timeSavings: "3-5 hours of creative work",
      difficulty: "intermediate",
    };
  }

  // Default recommendation
  return {
    recommendedTool: "ChatGPT",
    reason: "ChatGPT is a versatile AI assistant suitable for a wide range of tasks including writing, analysis, brainstorming, and problem-solving.",
    promptTemplate: "Help me with the following task: [Describe your task in detail]. Provide a structured response with clear steps and actionable recommendations.",
    alternatives: ["Claude", "Gemini"],
    timeSavings: "1-3 hours depending on complexity",
    difficulty: "beginner",
  };
}
