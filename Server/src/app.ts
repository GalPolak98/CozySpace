import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './db';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();

// Set port
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
connectToDatabase()
  .then(() => {
    // Start the server only after successfully connecting to the database
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1);
  });

export default app;