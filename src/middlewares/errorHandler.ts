import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import Logger from "../utils/logger";
import { AppError } from "../errors";
import { Prisma } from "../generated/prisma/client";
import { appConfig } from "../../config/appConfig";
import { ErrorResponse } from "../types/error";

/**
 * True when running in a development environment.
 *
 * Used to determine whether to include stack traces
 * in error responses.
 */
const isDevelopment = appConfig.app.nodeEnv === "development";

/**
 * Global Express error-handling middleware.
 *
 * Must be registered **after** all routes and middleware:
 * ```ts
 * app.use(errorHandler);
 * ```
 *
 * Responsibilities:
 * - Normalize errors into consistent HTTP responses
 * - Map known error types to correct status codes and messages:
 *   - Zod validation errors (400)
 *   - AppError and subclasses (statusCode from error)
 *   - Prisma known request errors (mapped by code)
 *   - JWT errors (401)
 *   - Multer upload errors (400)
 * - Log with appropriate severity:
 *   - 5xx: server errors logged as `error` with stack + request context
 *   - 4xx: client errors logged as `warn` with minimal context
 *
 * Security notes:
 * - Avoid returning internal error objects directly to clients.
 * - Stack traces are only included in development.
 *
 * @param err - The thrown or rejected error.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function (unused, but required for signature).
 * @returns JSON response with `success: false`.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: any = undefined;

  // --- Zod validation errors ---
  if (err instanceof z.ZodError) {
    statusCode = 400;
    message = "Validation error";
    errors = err.issues;
  }

  // --- Custom AppError instances ---
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // --- Prisma errors (reliable detection) ---
  else if (isPrismaKnownRequestError(err)) {
    const prismaError = handlePrismaKnownError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
    errors = prismaError.errors;
  }

  // --- JWT errors ---
  else if (err instanceof Error && err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // --- Multer errors ---
  else if (err instanceof Error && err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Normalize to an Error object for consistent logging/stack handling
  const errObj = err instanceof Error ? err : new Error(String(err));

  // Log error details
  if (statusCode >= 500) {
    Logger.error("Server error:", {
      message: errObj.message,
      stack: errObj.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  } else {
    Logger.warn("Client error:", {
      message: errObj.message,
      statusCode,
      url: req.url,
      method: req.method,
    });
  }

  const response: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDevelopment && { stack: errObj.stack }),
  };

  return res.status(statusCode).json(response);
}

/**
 * Type guard for reliably detecting Prisma "known request" errors.
 *
 * PrismaClientKnownRequestError includes stable error codes like:
 * - P2002 (unique constraint violation)
 * - P2025 (record not found)
 * - P2003 (foreign key violation)
 *
 * @param err - Unknown error thrown by Prisma or other layers.
 * @returns True if `err` is a PrismaClientKnownRequestError.
 */
function isPrismaKnownRequestError(
  err: unknown,
): err is Prisma.PrismaClientKnownRequestError {
  return err instanceof Prisma.PrismaClientKnownRequestError;
}

/**
 * Maps Prisma known request errors into HTTP-friendly error responses.
 *
 * Customize this mapping to match your domain semantics.
 *
 * Current mappings:
 * - P2002: Unique constraint violation (409)
 *   - Special-cased for `ownerId` to enforce "one team per owner"
 * - P2025: Record not found (404)
 * - P2003: Foreign key / invalid reference (400)
 * - P2014: Required relation violation (400)
 * - Default: Database error (500)
 *
 * @param err - Prisma known request error.
 * @returns A normalized HTTP error descriptor.
 */
function handlePrismaKnownError(err: Prisma.PrismaClientKnownRequestError): {
  statusCode: number;
  message: string;
  errors?: any;
} {
  switch (err.code) {
    case "P2002": {
      const target = err.meta?.target;

      // `target` can be string[] or string depending on Prisma version/adapter
      const fields = Array.isArray(target)
        ? target
        : target
          ? [String(target)]
          : [];

      const joined = fields.length ? fields.join(", ") : "field";

      // Domain-specific message: "one team per owner"
      if (fields.includes("ownerId")) {
        return {
          statusCode: 409,
          message: "This user already has a team (one team per owner).",
          errors: { fields },
        };
      }

      return {
        statusCode: 409,
        message: `A record with this ${joined} already exists`,
        errors: { fields },
      };
    }

    case "P2025":
      return {
        statusCode: 404,
        message: "Record not found",
      };

    case "P2003":
      return {
        statusCode: 400,
        message: "Invalid reference: related record does not exist",
      };

    case "P2014":
      return {
        statusCode: 400,
        message: "The change violates a required relation",
      };

    default:
      return {
        statusCode: 500,
        message: "Database error occurred",
      };
  }
}
