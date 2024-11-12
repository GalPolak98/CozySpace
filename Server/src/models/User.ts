import mongoose, { Schema, Document } from 'mongoose';

interface INote {
  timestamp: string;
  text: string;
}

interface IRecording {
  timestamp: string;
  uri: string;
}

interface IDirectNote {
  timestamp: string;
  description: string;
  trigger?: string;
  copingStrategies?: string;
  physicalSymptoms?: string;
  emotionalState?: string;
  selfTalk?: string;
}

interface IUser extends Document {
  userId: string;
  notes: INote[];
  recordings: IRecording[];
  directNotes: IDirectNote[];  // Add directNotes here
}

const userSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  notes: [
    {
      timestamp: { type: String, required: true },
      text: { type: String, required: true },
    },
  ],
  recordings: [
    {
      timestamp: { type: String, required: true },
      uri: { type: String, required: true },
    },
  ],
  directNotes: [
    {
      timestamp: { type: String, required: true },
      description: { type: String, required: true },
      trigger: { type: String },
      copingStrategies: { type: String },
      physicalSymptoms: { type: String },
      emotionalState: { type: String },
      selfTalk: { type: String },
    },
  ],
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
