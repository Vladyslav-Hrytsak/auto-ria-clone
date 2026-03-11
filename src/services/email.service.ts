import sgMail from "@sendgrid/mail";

import { config } from "../config/configs";

sgMail.setApiKey(config.SENDGRID_API_KEY);

class EmailService {
  public async sendManagerNotification(listingId: string) {
    const message = {
      to: config.MANAGER_EMAIL!,
      from: config.SENDGRID_FROM_EMAIL!,
      subject: "Listing requires manual review",
      text: `Listing ${listingId} exceeded edit attempts and requires manager review.`,
    };

    await sgMail.send(message);
  }

  public async sendBrandRequestNotification(
    brandName: string,
    modelName: string,
    messageText: string,
    userId: string,
  ) {
    const message = {
      to: config.MANAGER_EMAIL!,
      from: config.SENDGRID_FROM_EMAIL!,
      subject: "New brand request",
      text: `
New brand request

Brand: ${brandName}
Model: ${modelName}
Message: ${messageText}
User: ${userId}
      `,
    };

    await sgMail.send(message);
  }
}

export const emailService = new EmailService();
