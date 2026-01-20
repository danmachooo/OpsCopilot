import { Request, Response, NextFunction } from "express";
import { HttpContext } from "../controllers/team.types";

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */

export const asyncHandler =
  (fn: (http: HttpContext) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn({ req, res })).catch(next);
  };
