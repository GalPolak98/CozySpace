import { Request, Response, RequestHandler } from 'express';
import User from '../models/User';

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const userData = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId: userData.userId });
    if (existingUser) {
      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { userId: userData.userId },
        userData,
        { new: true }
      );
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } else {
      // Create new user
      const newUser = new User(userData);
      await newUser.save();
      res.status(201).json({
        message: 'User registered successfully',
        user: newUser
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to register user',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};