import { Router } from "express";
import { submitContact, listContacts, removeContact } from "./contacts.controller";
import { authenticateToken } from "../auth/auth.middleware";
import { authorizeAdmin } from "../auth/admin.middleware";

const router = Router();

router.post("/", submitContact); // Public
router.get("/", authenticateToken, authorizeAdmin, listContacts);
router.delete("/:id", authenticateToken, authorizeAdmin, removeContact);

export default router;
