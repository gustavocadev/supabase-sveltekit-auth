import { z } from 'zod';

export const setupProfileSchema = z.object({
	avatarUrl: z.string().optional(),
	firstName: z.string().min(2).max(40),
	lastName: z.string().min(2).max(40),
	countryCode: z.string().min(2).max(3),
	phoneNumber: z.string().min(6).max(40),
	codeToVerify: z.string().length(6)
});
