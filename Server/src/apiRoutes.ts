import express, { Request, Response } from 'express';
import User from './models/User'; 
import mongoose from 'mongoose';

const router = express.Router();

// const router: Express = express();

// Save a note
router.post('/notes', async (req, res) => {
  const { userId, text, timestamp } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { $push: { notes: { timestamp, text } } },
      { new: true, upsert: true }
    );

    res.status(201).json(user);
  } catch (error) {
    const err = error as any;
    res.status(400).json({ message: err.message });
  }
});



// Save a recording
router.post('/recordings', async (req, res) => {
  const { userId, uri, timestamp } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { $push: { recordings: { timestamp, uri } } },
      { new: true, upsert: true }
    );

    res.status(201).json(user);
  } catch (error) {
    const err = error as any;
    res.status(400).json({ message: err.message });
  }
});

router.get('/notes/latest', async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findOne(
      { userId },
      { notes: { $slice: -1 } } 
    );

    if (user && user.notes && user.notes.length > 0) {
      res.status(200).json(user.notes[0]); // Return the latest note
    } else {
      res.status(404).json({ message: 'No notes found for this user' });
    }
  } catch (error) {
    const err = error as any;
    res.status(400).json({ message: err.message });
  }
});

// Delete a note by ID
router.delete('/notes/:userId/:noteId', async (req, res) => {
  const { userId, noteId } = req.params;

  try {
    // Find the user and remove the note
    const user = await User.findOneAndUpdate(
      { userId },
      { $pull: { notes: { _id: noteId } } },  
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'No notes found for this user' });
    }

    res.status(200).json(user);  
  } catch (error) {
    const err = error as any;
    res.status(400).json({ message: err.message });
  }
});

// Update an existing note
router.put('/notes/:noteId', async (req, res) => {
  const { noteId } = req.params;
  const { userId, text, timestamp } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { 'notes._id': noteId, userId }, // Find the specific note by noteId and userId
      {
        $set: {
          'notes.$.text': text, // Update the text of the note
          'notes.$.timestamp': timestamp, // Optionally, update the timestamp
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'No notes found for this user' });

    }

    // Return the updated notes array
    res.status(200).json(updatedUser);
  } catch (error) {
    const err = error as any;
    res.status(400).json({ message: err.message });
  }
});

export default router;
