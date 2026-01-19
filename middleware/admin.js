const admin = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== "SELLER") {
      return res
        .status(403)
        .json({
          message: "Только продавец может выставлять товары на продажу",
        });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Check role error" });
  }
};

module.exports = {
  admin,
};
