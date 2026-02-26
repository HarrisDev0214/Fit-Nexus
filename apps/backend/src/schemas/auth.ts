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

export type SignupInput = z.infer<typeof signupSchema>['body'];
