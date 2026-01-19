const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { id, rating, description } = req.body;

    if (!id || !rating || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    if (isExist) {
      return res
        .status(400)
        .json({ message: "You have already added a review for this product." });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId: id,
        rating: +rating,
        description,
      },
    });

    res.status(200).json(review);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const get = async (req, res) => {
  try {
    const { id } = req.body;

    const review = await prisma.review.findMany({
      where: {
        productId: id,
      },
    });

    res.status(200).json(review);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  create,
  get,
};
