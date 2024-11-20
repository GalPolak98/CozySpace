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
    guidedNotes: [
      {
        anxietyRating: number;
        description: string;
        trigger: string;
        copingStrategies: string;
        physicalSymptoms: string;
        emotionalState: string;
        selfTalk: string;
        timestamp: string;
      }
    ];
    notes: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true }, 
        content: string;
        timestamp: string;
      }
    ];
    recordings: [
      {
        uri: string;
        timestamp: string;
      }
    ];
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
    },
    guidedNotes: [
      {
        anxietyRating: { type: Number, required: false },
        description: { type: String, required: false },
        trigger: { type: String, required: false },
        copingStrategies: { type: String, required: false },
        physicalSymptoms: { type: String, required: false },
        emotionalState: { type: String, required: false },
        selfTalk: { type: String, required: false },
        timestamp: { type: String, required: false }
      }
    ],
    notes: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true }, 

        content: { type: String, required: false },
        timestamp: { type: String, required: false }
      }
    ],
    recordings: [
      {
        uri: { type: String, required: true },
        timestamp: { type: String, required: true },
      }
    ]
  });
  
  export const PatientModel = mongoose.model<IPatient>('Patient', PatientSchema);