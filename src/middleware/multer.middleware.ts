import multer, { MulterError } from "multer";
import path from "path";

const uploadPath = path.resolve(__dirname, "..", "uploads");

//Upload in disk storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname);
//   },
// });

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});
