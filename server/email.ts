import nodemailer from 'nodemailer';
import { env } from './config/env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_APP_PASSWORD
  }
});

export async function sendSubscriberNotification(subscriberData: { firstName: string; email: string }) {
  const mailOptions = {
    from: env.EMAIL_USER,
    to: 'jason@skatehubba.com',
    subject: '🛹 New SkateHubba Subscriber!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">🛹 New Subscriber Alert!</h2>
        <p>You have a new subscriber to the SkateHubba newsletter:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${subscriberData.firstName}</p>
          <p><strong>Email:</strong> ${subscriberData.email}</p>
          <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p style="color: #666;">Keep building that community! 🚀</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Subscriber notification email sent successfully');
  } catch (error) {
    console.error('Failed to send subscriber notification email:', error);
    // Don't throw error - we don't want subscription to fail if email fails
  }
}
