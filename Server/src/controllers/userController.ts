import { Request, Response, RequestHandler } from 'express';
import UserModel from '../models/User';
import type { IUser } from '../models/User';

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findOne({ userId });
    
    if (!user) {
      res.status(404).json({ 
        error: 'User not found',
        message: 'User does not exist in the database' 
      });
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

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData.userId) {
      res.status(400).json({
        error: 'Missing userId',
        message: 'User ID is required for registration'
      });
      return;
    }

    // Clean up data based on user type
    if (userData.userType === 'therapist') {
      delete userData.patientInfo;
    } else if (userData.userType === 'patient') {
      delete userData.professionalInfo;
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ userId: userData.userId });
    if (existingUser) {
      // Update existing user
      const updatedUser = await UserModel.findOneAndUpdate(
        { userId: userData.userId },
        userData,
        { new: true, runValidators: true }
      );
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
      return;
    }

    // Create new user
    const newUser = new UserModel(userData);
    await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to register user',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};