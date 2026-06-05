import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCliRequest, logCliRequest } from "@/lib/cliAuth";

export async function POST(request: Request) {
  const endpoint = "/api/cli/v1/context";
  const method = "POST";

  try {
    const authResult = await validateCliRequest(request, endpoint);
    if (authResult.error) {
      return NextResponse.json(authResult.error.json, { status: authResult.error.status });
    }

    const { projectId, query } = await request.json();

    if (!projectId || !query) {
      logCliRequest({
        apiKeyId: authResult.apiKeyId!,
        userId: authResult.userId!,
        endpoint,
        method,
        statusCode: 400,
      });
      return NextResponse.json(
        { status: "error", message: "Missing required parameters: projectId, query" },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { fileChunks: true },
    });

    if (!project || project.userId !== authResult.userId) {
      logCliRequest({
        apiKeyId: authResult.apiKeyId!,
        userId: authResult.userId!,
        endpoint,
        method,
        statusCode: 404,
      });
      return NextResponse.json(
        { status: "error", message: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Context Engine simple keyword match logic:
    // Split query into keywords, search chunks that contain keywords
    const keywords = query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
    
    let matchedChunks = project.fileChunks;
    if (keywords.length > 0) {
      matchedChunks = project.fileChunks.filter((chunk) => {
        const contentLower = chunk.content.toLowerCase();
        const pathLower = chunk.filePath.toLowerCase();
        return keywords.some((keyword: string) => contentLower.includes(keyword) || pathLower.includes(keyword));
      });
    }

    // Fallback: If no files match keywords, return first 3 files
    if (matchedChunks.length === 0) {
      matchedChunks = project.fileChunks.slice(0, 3);
    }

    // Format compressed context representation
    const compressedContext = matchedChunks
      .map((chunk) => `[File: ${chunk.filePath}]\n${chunk.content.substring(0, 800)}${chunk.content.length > 800 ? "\n..." : ""}`)
      .join("\n\n");

    const tokenCount = Math.floor(compressedContext.length / 4);

    // Save Context Snapshot
    const snapshot = await prisma.contextSnapshot.create({
      data: {
        projectId,
        query,
        compressedContext,
        tokenCount,
      },
    });

    logCliRequest({
      apiKeyId: authResult.apiKeyId!,
      userId: authResult.userId!,
      endpoint,
      method,
      statusCode: 200,
      payloadSize: compressedContext.length,
    });

    return NextResponse.json({
      status: "success",
      data: {
        snapshotId: snapshot.id,
        projectId: project.id,
        projectName: project.name,
        query: snapshot.query,
        compressedContext: snapshot.compressedContext,
        tokenCount: snapshot.tokenCount,
      },
      meta: { version: "v1" },
    });
  } catch (error: any) {
    console.error("CLI Context Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to resolve context" },
      { status: 500 }
    );
  }
}
