import { Router } from "express";
import { register, login } from "./auth.controller";
import { RegisterDto, LoginDto } from "./auth.dto";
import { validateBody } from "../../middleware/validate.middleware";

const router = Router();

router.post("/register", validateBody(RegisterDto), register);
router.post("/login", validateBody(LoginDto), login);

export default router;
