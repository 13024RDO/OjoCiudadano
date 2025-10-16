import { Request, Response, NextFunction } from "express";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.headers["x-role"] === "admin" || req.query.admin === "true") {
    return next();
  }
  res.status(403).json({ error: "Acceso denegado" });
}
