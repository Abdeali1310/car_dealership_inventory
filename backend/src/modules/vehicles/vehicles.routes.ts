import { Router } from "express";
import { create, getAll, search, update, remove, purchase, restock } from "./vehicles.controller";
import { CreateVehicleDto, UpdateVehicleDto, RestockVehicleDto } from "./vehicles.dto";
import { validateBody } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), validateBody(CreateVehicleDto), create);
router.get("/search", requireAuth, search);
router.get("/", getAll);
router.put("/:id", requireAuth, requireRole("ADMIN"), validateBody(UpdateVehicleDto), update);
router.delete("/:id", requireAuth, requireRole("ADMIN"), remove);
router.post("/:id/purchase", requireAuth, purchase);
router.post("/:id/restock", requireAuth, requireRole("ADMIN"), validateBody(RestockVehicleDto), restock);

export default router;
