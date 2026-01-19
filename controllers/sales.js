const { prisma } = require("../prisma/prisma.client");

const get = async (req, res) => {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        product: true,
      },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  get,
};
