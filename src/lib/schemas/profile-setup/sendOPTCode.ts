import { z } from 'zod';

export const sendOPTCodeSchema = z.object({
	countryCode: z.string().min(2).max(3),
	phoneNumber: z.string().min(9).max(9)
});
