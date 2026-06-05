import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { redactPII, scanForPII } from "@/lib/security";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const selectedModel = model || "llama-3.3-70b-versatile";

    // 1. Scan and redact PII for corporate compliance
    const piiDetected = scanForPII(prompt);
    const safePrompt = redactPII(prompt);

    // 2. Run the actual prompt against the chosen model
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: safePrompt,
        },
      ],
      model: selectedModel,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const outputText = completion.choices[0]?.message?.content || "No output generated.";

    // 3. Perform a prompt audit/evaluation using Llama-3.3-70b
    let evaluation = {
      score: 75,
      feedback: "Standard prompt execution. Try adding role context or output guidelines to improve effectiveness.",
      suggestions: ["Add role definition (e.g., 'Act as a software engineer')", "Specify output formatting (e.g., 'Format as a list')"],
    };

    try {
      const auditCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an AI Prompt Engineering Auditor. Grade the user's prompt out of 100 and provide suggestions.
Respond in this exact JSON format:
{
  "score": 85,
  "feedback": "Analysis of the prompt structure...",
  "suggestions": ["Specific recommendation 1", "Specific recommendation 2"]
}`,
          },
          {
            role: "user",
            content: `User prompt to evaluate:\n"${safePrompt}"`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 512,
        response_format: { type: "json_object" },
      });

      const auditContent = auditCompletion.choices[0]?.message?.content;
      if (auditContent) {
        evaluation = JSON.parse(auditContent);
      }
    } catch (auditError) {
      console.error("Prompt evaluation failed, using fallback metrics:", auditError);
    }

    return NextResponse.json({
      output: outputText,
      evaluation,
      piiScanned: piiDetected.length,
      wasRedacted: safePrompt !== prompt,
      redactedPrompt: safePrompt !== prompt ? safePrompt : null,
    });
  } catch (error: any) {
    console.error("Sandbox API error:", error);
    return NextResponse.json(
      { error: "Sandbox execution failed", details: error.message },
      { status: 500 }
    );
  }
}
