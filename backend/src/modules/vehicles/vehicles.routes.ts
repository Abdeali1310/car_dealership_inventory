import { Router } from "express";
import { create, getAll, search, update, remove, purchase, restock, uploadImage } from "./vehicles.controller";
import { CreateVehicleDto, UpdateVehicleDto, RestockVehicleDto } from "./vehicles.dto";
import { validateBody } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import path from "path";
import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), validateBody(CreateVehicleDto), create);
router.get("/search", requireAuth, search);
router.get("/", getAll);
router.post("/upload", requireAuth, requireRole("ADMIN"), upload.single("file"), uploadImage);
router.put("/:id", requireAuth, requireRole("ADMIN"), validateBody(UpdateVehicleDto), update);
router.delete("/:id", requireAuth, requireRole("ADMIN"), remove);
router.post("/:id/purchase", requireAuth, purchase);
router.post("/:id/restock", requireAuth, requireRole("ADMIN"), validateBody(RestockVehicleDto), restock);

export default router;
// Trigger hot-reload
