import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const clientOptions = { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }, dbName: 'AnxiEase' };

async function connectToDatabase() {
  try {
    const uri = `mongodb+srv://galpolak:${process.env.MONGO_PASSWORD}@anxietyprojectdb.2gqxl.mongodb.net/AnxiEase?retryWrites=true&w=majority&appName=AnxietyProjectDB`;

    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB");

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; 
  }
}

export default connectToDatabase;