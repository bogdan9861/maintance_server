const cron = require("node-cron");
const { prisma } = require("../prisma/prisma.client");

const startOverdueScheduler = () => {
  cron.schedule("0 1 * * *", async () => {
    console.log("Checking overdue tasks...");

    const now = new Date();

    await prisma.maintenanceTask.updateMany({
      where: {
        status: "PLANNED",
        dueDate: {
          lt: now,
        },
      },
      data: {
        status: "OVERDUE",
      },
    });
  });
};

module.exports = {
  startOverdueScheduler,
};
