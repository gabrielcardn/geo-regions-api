import { Router } from 'express';
import RegionController from '../controllers/Region.controller.js';

// Express router for /regions endpoint
// Maps HTTP methods to controller methods, including CRUD and geospatial queries
const router = Router();

// Collection routes
router.route('/')
  .get(RegionController.findAll)
  .post(RegionController.create);

// Geospatial query routes (defined before '/:id' to avoid conflicts)
router.get('/contains-point', RegionController.findContainingPoint);
router.get('/near-point', RegionController.findNearPoint);
router.get('/by-address', RegionController.findByAddress);

// Specific region by ID routes
router.route('/:id')
  .get(RegionController.findById)
  .put(RegionController.update)
  .delete(RegionController.delete);

export default router;
