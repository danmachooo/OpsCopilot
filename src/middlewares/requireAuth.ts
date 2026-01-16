import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { toFetchHeaders } from "../helpers/toFetchHeaders";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: { id: string };
//     }
//   }
// }

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // NOTE: adjust API name based on your Better Auth instance
    const session = await auth.api.getSession({
      headers: toFetchHeaders(req.headers),
    });

    if (!session?.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = { id: session.user.id };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
