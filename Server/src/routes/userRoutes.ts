import express from 'express';
import { registerUser, getUserProfile } from '../controllers/userController';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.post('/register', registerUser);

export default router;