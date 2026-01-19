const { prisma } = require("../prisma/prisma.client");
const uploadFile = require("../utlls/uploadFile");

const create = async (req, res) => {
  try {
    const { title, description, price, categoryId } = req.body;
    const path = req?.file?.path;

    if (!title || !description || !price || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!path) {
      return res.status(400).json({ message: "Failed to get photo" });
    }

    uploadFile(path, `avatar${Date.now()}`).then(async (path) => {
      const item = await prisma.product.create({
        data: {
          title,
          description,
          price: +price,
          imageUrl: path,
          createdBy: {
            connect: {
              id: req.user.id,
            },
          },
          Category: {
            connect: {
              id: +categoryId,
            },
          },
        },
      });

      if (!item) {
        return res.status(404).json({ message: "Failed to create item" });
      }

      res.status(201).json(item);
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const title = req.query.title;
    const category = req.query.category;

    const where = {};

    if (title) {
      where.title = {
        contains: title,
      };
    }

    if (category) {
      where.categoryId = +category;
    }

    const items = await prisma.product.findMany({
      where: where,
      include: {
        reviews: true,
        Category: true,
      },
    });

    const getAverageRating = (item) => {
      if (!item.reviews.length) return 0;

      const sum = item.reviews.reduce((acc, review) => acc + review.rating, 0);
      return {
        averageRating: Number((sum / item.reviews.length).toFixed(1)),
        reviewsCount: item.reviews.length,
      };
    };

    const newItems = items.map((product) => {
      const { averageRating, reviewsCount } = getAverageRating(product);

      return {
        ...product,
        averageRating,
        reviewsCount,
      };
    });

    res.status(200).json(newItems);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = await prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        Category: true,
        reviews: true,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const getAverageRating = () => {
      if (!item.reviews.length) return 0;

      const sum = item.reviews.reduce((acc, review) => acc + review.rating, 0);
      return Number((sum / item.reviews.length).toFixed(1));
    };

    res.status(200).json({
      ...item,
      reviewsCount: item.reviews.length,
      averageRating: getAverageRating(),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID field is required" });
    }

    const isMine = await prisma.product.findFirst({
      where: {
        id,
        createdById: req.user.id,
      },
    });

    if (!isMine) {
      return res.status(403).json({ message: "Forbiden for you" });
    }

    const item = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!item) {
      return res.status(400).json({ message: "Item does not exist" });
    }

    const deletedItem = await prisma.product.delete({
      where: {
        id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Failed to delete" });
    }

    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  getAll,
  create,
  getByID,
  remove,
};
