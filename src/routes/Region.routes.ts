import { Router } from "express";
import RegionController from "../controllers/Region.controller";

const router = Router();

router.get("/", RegionController.findAll);
router.get("/contains-point", RegionController.findContainingPoint);
router.get("/near-point", RegionController.findNearPoint);
router.get("/by-address", RegionController.findByAddress);

router.get("/:id", RegionController.findById);

router.post("/", RegionController.create);

export default router;
