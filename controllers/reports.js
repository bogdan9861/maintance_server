const { prisma } = require("../prisma/prisma.client");
const uploadFile = require("../utlls/uploadFile");

const createReport = async (req, res) => {
  try {
    const { title, productId } = req.body;
    const file = req.file;

    if (!title || !file || !productId) {
      return res.status(400).json({
        message: `All fields are required: title: ${title} file: ${!!file} produtId: ${productId}`,
      });
    }

    uploadFile(file?.path)
      .then(async (file) => {
        const report = await prisma.report.create({
          data: {
            title,
            productId,
            fileUrl: file.url,
          },
        });

        res.status(201).json(report);
      })
      .catch((e) => {
        res.status(500).json({ message: "Failed to load file" });
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

const getReportsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reports = await prisma.report.findMany({
      where: {
        productId,
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany();

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReport,
  getReportsForProduct,
  getReports,
};
