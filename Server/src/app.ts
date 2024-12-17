import express, { Express, Request, Response, NextFunction, RequestHandler} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './db';
import { emailService } from './services/emailService';
import { ParsedQs } from 'qs';
import routes from './routes';
import { sendPushNotification } from './services/pushNotificationService'

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();

// Set port
const PORT: number = parseInt(process.env.PORT || '3000', 10);

const expoPushToken = process.env.EXPO_PUSH_TOKEN || ''; 

// setInterval(async () => {
//   const title = 'You are having anxiety attack';
//   const message = 'Please take care';
  
//   await sendPushNotification(expoPushToken, title, message);
// }, 10000); 

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

// Types
interface ApiError extends Error {
  status?: number;
}

interface EmergencyAlertRequest {
  userMessage: string;
  userId?: string;
  userName?: string;
  location?: string;
}

// Custom RequestHandler type that allows for async/await
type AsyncRequestHandler<
  P = {},
  ResBody = {},
  ReqBody = {},
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => Promise<void> | void;

// Logging middleware
const loggingMiddleware: RequestHandler = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers
  });
  next();
};

app.use(loggingMiddleware);

const emergencyAlertHandler: AsyncRequestHandler<{}, any, EmergencyAlertRequest> = async (req, res, next) => {
  try {
    console.log('Received emergency alert request:', req.body);
    
    const { userMessage, userId, userName, location } = req.body;
    
    if (!userMessage) {
      res.status(400).json({ 
        error: 'Missing required field: userMessage'
      });
      return;
    }

    const notification = {
      userMessage,
      timestamp: new Date(),
      userId: userId || 'anonymous',
      userName: userName || 'anonymous',
      location: location || 'unknown'
    };

    console.log('Sending emergency notification:', notification);

    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      res.status(500).json({ 
        error: 'Email service not properly configured' 
      });
      return;
    }

    const emailSent = await emailService.sendEmergencyAlert(notification);
    console.log('Email sending result:', emailSent);

    if (emailSent) {
      res.status(200).json({ 
        message: 'Emergency alert sent successfully',
        timestamp: new Date().toISOString()
      });
      return;
    }

    throw new Error('Failed to send email');

  } catch (error) {
    next(error);
  }
};

app.post('/api/emergency-alert', emergencyAlertHandler);

// Error handler
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({ 
    error: 'Internal server error',
    message: err.message || 'Unknown error occurred'
  });
};

app.use('/api', routes);
app.use(errorHandler);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).send('Route not found');
});


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