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

// Separate interfaces for different user types
interface IBaseUser {
  userId: string;
  timestamp: Date;
  userType: 'patient' | 'therapist';
  personalInfo: PersonalInfo;
}

interface IPatientUser extends IBaseUser {
  userType: 'patient';
  patientInfo: PatientInfo;
  professionalInfo?: never;
}

interface ITherapistUser extends IBaseUser {
  userType: 'therapist';
  professionalInfo: ProfessionalInfo;
  patientInfo?: never;
}

export type IUser = (IPatientUser | ITherapistUser) & Document;

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
    type: {
      educationLevel: String,
      experienceLevel: String,
      workplace: String,
      specialization: String,
      licenseNumber: String,
    },
    required: function(this: IUser) {
      return this.userType === 'therapist';
    },
  },
  patientInfo: {
    type: {
      therapistInfo: {
        selectedTherapistId: { type: String, default: null },
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
    required: function(this: IUser) {
      return this.userType === 'patient';
    },
  },
}, {
  collection: 'users',
});

UserSchema.pre('save', function(next) {
  if (this.userType === 'therapist') {
    this.set('patientInfo', undefined);
  } else if (this.userType === 'patient') {
    this.set('professionalInfo', undefined);
  }
  next();
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;