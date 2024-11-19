import mongoose, { Schema } from "mongoose";
import { baseModelFields, IBaseModel } from "./BaseModel";

export interface IPatient extends IBaseModel {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
    };
    therapistInfo: {
      selectedTherapistId: string | null;
      dataSharing: {
        anxietyTracking: boolean;
        personalDocumentation: boolean;
      };
    };
    toolsPreferences: {
      smartJewelry: {
        enabled: boolean;
        vibrationAlerts: boolean;
      };
      musicTherapy: {
        enabled: boolean;
        selectedMusicType: string | null;
      };
    };
}

const PatientSchema = new Schema({
    ...baseModelFields,
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true }
    },
    therapistInfo: {
      selectedTherapistId: { type: String, default: null },
      dataSharing: {
        anxietyTracking: { type: Boolean, default: false },
        personalDocumentation: { type: Boolean, default: false }
      }
    },
    toolsPreferences: {
      smartJewelry: {
        enabled: { type: Boolean, default: false },
        vibrationAlerts: { type: Boolean, default: false }
      },
      musicTherapy: {
        enabled: { type: Boolean, default: false },
        selectedMusicType: { type: String, default: null }
      }
    }
});

export const PatientModel = mongoose.model<IPatient>('Patient', PatientSchema);