import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}

sgMail.setApiKey(SENDGRID_API_KEY);

interface EmergencyNotification {
  userMessage: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  location?: string;
}

export class EmailService {
  private readonly fromEmail: string;
  private readonly emergencyContactEmail: string;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || '';
    this.emergencyContactEmail = process.env.EMERGENCY_CONTACT_EMAIL || '';

    if (!this.fromEmail || !this.emergencyContactEmail) {
      throw new Error('Email configuration is incomplete. Both FROM_EMAIL and EMERGENCY_CONTACT_EMAIL must be set.');
    }

    console.log('EmailService initialized with:', {
      fromEmail: this.fromEmail,
      emergencyContactEmail: this.emergencyContactEmail,
      hasApiKey: !!SENDGRID_API_KEY
    });
  }

  async sendEmergencyAlert(notification: EmergencyNotification): Promise<boolean> {
    try {
      console.log('Preparing to send emergency alert:', {
        fromEmail: this.fromEmail,
        toEmail: this.emergencyContactEmail,
        messagePreview: notification.userMessage.substring(0, 50)
      });

      const msg = {
        to: this.emergencyContactEmail,
        from: {
          email: this.fromEmail,
          name: 'CozySpace Emergency Alert'
        },
        subject: 'URGENT: Crisis Alert - Immediate Attention Required',
        text: this.generateEmergencyEmailText(notification),
        html: this.generateEmergencyEmailHtml(notification),
      };

      console.log('Sending email with configuration:', {
        to: msg.to,
        from: msg.from,
        subject: msg.subject
      });

      const [response] = await sgMail.send(msg);
      
      console.log('SendGrid response:', {
        statusCode: response.statusCode,
        headers: response.headers,
        body: response.body
      });

      return response.statusCode === 202;
    } catch (error:any) {
      if (error.response) {
        console.error('SendGrid API Error:', {
          status: error.response.status,
          body: error.response.body,
          headers: error.response.headers
        });
      }
      
      console.error('Email service error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      return false;
    }
  }

  private generateEmergencyEmailText(notification: EmergencyNotification): string {
    return `
URGENT: Crisis Alert

A user has expressed concerning thoughts that require immediate attention.

User Message: ${notification.userMessage}
Timestamp: ${notification.timestamp.toLocaleString()}
${notification.userId ? `User ID: ${notification.userId}` : ''}
${notification.userName ? `User Name: ${notification.userName}` : ''}
${notification.location ? `Location: ${notification.location}` : ''}

This is an automated alert from the anxiety management app.
Please take appropriate action according to crisis response protocols.

Important Resources:
- National Crisis Hotline: 988
- Crisis Text Line: Text HOME to 741741
    `;
  }

  private generateEmergencyEmailHtml(notification: EmergencyNotification): string {
    return `
      <h2 style="color: #ff0000;">URGENT: Crisis Alert</h2>
      <p style="font-size: 16px;">A user has expressed concerning thoughts that require immediate attention.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-left: 4px solid #ff0000;">
        <p><strong>User Message:</strong> ${notification.userMessage}</p>
        <p><strong>Timestamp:</strong> ${notification.timestamp.toLocaleString()}</p>
        ${notification.userId ? `<p><strong>User ID:</strong> ${notification.userId}</p>` : ''}
        ${notification.userName ? `<p><strong>User Name:</strong> ${notification.userName}</p>` : ''}
        ${notification.location ? `<p><strong>Location:</strong> ${notification.location}</p>` : ''}
      </div>

      <p>This is an automated alert from the anxiety management app.<br>
      Please take appropriate action according to crisis response protocols.</p>

      <div style="margin-top: 20px; padding: 15px; background-color: #f0f0f0;">
        <h3>Important Resources:</h3>
        <ul>
          <li>National Crisis Hotline: 988</li>
          <li>Crisis Text Line: Text HOME to 741741</li>
        </ul>
      </div>
    `;
  }
}

export const emailService = new EmailService();
export default EmailService;