import { appConfig } from "../../config/appConfig";
import { HttpContext } from "../controllers/team.types";

// Helper to validate teamId parameter
export function getValidTeamId(http: HttpContext): number | null {
  const teamId = Number(http.req.params.teamId);

  if (!Number.isFinite(teamId)) {
    http.res.status(400).json({
      success: false,
      message: "Invalid teamId",
    });
    return null;
  }

  return teamId;
}

// Helper to validate baseUrl configuration
export function getBaseUrl(http: HttpContext): string | null {
  const baseUrl = appConfig.app.url;

  if (!baseUrl) {
    http.res.status(500).json({
      success: false,
      message: "Missing PUBLIC_BASE_URL configuration",
    });
    return null;
  }

  return baseUrl;
}
