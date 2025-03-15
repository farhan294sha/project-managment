import { PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";

interface Ctx {
  session: Session;
  db: PrismaClient;
}

export async function getWeeklyProgressData(ctx: Ctx, startDate: Date) {
  const userId = ctx.session.user?.id;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = [] as { day: string; completed: number | undefined }[];

  // Get tasks completed in the last 7 days
  const completedTasks = await ctx.db.task.findMany({
    where: {
      status: "Done",
      updatedAt: {
        gte: startDate,
      },
      OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
    },
    select: {
      updatedAt: true,
    },
  });

  // Initialize counts for each day
  const dailyCounts = {} as Record<string, number>;
  days.forEach((day) => (dailyCounts[day] = 0));

  // Count tasks completed on each day
  completedTasks.forEach((task) => {
    const dayName = days[task.updatedAt.getDay()];
    if (dayName) {
      if (dailyCounts[dayName]) {
        dailyCounts[dayName]++;
      }
    }
  });

  // Format data for chart
  days.forEach((day) => {
    weeklyData.push({
      day,
      completed: dailyCounts[day],
    });
  });

  // Rotate array to start with Monday
  const mondayIndex = days.indexOf("Mon");
  return [
    ...weeklyData.slice(mondayIndex),
    ...weeklyData.slice(0, mondayIndex),
  ];
}

export async function getTaskDistributionByPriority(ctx: Ctx) {
  // Get counts for each priority
  const userId = ctx.session.user?.id;
  const highPriorityCount = await ctx.db.task.count({
    where: {
      priority: "High",
      OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
    },
  });

  const mediumPriorityCount = await ctx.db.task.count({
    where: {
      priority: "Medium",
      OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
    },
  });

  const lowPriorityCount = await ctx.db.task.count({
    where: {
      priority: "Low",
      OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
    },
  });

  const totalTasks = highPriorityCount + mediumPriorityCount + lowPriorityCount;

  // Calculate percentages
  return {
    high:
      totalTasks > 0 ? Math.round((highPriorityCount / totalTasks) * 100) : 0,
    medium:
      totalTasks > 0 ? Math.round((mediumPriorityCount / totalTasks) * 100) : 0,
    low: totalTasks > 0 ? Math.round((lowPriorityCount / totalTasks) * 100) : 0,
  };
}
