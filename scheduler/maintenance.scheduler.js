const cron = require("node-cron");
const { prisma } = require("../prisma/prisma.client");

const startMaintenanceScheduler = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running maintenance scheduler...");

    const schedules = await prisma.maintenanceSchedule.findMany({
      where: { isActive: true },
      include: { product: true },
    });

    for (const schedule of schedules) {
      const now = new Date();
      const product = schedule.product;

      let shouldCreateTask = false;

      // 1️⃣ Проверка по времени
      if (schedule.intervalDays && schedule.lastExecutedAt) {
        const nextDate = new Date(schedule.lastExecutedAt);
        nextDate.setDate(nextDate.getDate() + schedule.intervalDays);

        if (now >= nextDate) {
          shouldCreateTask = true;
        }
      }

      // 2️⃣ Проверка по наработке
      if (schedule.intervalHours && schedule.lastUsageValue !== null) {
        const nextUsage = schedule.lastUsageValue + schedule.intervalHours;

        if (product.totalUsageHours >= nextUsage) {
          shouldCreateTask = true;
        }
      }

      if (shouldCreateTask) {
        // защита от дублей
        const existing = await prisma.maintenanceTask.findFirst({
          where: {
            scheduleId: schedule.id,
            status: {
              in: ["PLANNED", "IN_PROGRESS"],
            },
          },
        });

        if (!existing) {
          await prisma.maintenanceTask.create({
            data: {
              productId: product.id,
              scheduleId: schedule.id,
              plannedDate: now,
              usageAtCreation: product.totalUsageHours,
            },
          });

          const engineers = await prisma.user.findMany({
            where: {
              role: "ENGINEER",
            },
          });

          await prisma.notification.createMany({
            data: engineers.map((engineer) => ({
              userId: engineer.id,
              title: "New maintenance task",
              message: `Task created for ${product.name}`,
            })),
          });

          console.log(`Task created for product ${product.name}`);
        }
      }
    }
  });
};

module.exports = {
  startMaintenanceScheduler,
};
