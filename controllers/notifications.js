const { prisma } = require("../prisma/prisma.client");

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const readNotifications = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        isRead: false,
        userId: req.user.id,
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const readNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  readNotifications,
  readNotification,
};
