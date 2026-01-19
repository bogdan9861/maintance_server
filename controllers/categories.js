const { prisma } = require("../prisma/prisma.client");

const getAll = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  getAll,
};
