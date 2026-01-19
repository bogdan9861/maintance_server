const { prisma } = require("../prisma/prisma.client");

const pay = async (req, res) => {
  try {
    await prisma.cart.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  pay,
};
