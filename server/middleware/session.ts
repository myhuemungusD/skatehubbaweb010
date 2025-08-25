
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export function requireSession(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session;
  
  if (!token) {
    return res.status(401).json({ error: "No session found" });
  }
  
  try {
    const payload = jwt.verify(token, process.env.APP_JWT_SECRET || 'your-secret-key') as any;
    (req as any).uid = payload.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid session" });
  }
}
