import { prisma } from "@/lib/prisma";

export interface CliAuthResult {
  userId?: string;
  projectId?: string;
  apiKeyId?: string;
  error?: {
    status: number;
    json: any;
  };
}

/**
 * Validates the API key from request headers, checks rate limits, and returns user/project context.
 */
export async function validateCliRequest(
  request: Request,
  endpoint: string
): Promise<CliAuthResult> {
  const method = request.method;
  const apiKeyHeader = request.headers.get("x-api-key");

  if (!apiKeyHeader) {
    return {
      error: {
        status: 401,
        json: {
          status: "error",
          message: "Unauthorized: Missing 'x-api-key' header.",
          meta: { version: "v1" },
        },
      },
    };
  }

  // Find key in database
  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKeyHeader },
    include: { user: true },
  });

  if (!apiKeyRecord || !apiKeyRecord.isActive) {
    return {
      error: {
        status: 401,
        json: {
          status: "error",
          message: "Unauthorized: Invalid or inactive API key.",
          meta: { version: "v1" },
        },
      },
    };
  }

  // Rate Limiting (Simple database sliding-window of last 60 seconds)
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const recentCallsCount = await prisma.cliAuditLog.count({
    where: {
      apiKeyId: apiKeyRecord.id,
      createdAt: { gte: oneMinuteAgo },
    },
  });

  if (recentCallsCount >= apiKeyRecord.rateLimit) {
    // Log rate limit breach
    await prisma.cliAuditLog.create({
      data: {
        apiKeyId: apiKeyRecord.id,
        userId: apiKeyRecord.userId,
        endpoint,
        method,
        statusCode: 429,
        payloadSize: 0,
      },
    });

    return {
      error: {
        status: 429,
        json: {
          status: "error",
          message: "Too Many Requests: Rate limit exceeded for this API key.",
          meta: {
            version: "v1",
            rateLimit: apiKeyRecord.rateLimit,
            currentCallsInLastMinute: recentCallsCount,
          },
        },
      },
    };
  }

  return {
    userId: apiKeyRecord.userId,
    projectId: apiKeyRecord.projectId || undefined,
    apiKeyId: apiKeyRecord.id,
  };
}

/**
 * Utility to write standard audit logs for API endpoint executions.
 */
export async function logCliRequest(params: {
  apiKeyId: string;
  userId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  payloadSize?: number;
}) {
  try {
    await prisma.cliAuditLog.create({
      data: {
        apiKeyId: params.apiKeyId,
        userId: params.userId,
        endpoint: params.endpoint,
        method: params.method,
        statusCode: params.statusCode,
        payloadSize: params.payloadSize || 0,
      },
    });
  } catch (err) {
    console.error("Failed to write CLI Audit Log:", err);
  }
}
