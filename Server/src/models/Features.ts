import mongoose, { Schema } from "mongoose";

export interface IFeatures {
    chat: boolean;
    guidedNote: boolean;
    directNote: boolean;
    breathingExercises: boolean;
    anxietyDataViewer: boolean;
    recordings: boolean;
    updatedAt: Date;
  }
  
  const FeaturesSchema = new Schema({
    chat: { type: Boolean, default: true },
    guidedNote: { type: Boolean, default: true },
    directNote: { type: Boolean, default: true },
    breathingExercises: { type: Boolean, default: true },
    anxietyDataViewer: { type: Boolean, default: true },
    recordings: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
  });

export const FeaturesModel = mongoose.model<IFeatures>('Features', FeaturesSchema);

export const initializeFeatures = async () => {
    const features = await FeaturesModel.findOne();
    if (!features) {
      await FeaturesModel.create({});
    }
  };