import { Resend } from 'resend';
import { emailConfig } from '@/config/env';

const resend = new Resend(emailConfig.resendApiKey);

export const emailService = {
  sendEmailVerificationOtp: async (to: string, otp: string) => {
    await resend.emails.send({
      from: emailConfig.fromEmail,
      to,
      subject: 'Fit-Nexus 信箱驗證',
      html: `<p>您的驗證碼為： ${otp}</p>`
    });
  },
  sendPasswordResetOtp: async (to: string, otp: string) => {
    await resend.emails.send({
      from: emailConfig.fromEmail,
      to,
      subject: 'Fit-Nexus 密碼重置',
      html: `<p>您的驗證碼為： ${otp}</p>`
    });
  }
};
