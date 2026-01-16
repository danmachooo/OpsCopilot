// scripts/test-github-webhook.ts
import crypto from "crypto";

type GithubEvent = "pull_request" | "pull_request_review";

function getEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function signSha256(secret: string, rawBody: Buffer): string {
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return `sha256=${hmac}`;
}

async function main() {
  // ===== CONFIG =====
  const WEBHOOK_URL = getEnv(
    "WEBHOOK_URL",
    "http://localhost:3000/api/webhooks/github"
  );
  const GITHUB_WEBHOOK_SECRET = getEnv("GITHUB_WEBHOOK_SECRET"); // plaintext secret
  const REPO_ID = Number(getEnv("REPO_ID", "123456"));
  const EVENT =
    (process.env.EVENT as GithubEvent | undefined) ?? "pull_request";

  if (!Number.isFinite(REPO_ID)) throw new Error("REPO_ID must be a number");

  // ===== PAYLOAD =====
  const payload =
    EVENT === "pull_request_review"
      ? {
          action: "submitted",
          repository: {
            id: REPO_ID,
            name: "demo-repo",
            full_name: "org/demo-repo",
          },
          pull_request: {
            id: 999,
            number: 1,
            title: "Test PR review event",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            closed_at: null,
            requested_reviewers: [],
          },
          review: {
            id: 555,
            state: "approved",
            submitted_at: new Date().toISOString(),
          },
        }
      : {
          action: "opened",
          repository: {
            id: REPO_ID,
            name: "demo-repo",
            full_name: "org/demo-repo",
          },
          pull_request: {
            id: 999,
            number: 1,
            title: "Test PR event",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            closed_at: null,
            requested_reviewers: [],
          },
        };

  const rawBody = Buffer.from(JSON.stringify(payload), "utf8");
  const signature256 = signSha256(GITHUB_WEBHOOK_SECRET, rawBody);

  console.log("Sending to:", WEBHOOK_URL);
  console.log("Event:", EVENT);
  console.log("Repo ID:", REPO_ID);
  console.log("Signature:", signature256);

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-github-event": EVENT,
      "x-hub-signature-256": signature256,
      "x-github-delivery": crypto.randomUUID(),
    },
    body: rawBody,
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
