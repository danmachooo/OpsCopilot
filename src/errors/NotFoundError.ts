import { AppError } from "./AppError";

/**
 * Error representing a missing resource.
 *
 * Thrown when a requested entity cannot be found
 * or does not exist in the system.
 *
 * Maps to HTTP status code 404 (Not Found).
 *
 * Common use cases:
 * - Requested record does not exist
 * - Resource was deleted or never created
 * - Invalid identifier referencing no entity
 *
 * Example:
 * ```ts
 * throw new NotFoundError("Team not found");
 * ```
 */
export class NotFoundError extends AppError {
  /**
   * Creates a new NotFoundError.
   *
   * @param message - Optional custom error message.
   *                  Defaults to "Resource not found".
   */
  constructor(message: string = "Resource not found") {
    super(404, message);
  }
}
