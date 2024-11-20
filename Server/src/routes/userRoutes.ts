import express from 'express';
import { registerUser, getUserProfile, saveGuidedNotes, addNote,updateNote, getNotes, deleteNote} from '../controllers/userController';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.post('/register', registerUser);
router.post('/:userId/saveGuidedNotes', saveGuidedNotes);

router.post('/:userId/addNotes', addNote);
router.get('/:userId/latest', getNotes);
router.delete('/:userId/:noteId', deleteNote);
router.put('/:userId/:noteId', updateNote);

export default router;