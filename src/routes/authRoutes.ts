import { Router } from "express";
import { signUp, login } from "../controllers/authController";
import { log } from "node:console";

const router = Router();

router.post("/signup",signUp);
router.post("/login",login);

export default router;