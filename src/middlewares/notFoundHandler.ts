import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors";

/**
 * Catch-all for 404 routes
 * Register this BEFORE the error handler but AFTER all valid routes
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  next(error);
}
