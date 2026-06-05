import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCliRequest, logCliRequest } from "@/lib/cliAuth";

export async function POST(request: Request) {
  const endpoint = "/api/metrics/waste";
  const method = "POST";

  try {
    const authResult = await validateCliRequest(request, endpoint);
    if (authResult.error) {
      return NextResponse.json(authResult.error.json, { status: authResult.error.status });
    }

    const {
      toolUsed,
      taskType,
      success,
      tokensBefore,
      tokensAfter,
      timeSpent,
      timeSaved,
    } = await request.json();

    if (!toolUsed || !taskType) {
      logCliRequest({
        apiKeyId: authResult.apiKeyId!,
        userId: authResult.userId!,
        endpoint,
        method,
        statusCode: 400,
      });
      return NextResponse.json(
        { status: "error", message: "Missing required parameters: toolUsed, taskType" },
        { status: 400 }
      );
    }

    const before = tokensBefore || 0;
    const after = tokensAfter || 0;
    const efficiency = before > 0 ? ((before - after) / before) * 100 : 0;

    // Retrieve user's department to store in metrics
    const user = await prisma.user.findUnique({
      where: { id: authResult.userId },
      select: { department: true },
    });

    const metric = await prisma.wasteMetric.create({
      data: {
        userId: authResult.userId!,
        toolUsed,
        taskType,
        success: success !== undefined ? success : true,
        timeSpent: timeSpent || 0,
        timeSaved: timeSaved || 0,
        tokensBefore: before,
        tokensAfter: after,
        efficiency: parseFloat(efficiency.toFixed(1)),
        department: user?.department || null,
        queriesCount: 1,
      },
    });

    logCliRequest({
      apiKeyId: authResult.apiKeyId!,
      userId: authResult.userId!,
      endpoint,
      method,
      statusCode: 200,
      payloadSize: JSON.stringify(metric).length,
    });

    return NextResponse.json({
      status: "success",
      data: {
        metricId: metric.id,
        efficiency: metric.efficiency,
        timeSaved: metric.timeSaved,
      },
      meta: { version: "v1" },
    });
  } catch (error: any) {
    console.error("Metrics Waste Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to log metrics" },
      { status: 500 }
    );
  }
}
