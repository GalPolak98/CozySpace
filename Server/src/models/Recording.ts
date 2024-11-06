import mongoose, { Schema, Document } from 'mongoose';

interface IRecording extends Document {
  userId: string;
  uri: string;
  timestamp: string;
}

const recordingSchema: Schema = new Schema({
  userId: { type: String, required: true },
  uri: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const Recording = mongoose.model<IRecording>('Recording', recordingSchema);

export default Recording;
