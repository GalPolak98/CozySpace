import { RequestHandler } from 'express';
import { featuresService } from '../services/featuresService';

export const getFeatures: RequestHandler = async (req, res, next) => {
  try {
    const features = await featuresService.getFeatures();
    res.json(features);
  } catch (error) {
    next(error);
  }
};

export const updateFeatures: RequestHandler = async (req, res, next) => {
  try {
    const features = await featuresService.updateFeatures(req.body);
    res.json(features);
  } catch (error) {
    next(error);
  }
};