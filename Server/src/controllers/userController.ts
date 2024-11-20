import { RequestHandler } from 'express';
import { userService } from '../services/userService';

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.params.userId);
    if (!profile) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updatePatientTherapist: RequestHandler = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { therapistId } = req.body;
    
    const updatedPatient = await userService.updatePatientTherapist(patientId, therapistId);
    res.json({ success: true, patient: updatedPatient });
  } catch (error) {
    next(error);
  }
};