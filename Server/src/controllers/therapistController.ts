import { RequestHandler } from 'express';
import { therapistService } from '../services/therapistService';

export const getTherapists: RequestHandler = async (req, res, next) => {
  try {
    const therapists = await therapistService.getAllActiveTherapists();
    res.json({ success: true, therapists });
  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch therapists',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};