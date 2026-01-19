const { prisma } = require("../prisma/prisma.client");

const add = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "All fiels are required" });

    const product = await prisma.cart.create({
      data: {
        userId: req.user.id,
        productId: id,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const get = async (req, res) => {
  try {
    const cart = await prisma.cart.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "All fiels are required" });

    const cart = await prisma.cart.delete({
      where: {
        id,
      },
    });

    return res.status(204).json({});
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = { add, get, remove };
