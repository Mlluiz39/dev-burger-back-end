const multer = require("multer");
const { v4 } = require("uuid");
const { extname, resolve } = require("path");

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "uploads"),
    filename: (req, file, callback) => {
      return callback(null, v4() + extname(file.originalname));
    },
  }),
};
