import { Request, Response, NextFunction } from "express";

export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["x-admin-token"] as string;

  if (!token) {
    return res.status(401).json({ error: "Acceso de administrador requerido" });
  }

  const validTokens = (global as any).adminTokens || new Set();
  if (!validTokens.has(token)) {
    return res.status(403).json({ error: "Token inválido" });
  }

  next();
}
