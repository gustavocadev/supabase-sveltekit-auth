import { z } from 'zod';

export const setupProfileSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(100),
	confirmPassword: z.string().min(6).max(100)
});
