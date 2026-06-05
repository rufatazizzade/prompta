import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCliRequest, logCliRequest } from "@/lib/cliAuth";

export async function POST(request: Request) {
  const endpoint = "/api/brain/ingest";
  const method = "POST";

  try {
    const authResult = await validateCliRequest(request, endpoint);
    if (authResult.error) {
      return NextResponse.json(authResult.error.json, { status: authResult.error.status });
    }

    const { patternType, steps, successRate } = await request.json();

    if (!patternType || !steps || !Array.isArray(steps)) {
      logCliRequest({
        apiKeyId: authResult.apiKeyId!,
        userId: authResult.userId!,
        endpoint,
        method,
        statusCode: 400,
      });
      return NextResponse.json(
        { status: "error", message: "Missing required parameters: patternType, steps (array)" },
        { status: 400 }
      );
    }

    // Retrieve user's department
    const user = await prisma.user.findUnique({
      where: { id: authResult.userId },
      select: { department: true },
    });

    const pattern = await prisma.aIWorkflowPattern.create({
      data: {
        userId: authResult.userId!,
        patternType,
        steps: JSON.stringify(steps),
        successRate: successRate || 100.0,
        usageCount: 1,
        department: user?.department || null,
      },
    });

    logCliRequest({
      apiKeyId: authResult.apiKeyId!,
      userId: authResult.userId!,
      endpoint,
      method,
      statusCode: 200,
      payloadSize: JSON.stringify(pattern).length,
    });

    return NextResponse.json({
      status: "success",
      data: {
        patternId: pattern.id,
        patternType: pattern.patternType,
      },
      meta: { version: "v1" },
    });
  } catch (error: any) {
    console.error("Brain Ingest Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to ingest workflow pattern" },
      { status: 500 }
    );
  }
}
