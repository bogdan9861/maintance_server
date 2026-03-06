const { prisma } = require("../prisma/prisma.client");

const createSchedule = async (req, res) => {
  try {
    const { productId, templateId, scheduleType, intervalDays, intervalHours } =
      req.body;

    const schedule = await prisma.maintenanceSchedule.create({
      data: {
        productId,
        templateId,
        scheduleType,
        intervalDays,
        intervalHours: +intervalHours,
      },
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

const getSchedules = async (_, res) => {
  const schedules = await prisma.maintenanceSchedule.findMany({
    include: {
      product: true,
      template: true,
    },
  });

  res.json(schedules);
};

const deactivateSchedule = async (req, res) => {
  const schedule = await prisma.maintenanceSchedule.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });

  res.json(schedule);
};

module.exports = {
  createSchedule,
  getSchedules,
  deactivateSchedule,
};
