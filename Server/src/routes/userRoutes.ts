import express from 'express';
import { registerUser, getUserProfile, saveNotification, getGuidedNotes, updateNotificationTappedStatus, updatePatientTherapist, saveGuidedNotes, addNote,updateNote, saveRecording, getNotes, deleteNote, updateUserPreferences} from '../controllers/userController';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.post('/register', registerUser);

router.put('/:userId/preferences', updateUserPreferences);

router.post('/:userId/saveGuidedNotes', saveGuidedNotes);

router.post('/:userId/addNotes', addNote);
router.get('/:userId/latest', getNotes);
router.delete('/:userId/:noteId', deleteNote);
router.put('/:userId/:noteId', updateNote);

router.post('/:userId/saveRecording', saveRecording);
router.put('/:patientId/therapist', updatePatientTherapist);

router.get('/:userId/guidedNotes', getGuidedNotes);


router.post('/:userId/notifications', saveNotification);
router.patch('/:userId/notifications/:expoNotificationId', updateNotificationTappedStatus);
export default router;