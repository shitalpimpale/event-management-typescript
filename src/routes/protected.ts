import express from "express";
import { authMiddleware,authorizeRoles } from "../middlewares/auth";

const router = express.Router();

// Only logged-in users can access
router.get("/profile", authMiddleware, (req:any, res:any) => {
  res.json({ message: `Welcome, ${req.user.role}!`, user: req.user });
});

// Only admins can access
router.get("/admin", authMiddleware, authorizeRoles(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

export default router;
