import { AppError } from "./AppError";

/**
 * Error representing an authentication failure.
 *
 * Thrown when a request lacks valid authentication
 * credentials or when authentication cannot be verified.
 *
 * Maps to HTTP status code 401 (Unauthorized).
 *
 * IMPORTANT:
 * - 401 indicates *who you are* is unknown or invalid
 * - This is distinct from 403 (Forbidden), which means
 *   the user is authenticated but not allowed to act
 *
 * Common use cases:
 * - Missing or invalid auth token
 * - Expired session
 * - Invalid OAuth credentials
 *
 * Example:
 * ```ts
 * throw new UnauthorizedError("Invalid or expired token");
 * ```
 */
export class UnauthorizedError extends AppError {
  /**
   * Creates a new UnauthorizedError.
   *
   * @param message - Optional custom error message.
   *                  Defaults to "Unauthorized".
   */
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}
