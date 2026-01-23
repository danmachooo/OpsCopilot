import winston from "winston";

/**
 * Custom log levels used across the application.
 *
 * Lower numbers indicate higher priority.
 *
 * Levels:
 * - error: Critical failures requiring immediate attention
 * - warn: Non-fatal issues or unexpected states
 * - info: General application lifecycle events
 * - http: HTTP request/response logging
 * - debug: Verbose debugging information (development only)
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Console color mapping for log levels.
 *
 * Colors are applied only to console output
 * and do not affect file-based logs.
 */
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Register custom colors with Winston
winston.addColors(colors);

/**
 * Shared log format configuration.
 *
 * Includes:
 * - Timestamp (YYYY-MM-DD HH:mm:ss:ms)
 * - Colorized log level (console only)
 * - Pretty-printed metadata (if present)
 *
 * Metadata is extracted from all properties
 * except `timestamp`, `level`, and `message`.
 */
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...metadata } = info;

    const metaString = Object.keys(metadata).length
      ? `\n${JSON.stringify(metadata, null, 2)}`
      : "";

    return `${timestamp} ${level}: ${message}${metaString}`;
  }),
);

/**
 * Winston transports configuration.
 *
 * Transports:
 * - Console: All logs (colorized)
 * - File (logs/error.log): Error-level logs only
 * - File (logs/all.log): All logs regardless of level
 *
 * NOTE:
 * - Ensure the `logs/` directory exists in production.
 * - File logs are uncolorized for easier parsing.
 */
const transports = [
  new winston.transports.Console(),

  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),

  new winston.transports.File({
    filename: "logs/all.log",
  }),
];

/**
 * Application-wide Winston logger instance.
 *
 * Log level behavior:
 * - development: debug and above
 * - production: info and above
 *
 * Intended usage:
 * ```ts
 * Logger.info("Server started", { port: 3000 });
 * Logger.error("Database connection failed", { error });
 * ```
 */
const Logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  levels,
  format,
  transports,
});

export default Logger;
