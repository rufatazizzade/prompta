import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning up database...");
  await prisma.apiKey.deleteMany();
  await prisma.cliAuditLog.deleteMany();
  await prisma.fileChunk.deleteMany();
  await prisma.contextSnapshot.deleteMany();
  await prisma.project.deleteMany();
  await prisma.promptOptimization.deleteMany();
  await prisma.aIWorkflowPattern.deleteMany();
  await prisma.sprintContribution.deleteMany();
  await prisma.hackathonSprint.deleteMany();
  await prisma.wasteMetric.deleteMany();
  await prisma.battleVote.deleteMany();
  await prisma.battleParticipant.deleteMany();
  await prisma.battle.deleteMany();
  await prisma.detectiveChallenge.deleteMany();
  await prisma.simulatorScenario.deleteMany();
  await prisma.championQuestion.deleteMany();
  await prisma.championFollow.deleteMany();
  await prisma.champion.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.review.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.task.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log("Seeding departments...");
  const depts = [
    { name: "HR", icon: "users", color: "#8b5cf6" },
    { name: "Marketing", icon: "megaphone", color: "#ec4899" },
    { name: "Finance", icon: "banknote", color: "#10b981" },
    { name: "Operations", icon: "settings", color: "#f59e0b" },
    { name: "Sales", icon: "trending-up", color: "#3b82f6" },
    { name: "Customer Support", icon: "headphones", color: "#06b6d4" },
  ];

  const createdDepts = [];
  for (const dept of depts) {
    const d = await prisma.department.create({
      data: dept,
    });
    createdDepts.push(d);
  }

  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@prompta.com",
      hashedPassword,
      role: "admin",
      department: "Operations",
      skillLevel: "expert",
      xp: 2500,
      level: 10,
    },
  });

  const championUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "champion@prompta.com",
      hashedPassword,
      role: "champion",
      department: "Marketing",
      skillLevel: "advanced",
      xp: 1800,
      level: 8,
      bio: "AI copywriting expert and automation enthusiast.",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "user@prompta.com",
      hashedPassword,
      role: "user",
      department: "HR",
      skillLevel: "beginner",
      xp: 450,
      level: 2,
    },
  });

  const users = [adminUser, championUser, regularUser];

  // Additional mock users
  const mockUsers = [
    { name: "Michael Chen", email: "mchen@prompta.com", dept: "Finance", level: 5, xp: 1200, role: "user" },
    { name: "Emily Watson", email: "ewatson@prompta.com", dept: "Customer Support", level: 4, xp: 950, role: "user" },
    { name: "David Kim", email: "dkim@prompta.com", dept: "Sales", level: 6, xp: 1400, role: "champion" },
    { name: "Jessica Taylor", email: "jtaylor@prompta.com", dept: "HR", level: 3, xp: 600, role: "user" },
  ];

  for (const mu of mockUsers) {
    const u = await prisma.user.create({
      data: {
        name: mu.name,
        email: mu.email,
        hashedPassword,
        role: mu.role,
        department: mu.dept,
        skillLevel: mu.level > 5 ? "advanced" : "intermediate",
        xp: mu.xp,
        level: mu.level,
      },
    });
    users.push(u);
  }

  console.log("Seeding champions...");
  await prisma.champion.create({
    data: {
      userId: championUser.id,
      department: "Marketing",
      specialization: "Copywriting & Campaign Automation",
      followersCount: 15,
    },
  });

  const davidKim = users.find(u => u.email === "dkim@prompta.com");
  if (davidKim) {
    await prisma.champion.create({
      data: {
        userId: davidKim.id,
        department: "Sales",
        specialization: "Lead Enrichment & Email Personalization",
        followersCount: 8,
      },
    });
  }

  console.log("Seeding achievements...");
  const achievements = [
    { name: "AI Novice", description: "Completed your first learning path module", icon: "graduation-cap", xpRequired: 100, category: "learning" },
    { name: "First Step", description: "Successfully submitted your first task challenge", icon: "check-square", xpRequired: 200, category: "tasks" },
    { name: "Constructive Critic", description: "Submitted a peer review of a colleague's prompt", icon: "message-square", xpRequired: 300, category: "reviews" },
    { name: "Knowledge Builder", description: "Created your first approved article in the Knowledge Hub", icon: "book-open", xpRequired: 500, category: "knowledge" },
    { name: "Prompt Pioneer", description: "Had a prompt template cloned 10+ times in the marketplace", icon: "store", xpRequired: 800, category: "social" },
    { name: "AI Master", description: "Reached level 10 and completed 15+ challenges", icon: "trophy", xpRequired: 2000, category: "general" },
  ];

  const dbAchievements = [];
  for (const ach of achievements) {
    const a = await prisma.achievement.create({
      data: ach,
    });
    dbAchievements.push(a);
  }

  // Grant achievements to some users
  await prisma.userAchievement.createMany({
    data: [
      { userId: regularUser.id, achievementId: dbAchievements[0].id },
      { userId: championUser.id, achievementId: dbAchievements[0].id },
      { userId: championUser.id, achievementId: dbAchievements[1].id },
      { userId: championUser.id, achievementId: dbAchievements[2].id },
      { userId: adminUser.id, achievementId: dbAchievements[0].id },
      { userId: adminUser.id, achievementId: dbAchievements[1].id },
      { userId: adminUser.id, achievementId: dbAchievements[5].id },
    ],
  });

  console.log("Seeding tasks...");
  const tasks = [
    {
      title: "Write an Outreach Sequence",
      description: "Draft a 3-step personalized outreach email sequence using ChatGPT for cold leads.",
      expectedOutcome: "A sequence of 3 emails with specific personalisation placeholders.",
      aiTools: JSON.stringify(["ChatGPT"]),
      difficulty: "beginner",
      xpReward: 100,
      department: "Sales",
    },
    {
      title: "Analyze Competitor Pricing",
      description: "Use Claude to extract and compare pricing structures from three raw PDF competitor flyers.",
      expectedOutcome: "A summary table of competitor price points and features.",
      aiTools: JSON.stringify(["Claude"]),
      difficulty: "intermediate",
      xpReward: 200,
      department: "Marketing",
    },
    {
      title: "VBA Macro Debugging",
      description: "Use Copilot to write and fix a macro that compiles monthly financial spreadsheets.",
      expectedOutcome: "Working VBA code block with instructions on installation.",
      aiTools: JSON.stringify(["Copilot"]),
      difficulty: "advanced",
      xpReward: 300,
      department: "Finance",
    },
    {
      title: "Process Mapping Assistant",
      description: "Feed Operations data to Gemini and draft a flow diagram template for supplier onboarding.",
      expectedOutcome: "Textual process diagram mapping steps 1 to 10.",
      aiTools: JSON.stringify(["Gemini"]),
      difficulty: "intermediate",
      xpReward: 150,
      department: "Operations",
    },
    {
      title: "Customer Support Macro Generator",
      description: "Generate 10 dynamic customer support templates using ChatGPT for common billing errors.",
      expectedOutcome: "10 template replies with variable tokens.",
      aiTools: JSON.stringify(["ChatGPT", "Copilot"]),
      difficulty: "beginner",
      xpReward: 120,
      department: "Customer Support",
    },
  ];

  const dbTasks = [];
  for (const t of tasks) {
    const dt = await prisma.task.create({
      data: t,
    });
    dbTasks.push(dt);
  }

  console.log("Seeding submissions and reviews...");
  const submission1 = await prisma.submission.create({
    data: {
      taskId: dbTasks[0].id,
      userId: regularUser.id,
      content: "Here is my 3-step outreach campaign draft. For Step 1, I used a pain-point focus...",
      links: JSON.stringify(["https://docs.google.com/document/d/1"]),
      status: "reviewed",
      xpEarned: 100,
    },
  });

  await prisma.review.create({
    data: {
      submissionId: submission1.id,
      reviewerId: championUser.id,
      reviewedUserId: regularUser.id,
      strengths: "Great personalization hook in the first email.",
      weaknesses: "Email 3 is slightly too long and might get filtered.",
      improvements: "Shorten Email 3 to under 80 words and include a calendar booking link.",
      helpful: true,
    },
  });

  // Open submission for review
  await prisma.submission.create({
    data: {
      taskId: dbTasks[1].id,
      userId: users.find(u => u.email === "mchen@prompta.com")!.id,
      content: "Pricing competitor report. Attached is my comparative table.",
      status: "submitted",
    },
  });

  console.log("Seeding prompt marketplace...");
  const prompts = [
    {
      title: "Competitor Battlecard Prompt",
      content: "Act as a market researcher. Analyze this competitor page and produce a battlecard with 3 strengths, 3 weaknesses, and how to position our product against them: [URL]",
      useCase: "Create competitor battlecards instantly for sales reps.",
      aiTool: "Perplexity",
      category: "Marketing",
      successRate: 92.4,
      rating: 4.8,
      ratingCount: 15,
      cloneCount: 34,
      creatorId: championUser.id,
    },
    {
      title: "Excel VLOOKUP Helper",
      content: "Explain how to write a formula that does [X] and explain step-by-step why it works.",
      useCase: "Quick spreadsheet formula helper.",
      aiTool: "Copilot",
      category: "Finance",
      successRate: 95.0,
      rating: 4.5,
      ratingCount: 22,
      cloneCount: 56,
      creatorId: adminUser.id,
    },
  ];

  for (const pr of prompts) {
    await prisma.prompt.create({
      data: pr,
    });
  }

  console.log("Seeding knowledge articles...");
  await prisma.knowledgeArticle.create({
    data: {
      title: "How to Avoid Hallucinations in Financial Reports",
      content: "Financial reports require absolute precision. Follow this 3-step prompting strategy: 1) Feed raw schema, 2) Enable step-by-step auditing, 3) Use double-pass validation...",
      category: "Finance",
      type: "tutorial",
      authorId: adminUser.id,
    },
  });

  console.log("Seeding simulator scenarios...");
  await prisma.simulatorScenario.create({
    data: {
      title: "Quarterly Performance Audit",
      description: "Analyze and summarize department efficiency logs with 200+ raw entries.",
      department: "Operations",
      difficulty: "advanced",
      timeLimit: 45,
      context: "Your department head has asked for a summary of operations blockers, but the logs are fragmented.",
      objectives: JSON.stringify(["Consolidate logs", "Highlight top 3 blockers", "Provide recommendations"]),
      idealAnswer: "The ideal approach is to use Claude 3.5 Sonnet to ingest the CSV data, write a Python analysis script, and outline actionable logistics improvements.",
    },
  });

  console.log("Seeding AI Detective challenges...");
  await prisma.detectiveChallenge.create({
    data: {
      title: "Spot the Financial Hallucination",
      description: "Analyze this generated market summary and click the line containing the hallucinated growth rate.",
      content: "The market expanded by 4.2% in Q1. High inflation caused interest rates to skyrocket to 14.5% in the US (hallucination, actual is ~5%). Cloud adoption grew by 12%.",
      issues: JSON.stringify([
        { type: "hallucination", location: "14.5% interest rate", explanation: "Interest rates in the US during this period did not exceed 5.5%." }
      ]),
      difficulty: "beginner",
      xpReward: 50,
      category: "hallucination",
    },
  });

  console.log("Seeding waste metrics logs...");
  // Seed past 30 days of metrics for graphs
  const now = new Date();
  const tools = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Copilot"];
  const tasksList = ["Content Generation", "Research", "Coding", "Data Analysis", "Email Drafting"];

  const wasteData = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Create 3-5 entries per day
    const entriesCount = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < entriesCount; j++) {
      const tool = tools[Math.floor(Math.random() * tools.length)];
      const taskType = tasksList[Math.floor(Math.random() * tasksList.length)];
      const success = Math.random() > 0.15; // 85% success rate
      const timeSpent = Math.floor(Math.random() * 30) + 10;
      const timeSaved = success ? Math.floor(Math.random() * 45) + 15 : 0;
      const user = users[Math.floor(Math.random() * users.length)];

      wasteData.push({
        userId: user.id,
        date,
        toolUsed: tool,
        taskType,
        success,
        timeSpent,
        timeSaved,
        queriesCount: Math.floor(Math.random() * 5) + 1,
        department: user.department || "Operations",
      });
    }
  }

  await prisma.wasteMetric.createMany({
    data: wasteData,
  });

  console.log("Seeding learning paths...");
  // Create 6 learning paths
  for (const d of createdDepts) {
    let levels = [];
    if (d.name === "HR") {
      levels = [
        { level: 1, title: "Prompt Engineering Basics", description: "Master the fundamentals of crafting effective prompts for HR workflows", xp: 250, status: "completed" },
        { level: 2, title: "AI-Powered Recruitment", description: "Leverage AI for resume screening, candidate matching, and interview prep", xp: 500, status: "current" },
        { level: 3, title: "Employee Engagement Analytics", description: "Use AI to analyze sentiment, predict attrition, and boost culture", xp: 500, status: "locked" },
        { level: 4, title: "Strategic HR Intelligence", description: "Build AI-driven workforce planning and policy recommendation systems", xp: 750, status: "locked" },
      ];
    } else {
      levels = [
        { level: 1, title: `${d.name} AI Basics`, description: `Core concepts of AI in ${d.name}`, xp: 250, status: "completed" },
        { level: 2, title: `${d.name} AI Intermediate`, description: `Practical tools and templates for ${d.name} workflows`, xp: 500, status: "current" },
        { level: 3, title: `${d.name} AI Advanced`, description: `System integrations and complex prompts for ${d.name}`, xp: 500, status: "locked" },
        { level: 4, title: `${d.name} AI Expert`, description: `Mastery and champion teaching of AI in ${d.name}`, xp: 750, status: "locked" },
      ];
    }

    const path = await prisma.learningPath.create({
      data: {
        title: `${d.name} AI Mastery`,
        description: `Complete guide to using AI in ${d.name} roles.`,
        department: d.name,
        departmentId: d.id,
        levels: JSON.stringify(levels),
        totalLevels: 4,
      },
    });

    // Seed progress for alex rivera (HR beginner)
    if (d.name === "HR") {
      await prisma.userProgress.create({
        data: {
          userId: regularUser.id,
          pathId: path.id,
          currentLevel: 2,
          completedLessons: JSON.stringify(["hr-lvl1-1", "hr-lvl1-2"]),
        },
      });
    }
  }

  console.log("Seeding hackathon sprints...");
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  const sprint = await prisma.hackathonSprint.create({
    data: {
      title: "Operations Logistics Speedup",
      description: "Develop prompting templates to optimize supply chain delivery bottlenecks, customs forms processing, and supplier invoicing audits.",
      status: "active",
      targetScore: 5000,
      endDate,
    },
  });

  // Add contributions to the sprint
  await prisma.sprintContribution.createMany({
    data: [
      {
        sprintId: sprint.id,
        userId: users.find((u) => u.email === "champion@prompta.com")!.id,
        department: "Marketing",
        pointsEarned: 150,
        promptUsed: "Rewrite this customs delay response email with polite and informative tone: [details]",
      },
      {
        sprintId: sprint.id,
        userId: users.find((u) => u.email === "user@prompta.com")!.id,
        department: "HR",
        pointsEarned: 150,
        promptUsed: "Structure candidate onboarding checklists for operations assistants: [details]",
      },
      {
        sprintId: sprint.id,
        userId: users.find((u) => u.email === "mchen@prompta.com")!.id,
        department: "Finance",
        pointsEarned: 300,
        promptUsed: "VBA script to parse logistics invoice anomalies: [code]",
      },
    ],
  });

  console.log("Seeding CLI API Keys...");
  const adminId = users.find((u) => u.email === "admin@prompta.com")!.id;
  const userId = users.find((u) => u.email === "user@prompta.com")!.id;
  const championId = users.find((u) => u.email === "champion@prompta.com")!.id;

  const adminKey = await prisma.apiKey.create({
    data: {
      key: "gsk_cli_admin_secret_key_12345",
      name: "Default Admin CLI Key",
      userId: adminId,
    },
  });

  const userKey = await prisma.apiKey.create({
    data: {
      key: "gsk_cli_user_secret_key_67890",
      name: "Personal Laptop CLI Key",
      userId: userId,
    },
  });

  console.log("Seeding CLI Projects and Chunks...");
  const project1 = await prisma.project.create({
    data: {
      name: "Prompta-CLI",
      userId: adminId,
      path: "/Users/admin/projects/prompta-cli",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Logistics-Audit",
      userId: userId,
      path: "/Users/user/dev/logistics-audit",
    },
  });

  // Seed File Chunks
  await prisma.fileChunk.createMany({
    data: [
      {
        projectId: project1.id,
        filePath: "src/index.ts",
        content: "import { Command } from 'commander';\nconst program = new Command();\nprogram.version('1.0.0');",
        tokenCount: 45,
      },
      {
        projectId: project1.id,
        filePath: "src/utils/auth.ts",
        content: "export function getHeaders(apiKey: string) { return { 'x-api-key': apiKey }; }",
        tokenCount: 22,
      },
      {
        projectId: project2.id,
        filePath: "src/parser.py",
        content: "def parse_invoice(file_path):\n    # Extract invoice info\n    pass",
        tokenCount: 30,
      },
    ],
  });

  // Seed Context Snapshot
  await prisma.contextSnapshot.create({
    data: {
      projectId: project1.id,
      query: "how to parse commander arguments",
      compressedContext: "[File: src/index.ts]\nimport { Command } from 'commander';\nconst program = new Command();",
      tokenCount: 15,
    },
  });

  console.log("Seeding CLI Prompt Optimizations...");
  await prisma.promptOptimization.createMany({
    data: [
      {
        userId: adminId,
        originalPrompt: "write a python function to parse csv and print average of columns",
        optimizedPrompt: "Act as a Python developer. Write a highly optimized function using pandas to read a CSV and output column averages: [csv_path]",
        savingsPercentage: 35.5,
        tokensSaved: 120,
      },
      {
        userId: userId,
        originalPrompt: "make a typescript interface for user details including name age email status",
        optimizedPrompt: "Generate a clean TypeScript interface for a User object with name (string), age (number), email (string), and status (enum):",
        savingsPercentage: 25.0,
        tokensSaved: 85,
      },
    ],
  });

  console.log("Seeding CLI Workflow Ingestion Patterns...");
  await prisma.aIWorkflowPattern.createMany({
    data: [
      {
        userId: adminId,
        patternType: "code_generation",
        steps: JSON.stringify(["Identify context chunks", "Request Llama 3.3 code generation", "Execute local linting check"]),
        successRate: 94.5,
        usageCount: 28,
        department: "Operations",
      },
      {
        userId: championId,
        patternType: "refactoring",
        steps: JSON.stringify(["Extract target function context", "Query Qwen Coder model", "Run diff patch application"]),
        successRate: 88.0,
        usageCount: 15,
        department: "Marketing",
      },
    ],
  });

  console.log("Seeding Token Savings WasteMetrics...");
  // Inject some token-related metrics into WasteMetric
  const tokenStats = [
    { tool: "ChatGPT", task: "Code Generation", before: 4500, after: 1200, efficiency: 73.3, saved: 15 },
    { tool: "Claude", task: "Context Analysis", before: 8000, after: 2400, efficiency: 70.0, saved: 30 },
    { tool: "Qwen", task: "Refactoring", before: 3000, after: 800, efficiency: 73.3, saved: 10 },
    { tool: "Gemini", task: "Code Generation", before: 5000, after: 1500, efficiency: 70.0, saved: 20 },
  ];

  const wasteEntries = [];
  const baseDate = new Date();
  for (let i = 15; i >= 0; i--) {
    const stat = tokenStats[i % tokenStats.length];
    const date = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
    const success = Math.random() > 0.1;
    wasteEntries.push({
      userId: adminId,
      date,
      toolUsed: stat.tool,
      taskType: stat.task,
      success,
      timeSpent: Math.floor(Math.random() * 20) + 5,
      timeSaved: success ? stat.saved : 0,
      queriesCount: Math.floor(Math.random() * 3) + 1,
      department: "Operations",
      tokensBefore: stat.before,
      tokensAfter: stat.after,
      efficiency: stat.efficiency,
    });
  }

  await prisma.wasteMetric.createMany({
    data: wasteEntries,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
