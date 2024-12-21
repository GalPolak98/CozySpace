import express from 'express';
import userRoutes from './userRoutes';
import therapistRoutes from './therapistRoutes';
import sensorRoutes from './sensorRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/therapists', therapistRoutes);
router.use('/sensors', sensorRoutes); 

export default router;