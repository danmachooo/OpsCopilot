import { startCronJobs } from "./jobs/cron";
import Logger from "./utils/logger";

/**
 * Automatically starts the cron worker and handles basic
 * process events for reliability.
 */
(async function initializeWorker() {
  try {
    Logger.info("pr-daemon cron worker starting...");

    // Initialize your jobs
    await startCronJobs();

    Logger.info("pr-daemon cron worker is running");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    Logger.error(`Failed to start worker: ${message}`);
    process.exit(1);
  }

  // Handle graceful shutdown like when stopping the server
  process.on("SIGTERM", () => {
    Logger.info("Stopping cron worker...");
    process.exit(0);
  });
})();
