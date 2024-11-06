import express from 'express';
import User from './models/User'; 

const router = express.Router();

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

export default router;
