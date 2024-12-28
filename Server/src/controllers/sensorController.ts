import { RequestHandler } from 'express';
import sensorService from '../services/sensorService';
import { SensorConfig } from '../models/sensorTypes';

export const startSimulation: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const config: SensorConfig = {
      userId,
      isActive: true,
      samplingRate: req.body.samplingRate || 1000,
      simulationDuration: req.body.simulationDuration
    };

    sensorService.startSimulation(config);
    res.status(200).json({ success: true, message: 'Sensor simulation started', userId });
  } catch (error) {
    next(error);
  }
};

export const stopSimulation: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    sensorService.stopSimulation(userId);
    res.status(200).json({ success: true, message: 'Sensor simulation stopped', userId });
  } catch (error) {
    next(error);
  }
};