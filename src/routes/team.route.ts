import { Router } from "express";
import {
  createTeam,
  getMyTeam,
  provisionGithub,
  updateConfigs,
  updateSlack,
  updateTeam,
} from "../controllers/team.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/me", getMyTeam);
router.post("/", createTeam);

router.patch("/:teamId", updateTeam);
router.patch("/:teamId/configs", updateConfigs);
router.patch("/:teamId/slack", updateSlack);
router.post("/:teamId/github/webhook", provisionGithub);

export default router;
