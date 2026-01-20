import { Router } from "express";
import {
  createTeam,
  getMyTeam,
  onboardTeam,
  createTeamGithubWebhook,
  updateConfigs,
  updateTeamSlackWebhook,
  updateTeam,
} from "../controllers/team.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.use(requireAuth);
router.post("/onboard", onboardTeam);

router.get("/me", getMyTeam);
router.post("/", createTeam);

router.patch("/:teamId", updateTeam);
router.patch("/:teamId/configs", updateConfigs);
router.patch("/:teamId/slack", updateTeamSlackWebhook);
router.post("/:teamId/github/webhook", createTeamGithubWebhook);

export default router;
