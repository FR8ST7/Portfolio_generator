import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import uploadRoute from "./routes/upload.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => res.send("✅ Digital Portfolio API running"));

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect MongoDB:", err);
  });
