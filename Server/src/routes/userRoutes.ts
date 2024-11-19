import express from 'express';
import { 
  registerUser, 
  getUserProfile, 
  updatePatientTherapist 
} from '../controllers/userController';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.post('/register', registerUser);
router.put('/:patientId/therapist', updatePatientTherapist);

export default router;