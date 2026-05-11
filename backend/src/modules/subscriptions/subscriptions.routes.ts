import { Router } from "express";
import { addSubscriber, listSubscribers, removeSubscriber } from "./subscriptions.controller";
import { authenticateToken } from "../auth/auth.middleware";
import { authorizeAdmin } from "../auth/admin.middleware";

const router = Router();

router.post("/", addSubscriber); // Public
router.get("/", authenticateToken, authorizeAdmin, listSubscribers);
router.delete("/:id", authenticateToken, authorizeAdmin, removeSubscriber);

export default router;
