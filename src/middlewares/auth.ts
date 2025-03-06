import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req:any, res:any, next: NextFunction) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export const authorizeRoles = (roles: string[]) => {
    return (req:any, res:any, next: NextFunction) => {
      const authReq = req as any;
      if (!roles.includes(authReq.user.role)) {
        return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
      }
      next();
    };
  };
  