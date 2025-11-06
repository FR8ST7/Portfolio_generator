import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";
const TOKEN_EXPIRES = "7d";

// helper to clean user
const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject();
  delete user.password;
  return user;
};

// ================= REGISTER ==================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Name, email, and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error during register" });
  }
});

// ================= LOGIN ==================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
});

export default router;
