import { AppError } from "./AppError";

/**
 * Error representing a forbidden action.
 *
 * Thrown when an authenticated user attempts to perform
 * an action they do not have permission to execute.
 *
 * Maps to HTTP status code 403 (Forbidden).
 *
 * Common use cases:
 * - Insufficient role or permissions
 * - Accessing resources owned by another user or team
 * - Violating authorization rules
 *
 * Example:
 * ```ts
 * throw new ForbiddenError("You do not have access to this resource");
 * ```
 */
export class ForbiddenError extends AppError {
  /**
   * Creates a new ForbiddenError.
   *
   * @param message - Optional custom error message.
   *                  Defaults to "Forbidden".
   */
  constructor(message: string = "Forbidden") {
    super(403, message);
  }
}
