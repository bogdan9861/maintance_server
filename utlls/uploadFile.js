const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: "dhnhvvkx7",
  api_key: "547668788456733",
  api_secret: "pM6SyKdCmtFWFUOp3Bd-fsxxigk",
});

const uploadFile = async (path, public_id) => {
  const result = await cloudinary.uploader.upload(path, {
    public_id,
    resource_type: "image",
  });

  return result.secure_url;
};

module.exports = uploadFile;
