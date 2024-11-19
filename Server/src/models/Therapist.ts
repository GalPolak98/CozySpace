import mongoose, { Document, Schema } from 'mongoose';

interface ITherapist extends Document {
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string | null;
  };
  professionalInfo: {
    educationLevel: string;
    experienceLevel: string;
    workplace: string;
    specialization: string;
    licenseNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TherapistSchema = new Schema<ITherapist>({
  userId: { type: String, required: true, unique: true },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, default: null },
  },
  professionalInfo: {
    educationLevel: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    workplace: { type: String, required: true },
    specialization: { type: String, required: true },
    licenseNumber: { type: String, required: true },
  },
}, {
  timestamps: true
});

export const TherapistModel = mongoose.model<ITherapist>('Therapist', TherapistSchema);
export type { ITherapist };