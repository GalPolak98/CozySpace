import express from 'express';
import userRoutes from './userRoutes';
import therapistRoutes from './therapistRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/therapists', therapistRoutes);

export default router;