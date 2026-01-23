import { AppError } from "./AppError";

/**
 * Error representing a client-side validation failure.
 *
 * Thrown when input data fails validation rules
 * such as schema checks, required fields, or
 * format constraints.
 *
 * Maps to HTTP status code 400 (Bad Request).
 *
 * Common use cases:
 * - Invalid request payload
 * - Failed Zod schema validation
 * - Malformed query or path parameters
 *
 * Example:
 * ```ts
 * throw new ValidationError("Email is required");
 * ```
 */
export class ValidationError extends AppError {
  /**
   * Creates a new ValidationError.
   *
   * @param message - Optional custom error message.
   *                  Defaults to "Validation failed".
   */
  constructor(message: string = "Validation failed") {
    super(400, message);
  }
}
