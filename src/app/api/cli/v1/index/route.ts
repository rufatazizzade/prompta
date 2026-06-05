import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCliRequest, logCliRequest } from "@/lib/cliAuth";

export async function POST(request: Request) {
  const endpoint = "/api/cli/v1/index";
  const method = "POST";
  
  try {
    const authResult = await validateCliRequest(request, endpoint);
    if (authResult.error) {
      return NextResponse.json(authResult.error.json, { status: authResult.error.status });
    }

    const { projectName, projectPath, files } = await request.json();

    if (!projectName) {
      logCliRequest({
        apiKeyId: authResult.apiKeyId!,
        userId: authResult.userId!,
        endpoint,
        method,
        statusCode: 400,
      });
      return NextResponse.json(
        { status: "error", message: "Missing required parameter: projectName" },
        { status: 400 }
      );
    }

    // Find or create project
    let project = await prisma.project.findFirst({
      where: { name: projectName, userId: authResult.userId! },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: projectName,
          path: projectPath || null,
          userId: authResult.userId!,
        },
      });
    } else if (projectPath) {
      // Update path if changed
      project = await prisma.project.update({
        where: { id: project.id },
        data: { path: projectPath },
      });
    }

    let chunksIndexedCount = 0;

    if (files && Array.isArray(files)) {
      // Delete old chunks for this project to overwrite
      await prisma.fileChunk.deleteMany({
        where: { projectId: project.id },
      });

      // Insert new chunks
      const chunkData = files.map((file: any) => ({
        projectId: project!.id,
        filePath: file.filePath,
        content: file.content || "",
        tokenCount: file.tokenCount || Math.floor((file.content || "").length / 4),
      }));

      if (chunkData.length > 0) {
        await prisma.fileChunk.createMany({
          data: chunkData,
        });
        chunksIndexedCount = chunkData.length;
      }
    }

    logCliRequest({
      apiKeyId: authResult.apiKeyId!,
      userId: authResult.userId!,
      endpoint,
      method,
      statusCode: 200,
      payloadSize: JSON.stringify(files || []).length,
    });

    return NextResponse.json({
      status: "success",
      data: {
        projectId: project.id,
        projectName: project.name,
        chunksIndexed: chunksIndexedCount,
      },
      meta: { version: "v1" },
    });
  } catch (error: any) {
    console.error("CLI Index Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to index project" },
      { status: 500 }
    );
  }
}
