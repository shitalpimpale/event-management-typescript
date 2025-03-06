import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = express.Router();

// User Signup
router.post("/signup", async (req:any, res:any) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({email});
   // let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true }).json({ token, user });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
});

// User Login
router.post("/login", async (req:any, res:any) => {
  try {
    const { email, password } = req.body;
    const user:any = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true }).json({ token, user });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

export default router;
