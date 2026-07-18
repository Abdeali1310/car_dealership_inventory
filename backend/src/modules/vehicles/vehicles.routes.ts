import { Router } from "express";
import { create } from "./vehicles.controller";
import { CreateVehicleDto } from "./vehicles.dto";
import { validateBody } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), validateBody(CreateVehicleDto), create);

export default router;
