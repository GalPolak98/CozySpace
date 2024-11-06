import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './db';
import routes from './apiRoutes';

dotenv.config();

const app: Express = express();

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1);
  });

export default app;
