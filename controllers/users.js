const { prisma } = require("../prisma/prisma.client");
const uploadFile = require("../utlls/uploadFile");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (isExist) {
      return res.status(409).json({
        message: "User already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Failed to register user" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      ...user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });

    if (user && isPasswordCorrect) {
      res.status(200).json({ ...user, token });
    } else {
      res.status(400).json({ message: "Incorrect login data" });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const current = async (req, res) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const edit = async (req, res) => {
  try {
    const { name, email } = req.body;
    const path = req?.file?.path;

    console.log("path ===>", path);

    uploadFile(path, `avatar${Date.now()}`)
      .then(async (path) => {
        const user = await prisma.user.update({
          where: {
            id: req.user.id,
          },
          data: {
            name: name || req.user.name,
            email: email || req.user.email,
            imageUrl: path || req.user.imageUrl,
          },
        });

        res.status(200).json(user);
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: "Could not send image to the service" });
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  register,
  login,
  current,
  edit,
};
