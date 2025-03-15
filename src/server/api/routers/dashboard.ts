import {
  getTaskDistributionByPriority,
  getWeeklyProgressData,
} from "../repository/analytics";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const totalTasks = await ctx.db.task.count({
      where: {
        OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
      },
    });

    const tasksCompleted = await ctx.db.task.count({
      where: {
        status: "Done",
        OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
      },
    });

    const tasksInProgress = await ctx.db.task.count({
      where: {
        status: "InProgress",
        OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
      },
    });

    const tasksPending = await ctx.db.task.count({
      where: {
        status: "Todo",
        OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
      },
    });

    const overdueTasks = await ctx.db.task.count({
      where: {
        deadline: {
          lt: new Date(),
        },
        status: {
          not: "Done",
        },
        OR: [{ createdById: userId }, { assignedTo: { some: { id: userId } } }],
      },
    });

    const taskCompletion =
      totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

    const weeklyProgressData = await getWeeklyProgressData(ctx, sevenDaysAgo);

    const taskDistribution = await getTaskDistributionByPriority(ctx);

    const analyticsData = {
      taskCompletion,
      tasksCompleted,
      tasksInProgress,
      tasksPending,
      overdueTasks,
      weeklyProgress: weeklyProgressData,
      taskDistribution,
    };

    return analyticsData;
  }),
});
