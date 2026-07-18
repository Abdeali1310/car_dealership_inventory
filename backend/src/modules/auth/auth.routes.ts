import { Router } from "express";
import { register, login, me } from "./auth.controller";
import { RegisterDto, LoginDto } from "./auth.dto";
import { validateBody } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", validateBody(RegisterDto), register);
router.post("/login", validateBody(LoginDto), login);
router.get("/me", requireAuth, me);

export default router;
