import express from 'express';
import { registerUser, getUserProfile, updatePatientTherapist, saveGuidedNotes, addNote,updateNote, saveRecording, getNotes, deleteNote, updateUserPreferences, saveBreathingSession, getBreathingSessions} from '../controllers/userController';

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
router.get('/:userId/getRecordings', getRecordings);


router.put('/:patientId/therapist', updatePatientTherapist);

router.post('/:userId/breathingSessions', saveBreathingSession);
router.get('/:userId/breathingSessions', getBreathingSessions);


router.post('/:userId/notifications', saveNotification);
router.get('/:userId/notifications', getNotification);

router.patch('/:userId/notifications/:expoNotificationId', updateNotificationTappedStatus);
export default router;