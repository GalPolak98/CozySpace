import express from 'express';
import { registerUser, getUserProfile, saveGuidedNotes, addNote,updateNote, saveRecording, updateNotificationTappedStatus,getNotes,saveNotification, deleteNote} from '../controllers/userController';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.post('/register', registerUser);
router.post('/:userId/saveGuidedNotes', saveGuidedNotes);

router.post('/:userId/addNotes', addNote);
router.get('/:userId/latest', getNotes);
router.delete('/:userId/:noteId', deleteNote);
router.put('/:userId/:noteId', updateNote);

router.post('/:userId/saveRecording', saveRecording);

router.post('/:userId/notifications', saveNotification);
router.patch('/:userId/notifications/:expoNotificationId', updateNotificationTappedStatus);
export default router;