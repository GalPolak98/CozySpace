import express from 'express';
import { getTherapists, getPatients } from '../controllers/therapistController';

const router = express.Router();

router.get('/', getTherapists);

router.get('/:userId/patients', getPatients);


export default router;