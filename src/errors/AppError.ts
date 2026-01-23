/**
 * Base application error class.
 *
 * Used to represent *expected, operational errors* that occur
 * during normal application execution (e.g. validation failures,
 * authentication errors, missing resources).
 *
 * This class distinguishes between:
 * - Operational errors (safe to expose to clients)
 * - Programmer errors (bugs, crashes, invariant violations)
 *
 * Typical usage:
 * ```ts
 * throw new AppError(404, "Resource not found");
 * throw new AppError(401, "Unauthorized");
 * ```
 */
export class AppError extends Error {
  /**
   * Creates a new application error.
   *
   * @param statusCode - HTTP status code associated with the error.
   * @param message - Human-readable error message.
   * @param isOperational - Indicates whether this error is expected
   *                        and safe to handle gracefully.
   *                        Defaults to `true`.
   */
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
  ) {
    super(message);

    // Set the error name to the class name
    this.name = this.constructor.name;

    // Exclude constructor from stack trace for cleaner output
    Error.captureStackTrace(this, this.constructor);
  }
}
