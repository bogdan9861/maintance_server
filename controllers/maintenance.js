const { prisma } = require("../prisma/prisma.client");

const createTemplate = async (req, res) => {
  try {
    const { name, description, type, estimatedHours } = req.body;

    if (!name || !description || !type || !estimatedHours) {
      res.status(400).json({ message: "All fields are required" });
    }

    const template = await prisma.maintenanceTemplate.create({
      data: {
        name,
        description,
        type,
        estimatedHours: +estimatedHours,
      },
    });

    res.status(201).json(template);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTemplates = async (_, res) => {
  const templates = await prisma.maintenanceTemplate.findMany();
  res.json(templates);
};

const deleteTemplate = async (req, res) => {
  await prisma.maintenanceTemplate.delete({
    where: { id: req.params.id },
  });
  res.json({ message: "Deleted" });
};

module.exports = {
  createTemplate,
  getTemplates,
  deleteTemplate,
};
