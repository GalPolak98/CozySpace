// routes/sensorRoutes.ts
import express from 'express';
import { startSimulation, stopSimulation } from '../controllers/sensorController';

const router = express.Router();

router.post('/sensor/start', startSimulation);
router.post('/sensor/stop', stopSimulation);

export default router;