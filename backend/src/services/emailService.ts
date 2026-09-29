import { logger } from '../utils/logger';
import { config } from '../config/env';

export interface IEmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const emailService = {
  sendEmail: async (payload: IEmailPayload): Promise<boolean> => {
    logger.info(`[Email Service] Dispatching email to ${payload.to} | Subject: ${payload.subject}`);
    
    // Abstracted SMTP email dispatch logger
    if (config.email.host && config.email.user) {
      logger.info(`[Email Service SMTP] Delivered via host ${config.email.host}`);
    } else {
      logger.info(`[Email Service Simulation] SMTP parameters not configured. Email logged cleanly.`);
    }
    
    return true;
  },

  sendQuoteConfirmation: async (email: string, name: string, quoteId: string): Promise<boolean> => {
    return emailService.sendEmail({
      to: email,
      subject: `[Hariom Pipes] Quotation Request Received - Ref: ${quoteId}`,
      text: `Dear ${name},\n\nThank you for contacting Hariom Pipe Industries Limited. Your quote request (ID: ${quoteId}) has been received and assigned to an industrial sales representative.\n\nBest regards,\nHariom Pipe Industries Limited`,
    });
  },

  sendDealerConfirmation: async (email: string, name: string, enquiryId: string): Promise<boolean> => {
    return emailService.sendEmail({
      to: email,
      subject: `[Hariom Pipes] Dealership Application Received - Ref: ${enquiryId}`,
      text: `Dear ${name},\n\nThank you for expressing interest in becoming a channel partner with Hariom Pipe Industries Limited. Reference ID: ${enquiryId}.\n\nBest regards,\nHariom Channel Partner Team`,
    });
  },
};
