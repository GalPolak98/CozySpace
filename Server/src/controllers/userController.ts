import { RequestHandler } from 'express';
import { userService } from '../services/userService';

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ success: true, user });
    return next();
  } catch (error) {
    return next(error);
  }
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.params.userId);
    if (!profile) {
      res.status(404).json({ error: 'User not found' });
      return next();
    }
    res.json(profile);
    return next();
  } catch (error) {
    return next(error);
  }
};