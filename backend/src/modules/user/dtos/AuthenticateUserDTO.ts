
import { z } from 'zod';

export const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type AuthenticateUserDTO = z.infer<typeof authenticateUserSchema>;