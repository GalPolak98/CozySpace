import mongoose, { Schema, Document } from 'mongoose';

interface INote extends Document {
  userId: string;
  text: string;
  timestamp: string;
}

const noteSchema: Schema = new Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
