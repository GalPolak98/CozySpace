import express, { Express, Request, Response, NextFunction, RequestHandler} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './db';
import { emailService } from './services/emailService';
import { ParsedQs } from 'qs';
import routes from './routes';
import WebSocket ,{ WebSocketServer } from 'ws';
import { createServer, Server } from 'http';
import sensorService from './services/sensorService';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
let server: Server;
let wss: WebSocketServer;

// Set port
const PORT: number = parseInt(process.env.PORT || '3000', 10);

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

const initializeWebSocket = () => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'register' && data.userId) {
          console.log(`Registering WebSocket for user: ${data.userId}`);
          sensorService.registerWebSocket(data.userId, ws);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

// Cleanup function
const cleanup = async () => {
  console.log('Starting server cleanup...');

  // Cleanup sensor service first
  sensorService.cleanup();

  // Close all WebSocket connections
  if (wss) {
    const closeWebSockets = new Promise<void>((resolve) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.close();
        }
      });
      wss.close(() => {
        console.log('WebSocket server closed');
        resolve();
      });
    });

    await closeWebSockets;
  }

  // Close HTTP server
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log('HTTP server closed');
        resolve();
      });
    });
  }

  console.log('Cleanup completed');
};

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log('Received shutdown signal');
  try {
    await cleanup();
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Connect to the database
connectToDatabase()
  .then(() => {
    // Start the server only after successfully connecting to the database
    server = createServer(app);
    initializeWebSocket();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (HTTP and WebSocket)`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1);
  });

export default app;