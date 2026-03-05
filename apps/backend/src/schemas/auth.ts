import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1, '名稱不可為空').max(30, '名稱長度不可超過 30 個字元'),
    email: z.string().email('Email 格式不正確').max(256, 'Email 長度不可超過 256 個字元'),
    password: z.string().min(8, '密碼長度至少為 8 個字元'),
    sex: z.enum(['male', 'female'], {
      message: '性別必須為 male 或 female'
    })
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email 格式不正確'),
    password: z.string().min(1, '密碼不可為空').max(256, '密碼長度不可超過 256 個字元')
  })
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, '密碼不可為空').max(256, '密碼長度不可超過 256 個字元'),
    newPassword: z.string().min(8, '密碼長度至少為 8 個字元').max(256, '密碼長度不可超過 256 個字元')
  }).refine(data => data.oldPassword !== data.newPassword, {
    message: '新密碼不能與舊密碼相同',
    path: ['newPassword']
  })
});

export const verifyEmailSchema = z.object({
  body: z.object({
    otp: z.string().min(6, '驗證碼必須為 6 位數').max(6, '驗證碼必須為 6 位數'),
    email: z.string().email('Email 格式不正確')
  })
});

export const recreateEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Email 格式不正確')
  })
});

export const createPasswordResetOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Email 格式不正確')
  })
});

export type SignupInput = z.infer<typeof signupSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>['body'];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>['body'];
export type CreateEmailOtpInput = z.infer<typeof createPasswordResetOtpSchema>['body'];
