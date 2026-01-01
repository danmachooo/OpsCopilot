import cron from "node-cron";
import { findStalePullRequests } from "../services/stalePr.service";
import {
  alertOnStalePRs,
  alertOnUnreviewedPRs,
} from "../services/alert.service";
import { findUnreviewedPullRequests } from "../services/unreviewedPr.service";

export function startCronJobs() {
  // ----- Stale PRs -----
  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("⏰ Checking for stale PRs...");

      const stalePRs = await findStalePullRequests();

      console.log(`⚠️ Found ${stalePRs.length} stale PR(s)`);

      for (const pr of stalePRs) {
        const repoName = pr.repository?.name ?? "Unknown repo";
        if (pr.staleAlertAt) {
          console.log(
            `Alert already sent for PR #${pr.prNumber} in ${repoName}`
          );
          continue;
        }
        console.log(`PR #${pr.prNumber} in ${repoName} is stale`);
      }

      await alertOnStalePRs(stalePRs);
    } catch (err) {
      console.error("[ERROR] Stale PR cron failed:", err);
    }
  });

  // ----- Unreviewed PRs -----
  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("⏰ Checking unreviewed PRs...");

      const prs = await findUnreviewedPullRequests();

      console.log(`⚠️ Found ${prs.length} unreviewed PR(s)`);

      for (const pr of prs) {
        const repoName = pr.repository?.name ?? "Unknown repo";
        console.log(`Unreviewed PR #${pr.prNumber} in ${repoName}`);
      }

      await alertOnUnreviewedPRs(prs);
    } catch (err) {
      console.error("[ERROR] Unreviewed PR cron failed:", err);
    }
  });
}
