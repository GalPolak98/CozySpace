import mongoose, { Schema } from "mongoose";
import { baseModelFields, IBaseModel } from "./BaseModel";


interface IBreathingSession {
  timestamp: string;
  durationSec: number;  // in seconds
  patternType: string;  // e.g., "4-4-4-4"
  completed: boolean;
}

export interface IPatient extends IBaseModel {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      gender: string;
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
        selectedTrackId: string | null;
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
    notifications: [  
      {
        _id: { type: Schema.Types.ObjectId, auto: true }, 
        expoNotificationId: string;  

        notificationTimestamp: Date;
        tapped: boolean;
        anxietyDuration: number;  
        favoriteRelaxationMethod: string;
      }
    ];
    breathingSessions: IBreathingSession[];
  }
  
  const PatientSchema = new Schema({
    ...baseModelFields,
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      gender: { type: String, required: true, enum: ['male', 'female'] }
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
        selectedTrackId: { type: String, default: null }
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
    ],
    notifications: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },  
        expoNotificationId: { type: String, required: true },  

        notificationTimestamp: { type: Date, required: false },
        tapped: { type: Boolean, required: false },
        anxietyDuration: { type: Number, required: false },
        favoriteRelaxationMethod: { type: String, required: false },
      }
    ],
    breathingSessions: [{
      timestamp: { type: String, required: true },
      durationSec: { type: Number, required: true },
      patternType: { type: String, required: true },
      completed: { type: Boolean, default: true }
    }]
  });
  
  export const PatientModel = mongoose.model<IPatient>('Patient', PatientSchema);
