import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch projects
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { fileChunks: true, contextSnapshots: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Fetch recent prompt optimizations
    const optimizations = await prisma.promptOptimization.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Fetch recent CLI audit logs
    const logs = await prisma.cliAuditLog.findMany({
      where: { userId },
      include: { apiKey: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Fetch ingested patterns count
    const patternsCount = await prisma.aIWorkflowPattern.count({
      where: { userId },
    });

    return NextResponse.json({
      status: "success",
      data: {
        projects,
        optimizations,
        logs,
        patternsCount,
      },
      meta: { version: "v1" },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
