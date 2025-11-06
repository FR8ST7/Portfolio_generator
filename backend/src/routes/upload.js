import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Base64 upload endpoint
router.post("/profilePhoto", async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ msg: "No base64 image provided" });

    const uploadResult = await cloudinary.v2.uploader.upload(base64, {
      folder: "portfolio",
    });

    res.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

export default router;
