import mongoose, { Schema, Document } from 'mongoose';

interface INote {
  timestamp: string;
  text: string;
}

interface IRecording {
  timestamp: string;
  uri: string;
}

interface IUser extends Document {
  userId: string;
  notes: INote[];
  recordings: IRecording[];
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
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
