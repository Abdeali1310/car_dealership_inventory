import { Router } from "express";
import { register } from "./auth.controller";
import { RegisterDto } from "./auth.dto";
import { validateBody } from "../../middleware/validate.middleware";

const router = Router();

router.post("/register", validateBody(RegisterDto), register);

export default router;
