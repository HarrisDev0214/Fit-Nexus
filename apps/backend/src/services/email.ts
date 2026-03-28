import { Resend } from 'resend';
import { emailConfig } from '@/config/env';

class EmailService {
  constructor(private resend: Resend) {}

  async sendEmailVerificationOtp(
    to: string,
    otp: string
  ) {
    await this.send(to, 'Fit-Nexus 信箱驗證', `<p>您的驗證碼為： ${otp}</p>`);
  }

  async sendPasswordResetOtp(
    to: string,
    otp: string
  ) {
    await this.send(to, 'Fit-Nexus 密碼重置', `<p>您的驗證碼為： ${otp}</p>`);
  }

  async sendPasswordChanged(to: string) {
    await this.send(to, 'Fit-Nexus 密碼變更成功', '<p>您的密碼已變更成功，請重新登入</p>');
  }

  private async send(
    to: string,
    subject: string,
    html: string
  ) {
    const result = await this.resend.emails.send({
      from: emailConfig.fromEmail,
      to,
      subject,
      html
    });
    if (result.error) {
      throw new Error(`Email send failed: ${result.error.message}`);
    }
  }
}

export const emailService = new EmailService(new Resend(emailConfig.resendApiKey));
