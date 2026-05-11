import { Router } from "express";
import { applyTemplate, getActiveTemplate } from "./templates.controller";

const router = Router();

router.post("/apply", applyTemplate);
router.get("/my-template", getActiveTemplate);

export default router;
