import { z } from 'zod';

export const signupSchema = z
	.object({
		email: z.string().email().trim(),
		password: z.string().min(6).max(100).trim(),
		confirmPassword: z.string().min(6).max(100).trim()
	})
	.refine((data) => data.password === data.confirmPassword, "Passwords don't match");
