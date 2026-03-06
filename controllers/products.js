const { prisma } = require("../prisma/prisma.client");
const uploadFile = require("../utlls/uploadFile");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      serialNumber,
      description,
      commissionDate,
      standartUsageHours,
    } = req.body;
    const file = req.file;

    if (!name || !serialNumber || !description || !commissionDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const createProduct = async (image) => {
      const product = await prisma.product.create({
        data: {
          name,
          serialNumber,
          description,
          commissionDate,
          standartUsageHours: +standartUsageHours,
          imageUrl: image || "",
        },
      });

      res.status(201).json(product);
    };

    const engineers = await prisma.user.findMany({
      where: {
        role: "ENGINEER",
      },
    });

    console.log(engineers);

    await prisma.notification.createMany({
      data: engineers.map((e) => ({
        userId: e?.id,
        title: "Добавлено новое изделие",
        message: `Администратор добавил новый товар: ${name}. Необходимо провести техническое обслуживание не позднее ${commissionDate}`,
      })),
    });

    if (file) {
      uploadFile(file?.path)
        .then((image) => createProduct(image.url))
        .catch((e) => {
          console.log(e);

          res.status(500).json({ message: "Failted to load image" });
        });

      return;
    }

    createProduct();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProducts = async (_, res) => {
  const products = await prisma.product.findMany({
    include: {
      schedules: true,
      tasks: true,
    },
  });

  res.json(products);
};

const deleteProduct = async (req, res) => {
  await prisma.product.delete({
    where: { id: req.params.id },
  });

  res.json({ message: "Deleted" });
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const editProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      serialNumber,
      description,
      commissionDate,
      standartUsageHours,
      totalUsageHours,
    } = req.body;

    const file = req.file;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateProduct = async (path) => {
      const product = await prisma.product.update({
        where: {
          id,
        },
        data: {
          name: name || existingProduct.name,
          serialNumber: serialNumber || existingProduct.serialNumber,
          description: description || existingProduct.description,
          commissionDate: commissionDate || existingProduct.commissionDate,
          standartUsageHours:
            +standartUsageHours || existingProduct.standartUsageHours,
          imageUrl: path || existingProduct.imageUrl,
          totalUsageHours: +totalUsageHours || existingProduct.totalUsageHours,
        },
      });

      res.status(200).json(product);
    };

    if (file) {
      uploadFile(file?.path)
        .then((file) => {
          updateProduct(file.url);
        })
        .catch((e) => {
          res.status(500).json({ message: "Failed to load photo" });
        });
    } else {
      updateProduct();
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  editProduct,
};
