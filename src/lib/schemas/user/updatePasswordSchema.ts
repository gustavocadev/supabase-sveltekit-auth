import { z } from 'zod';

export const updatePasswordSchema = z.object({
	password: z.string().min(6)
});
