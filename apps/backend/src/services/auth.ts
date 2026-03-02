import argon2 from 'argon2';
import { userRepository } from '@/repositories/user';
import type { SignupInput } from '@/schemas/auth';

export const authService = {
  signUp: async (data: SignupInput) => {
    const passwordHash = await argon2.hash(data.password);
    const newUser = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      sex: data.sex
    });

    return newUser;
  }
};
