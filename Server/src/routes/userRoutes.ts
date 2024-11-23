import express from 'express';
import { registerUser, getUserProfile, updatePatientTherapist, saveGuidedNotes, addNote,updateNote, saveRecording, getNotes, deleteNote} from '../controllers/userController';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.post('/register', registerUser);
router.post('/:userId/saveGuidedNotes', saveGuidedNotes);

router.post('/:userId/addNotes', addNote);
router.get('/:userId/latest', getNotes);
router.delete('/:userId/:noteId', deleteNote);
router.put('/:userId/:noteId', updateNote);

router.post('/:userId/saveRecording', saveRecording);
router.put('/:patientId/therapist', updatePatientTherapist);

export default router;