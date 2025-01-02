import { RequestHandler } from 'express';
import { therapistService } from '../services/therapistService';

export const getTherapists: RequestHandler = async (req, res, next) => {
  try {
    const therapists = await therapistService.getAllActiveTherapists();
    res.json({ success: true, therapists });
    console.log(JSON.stringify(therapists, null, 2));
  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch therapists',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};



export const getPatients: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Call the userService to get the notes for the user
    const patients = await therapistService.getPatientsForTherapist(userId);

    if (!patients) {
      res.status(404).json({ error: 'No patients found for this therapist' });
      return;
    }

    res.status(200).json({ success: true, patients });
  } catch (error) {
    return next(error);
  }
};