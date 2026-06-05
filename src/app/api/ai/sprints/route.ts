import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch active sprint (or create one if none exists)
    let sprint = await prisma.hackathonSprint.findFirst({
      where: { status: "active" },
      include: {
        contributions: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!sprint) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      sprint = await prisma.hackathonSprint.create({
        data: {
          title: "Operations Logistics Speedup",
          description: "Develop prompting templates to optimize supply chain delivery bottlenecks, customs forms processing, and supplier invoicing audits.",
          status: "active",
          targetScore: 5000,
          endDate,
        },
        include: {
          contributions: {
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
        },
      });
    }

    // 2. Aggregate points per department
    const contributions = await prisma.sprintContribution.findMany({
      where: { sprintId: sprint.id },
    });

    const departmentScores: Record<string, number> = {
      HR: 0,
      Marketing: 0,
      Finance: 0,
      Operations: 0,
      Sales: 0,
      "Customer Support": 0,
    };

    contributions.forEach((c) => {
      const dept = c.department || "Operations";
      departmentScores[dept] = (departmentScores[dept] || 0) + c.pointsEarned;
    });

    return NextResponse.json({
      sprint,
      scoreboard: departmentScores,
    });
  } catch (error: any) {
    console.error("Sprint GET error:", error);
    return NextResponse.json({ error: "Failed to load sprint metrics" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { sprintId, userId, promptUsed } = await request.json();

    if (!sprintId || !userId || !promptUsed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch user and check department
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dept = user.department || "Operations";
    const pointsEarned = 150; // standard points per sprint contribution

    // 2. Create contribution record
    const contribution = await prisma.sprintContribution.create({
      data: {
        sprintId,
        userId,
        department: dept,
        promptUsed,
        pointsEarned,
      },
    });

    // 3. Award XP to user
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: pointsEarned },
      },
    });

    return NextResponse.json({ success: true, contribution });
  } catch (error: any) {
    console.error("Sprint POST error:", error);
    return NextResponse.json({ error: "Failed to log contribution" }, { status: 500 });
  }
}
