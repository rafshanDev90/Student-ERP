import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../utils/AppError.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed", 400));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadToCloudinaryOrDisk = async (req, next, folderName) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: folderName },
          (error, uploadResult) =>
            error ? reject(error) : resolve(uploadResult)
        )
        .end(req.file.buffer);
    });

    req.body.imageUrl = result.secure_url;
    req.body.isLocalFallback = false;
    next();
  } catch (error) {
    // Cloudinary down/rate-limited -> fall back to the local file system.
    console.warn(
      `[upload] Cloudinary upload failed, falling back to local disk: ${error.message}`
    );

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      folderName
    );
    fs.mkdirSync(uploadDir, { recursive: true });

    const ext = path.extname(req.file.originalname) || ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);

    req.body.imageUrl = `/uploads/${folderName}/${filename}`;
    req.body.isLocalFallback = true;
    next();
  }
};

export const uploadWithFallback = (folderName) => {
  const singleImage = upload.single("image");

  return (req, res, next) => {
    singleImage(req, res, (err) => {
      if (err) {
        return next(err);
      }
      if (!req.file) {
        return next();
      }
      return uploadToCloudinaryOrDisk(req, next, folderName);
    });
  };
};