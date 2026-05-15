import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, content: string) {
    this.logger.log(`Sending email to ${to}: ${subject}`);
    // Mock implementation
    return true;
  }
}
