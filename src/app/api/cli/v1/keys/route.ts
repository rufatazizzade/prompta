import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// GET: List all API Keys for the active session user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      include: { project: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: "success",
      data: keys,
      meta: { version: "v1" },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

// POST: Generate a new API Key
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, projectId } = await request.json();
    if (!name) {
      return NextResponse.json(
        { status: "error", message: "Name is required" },
        { status: 400 }
      );
    }

    // Generate a secure API key: gsk_cli_ + 32 random hex characters
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const newApiKey = `gsk_cli_${randomBytes}`;

    const createdKey = await prisma.apiKey.create({
      data: {
        key: newApiKey,
        name,
        userId: session.user.id,
        projectId: projectId || null,
        rateLimit: 100, // standard requests per minute
      },
    });

    return NextResponse.json({
      status: "success",
      data: createdKey,
      meta: { version: "v1" },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Deactivate/Delete an API key
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "API Key ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const key = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!key || key.userId !== session.user.id) {
      return NextResponse.json(
        { status: "error", message: "API Key not found or access denied" },
        { status: 404 }
      );
    }

    // Hard delete or set inactive (hard delete is simpler to clean database)
    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "success",
      message: "API Key successfully revoked.",
      meta: { version: "v1" },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
