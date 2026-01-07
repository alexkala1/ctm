import nodemailer from 'nodemailer';

import type { EmailNotification } from '../../types/tournament';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const emailTemplates = {
  competitorRegistration: {
    subject: 'Tournament Registration Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Tournament Registration Confirmed</h2>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>Your registration for <strong>{{tournamentName}}</strong> has been received and is pending approval.</p>
        <p><strong>Registration Details:</strong></p>
        <ul>
          <li>Tournament: {{tournamentName}}</li>
          <li>Category: {{category}}</li>
          <li>Registration Date: {{registrationDate}}</li>
        </ul>
        <p>You will receive another email once your registration is approved.</p>
        <p>Best regards,<br>Tournament Management Team</p>
      </div>
    `,
    text: `
      Tournament Registration Confirmed
      
      Dear {{firstName}} {{lastName}},
      
      Your registration for {{tournamentName}} has been received and is pending approval.
      
      Registration Details:
      - Tournament: {{tournamentName}}
      - Category: {{category}}
      - Registration Date: {{registrationDate}}
      
      You will receive another email once your registration is approved.
      
      Best regards,
      Tournament Management Team
    `,
  },

  competitorApproved: {
    subject: 'Tournament Registration Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Registration Approved!</h2>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>Great news! Your registration for <strong>{{tournamentName}}</strong> has been approved.</p>
        <p><strong>Tournament Details:</strong></p>
        <ul>
          <li>Tournament: {{tournamentName}}</li>
          <li>Start Date: {{tournamentStart}}</li>
          <li>End Date: {{tournamentEnd}}</li>
          <li>Category: {{category}}</li>
        </ul>
        <p>We look forward to seeing you at the tournament!</p>
        <p>Best regards,<br>Tournament Management Team</p>
      </div>
    `,
    text: `
      Registration Approved!
      
      Dear {{firstName}} {{lastName}},
      
      Great news! Your registration for {{tournamentName}} has been approved.
      
      Tournament Details:
      - Tournament: {{tournamentName}}
      - Start Date: {{tournamentStart}}
      - End Date: {{tournamentEnd}}
      - Category: {{category}}
      
      We look forward to seeing you at the tournament!
      
      Best regards,
      Tournament Management Team
    `,
  },

  competitorRejected: {
    subject: 'Tournament Registration Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Registration Update</h2>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>Unfortunately, your registration for <strong>{{tournamentName}}</strong> could not be approved at this time.</p>
        <p><strong>Reason:</strong> {{rejectionReason}}</p>
        <p>If you have any questions, please contact the tournament organizers.</p>
        <p>Best regards,<br>Tournament Management Team</p>
      </div>
    `,
    text: `
      Registration Update
      
      Dear {{firstName}} {{lastName}},
      
      Unfortunately, your registration for {{tournamentName}} could not be approved at this time.
      
      Reason: {{rejectionReason}}
      
      If you have any questions, please contact the tournament organizers.
      
      Best regards,
      Tournament Management Team
    `,
  },

  adminNotification: {
    subject: 'New Tournament Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Registration Pending Approval</h2>
        <p>A new registration requires your attention:</p>
        <p><strong>Competitor:</strong> {{firstName}} {{lastName}}</p>
        <p><strong>Tournament:</strong> {{tournamentName}}</p>
        <p><strong>Category:</strong> {{category}}</p>
        <p><strong>Registration Date:</strong> {{registrationDate}}</p>
        <p>Please review and approve or reject this registration.</p>
        <p>Best regards,<br>System Notification</p>
      </div>
    `,
    text: `
      New Registration Pending Approval
      
      A new registration requires your attention:
      
      Competitor: {{firstName}} {{lastName}}
      Tournament: {{tournamentName}}
      Category: {{category}}
      Registration Date: {{registrationDate}}
      
      Please review and approve or reject this registration.
      
      Best regards,
      System Notification
    `,
  },
};

export function renderTemplate(template: EmailTemplate, data: Record<string, string>): EmailTemplate {
  const render = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  };

  return {
    subject: render(template.subject),
    html: render(template.html),
    text: render(template.text),
  };
}

export async function sendEmail(notification: EmailNotification): Promise<{ success: boolean; error?: string }> {
  try {
    const template = emailTemplates[notification.template as keyof typeof emailTemplates];
    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    const rendered = renderTemplate(
      template,
      Object.fromEntries(Object.entries(notification.data).map(([key, value]) => [key, String(value)]))
    );

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@tournament.com',
      to: notification.to,
      subject: notification.subject ?? rendered.subject,
      html: rendered.html,
      text: rendered.text,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendCompetitorRegistrationEmail(
  competitor: {
    firstName: string;
    lastName: string;
    category: string;
    email?: string;
    createdAt: string;
  },
  tournament: { name: string }
): Promise<{ success: boolean; error?: string }> {
  const data = {
    firstName: competitor.firstName,
    lastName: competitor.lastName,
    tournamentName: tournament.name,
    category: competitor.category,
    registrationDate: new Date(competitor.createdAt).toLocaleDateString(),
  };

  return sendEmail({
    to: competitor.email || 'competitor@example.com', // In real app, get from user profile
    subject: 'Tournament Registration Confirmation',
    template: 'competitorRegistration',
    data,
  });
}

export async function sendCompetitorApprovalEmail(
  competitor: {
    firstName: string;
    lastName: string;
    category: string;
    email?: string;
  },
  tournament: { name: string; tournamentStart: string; tournamentEnd: string },
  approved: boolean,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const data = {
    firstName: competitor.firstName,
    lastName: competitor.lastName,
    tournamentName: tournament.name,
    category: competitor.category,
    tournamentStart: new Date(tournament.tournamentStart).toLocaleDateString(),
    tournamentEnd: new Date(tournament.tournamentEnd).toLocaleDateString(),
    rejectionReason: reason,
  };

  const template = approved ? 'competitorApproved' : 'competitorRejected';

  return sendEmail({
    to: competitor.email || 'competitor@example.com',
    subject: approved ? 'Tournament Registration Approved' : 'Tournament Registration Update',
    template,
    data,
  });
}

export async function sendAdminNotificationEmail(
  competitor: {
    firstName: string;
    lastName: string;
    category: string;
    createdAt: string;
  },
  tournament: { name: string },
  adminEmails: string[]
): Promise<{ success: boolean; error?: string }> {
  const data = {
    firstName: competitor.firstName,
    lastName: competitor.lastName,
    tournamentName: tournament.name,
    category: competitor.category,
    registrationDate: new Date(competitor.createdAt).toLocaleDateString(),
  };

  const results = await Promise.all(
    adminEmails.map(email =>
      sendEmail({
        to: email,
        subject: 'New Tournament Registration',
        template: 'adminNotification',
        data,
      })
    )
  );

  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    return {
      success: false,
      error: `Failed to send to ${failed.length} admins`,
    };
  }

  return { success: true };
}

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  template: string,
  data: Record<string, unknown>
): Promise<{
  success: boolean;
  sent: number;
  failed: number;
  errors: string[];
}> {
  const results = await Promise.all(
    recipients.map(async email => {
      try {
        const result = await sendEmail({
          to: email,
          subject,
          template,
          data,
        });
        return { success: result.success, error: result.error };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  const sent = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success);
  const errors = failed.map(r => r.error).filter(Boolean) as string[];

  return {
    success: failed.length === 0,
    sent,
    failed: failed.length,
    errors,
  };
}
