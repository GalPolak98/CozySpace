import mongoose, { Document, Schema } from 'mongoose';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string | null;
}

interface ProfessionalInfo {
  educationLevel: string;
  experienceLevel: string;
  workplace: string;
  specialization: string;
  licenseNumber: string;
}

interface DataSharing {
  anxietyTracking: boolean;
  personalDocumentation: boolean;
}

interface TherapistInfo {
  selectedTherapistId: string | null;
  shareWithTherapist: boolean;
  dataSharing: DataSharing;
}

interface SmartJewelry {
  enabled: boolean;
  vibrationAlerts: boolean;
}

interface MusicTherapy {
  enabled: boolean;
  selectedMusicType: string | null;
}

interface ToolsPreferences {
  smartJewelry: SmartJewelry;
  musicTherapy: MusicTherapy;
}

interface PatientInfo {
  therapistInfo: TherapistInfo;
  toolsPreferences: ToolsPreferences;
}

interface IUser extends Document {
  userId: string;
  timestamp: Date;
  userType: 'patient' | 'therapist';
  personalInfo: PersonalInfo;
  professionalInfo?: ProfessionalInfo;
  patientInfo?: PatientInfo;
  notes: typeof NoteSchema[];
  directNotes: typeof DirectedNoteSchema[];
}

const NoteSchema = new Schema({
  timestamp: { type: Date, required: true },
  text: { type: String, required: true },
});

const DirectedNoteSchema = new Schema({
  timestamp: { type: Date, required: true },
  anxietyRating: { type: String },
  description: { type: String, required: true },
  trigger: { type: String },
  copingStrategies: { type: String },
  physicalSymptoms: { type: String },
  emotionalState: { type: String },
  selfTalk: { type: String },
});

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  userType: { type: String, required: true, enum: ['patient', 'therapist'] },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, default: null },
  },
  professionalInfo: {
    educationLevel: String,
    experienceLevel: String,
    workplace: String,
    specialization: String,
    licenseNumber: String,
  },
  patientInfo: {
    therapistInfo: {
      selectedTherapistId: { type: String, default: null },
      shareWithTherapist: { type: Boolean, default: false },
      dataSharing: {
        anxietyTracking: { type: Boolean, default: false },
        personalDocumentation: { type: Boolean, default: false },
      },
    },
    toolsPreferences: {
      smartJewelry: {
        enabled: { type: Boolean, default: false },
        vibrationAlerts: { type: Boolean, default: false },
      },
      musicTherapy: {
        enabled: { type: Boolean, default: false },
        selectedMusicType: { type: String, default: null },
      },
    },
  },
  notes: [NoteSchema],
  directNotes: [DirectedNoteSchema],
}, {
  collection: 'users'
});

export default mongoose.model<IUser>('User', UserSchema);
