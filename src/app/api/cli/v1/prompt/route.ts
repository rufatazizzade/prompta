import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCliRequest, logCliRequest } from "@/lib/cliAuth";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const endpoint = "/api/cli/v1/prompt";
  const method = "POST";

  try {
    const authResult = await validateCliRequest(request, endpoint);
    if (authResult.error) {
      return NextResponse.json(authResult.error.json, { status: authResult.error.status });
    }

    const { prompt } = await request.json();

    if (!prompt) {
      logCliRequest({
        apiKeyId: authResult.apiKeyId!,
        userId: authResult.userId!,
        endpoint,
        method,
        statusCode: 400,
      });
      return NextResponse.json(
        { status: "error", message: "Missing required parameter: prompt" },
        { status: 400 }
      );
    }

    const tokensBefore = Math.floor(prompt.length / 4);

    // Call Groq to optimize the prompt for token efficiency and clarity
    let optimizedPrompt = prompt;
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert AI Prompt Optimizer. Refactor the user's prompt to be highly token-efficient, clear, and structured. Remove any unnecessary words or passive phrasing. Make it direct and instruct the model on specific output format requirements.
Respond ONLY with the final optimized prompt text, without any additional explanations, notes, or markdown backticks wrapping the prompt itself.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 1024,
      });

      const resultText = completion.choices[0]?.message?.content;
      if (resultText) {
        optimizedPrompt = resultText.trim();
      }
    } catch (apiErr) {
      console.error("Groq Prompt Optimization failed, using fallback:", apiErr);
      // Fallback: simple trimmer
      optimizedPrompt = prompt + "\n\nFormat output clearly.";
    }

    const tokensAfter = Math.floor(optimizedPrompt.length / 4);
    const tokensSaved = Math.max(0, tokensBefore - tokensAfter);
    const savingsPercentage = tokensBefore > 0 ? (tokensSaved / tokensBefore) * 100 : 0;

    // Save Prompt Optimization Record
    const record = await prisma.promptOptimization.create({
      data: {
        userId: authResult.userId!,
        originalPrompt: prompt,
        optimizedPrompt,
        tokensSaved,
        savingsPercentage,
      },
    });

    logCliRequest({
      apiKeyId: authResult.apiKeyId!,
      userId: authResult.userId!,
      endpoint,
      method,
      statusCode: 200,
      payloadSize: optimizedPrompt.length,
    });

    return NextResponse.json({
      status: "success",
      data: {
        optimizationId: record.id,
        originalPrompt: record.originalPrompt,
        optimizedPrompt: record.optimizedPrompt,
        tokensSaved: record.tokensSaved,
        savingsPercentage: parseFloat(record.savingsPercentage.toFixed(1)),
      },
      meta: { version: "v1" },
    });
  } catch (error: any) {
    console.error("CLI Prompt Optimization Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to optimize prompt" },
      { status: 500 }
    );
  }
}
