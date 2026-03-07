import { Resend } from 'resend';
import { emailConfig } from '@/config/env';

const resend = new Resend(emailConfig.resendApiKey);

export const emailService = {
  sendEmailVerificationOtp: async (to: string, otp: string) => {
    const result = await resend.emails.send({
      from: emailConfig.fromEmail,
      to,
      subject: 'Fit-Nexus 信箱驗證',
      html: `<p>您的驗證碼為： ${otp}</p>`
    });
    if (result.error) {
      throw new Error(`Email send failed: ${result.error.message}`);
    }
  },
  sendPasswordResetOtp: async (to: string, otp: string) => {
    const result = await resend.emails.send({
      from: emailConfig.fromEmail,
      to,
      subject: 'Fit-Nexus 密碼重置',
      html: `<p>您的驗證碼為： ${otp}</p>`
    });
    if (result.error) {
      throw new Error(`Email send failed: ${result.error.message}`);
    }
  },
  sendPasswordChanged: async (to: string) => {
    const result = await resend.emails.send({
      from: emailConfig.fromEmail,
      to,
      subject: 'Fit-Nexus 密碼變更成功',
      html: '<p>您的密碼已變更成功，請重新登入</p>'
    });
    if (result.error) {
      throw new Error(`Email send failed: ${result.error.message}`);
    }
  }
};
