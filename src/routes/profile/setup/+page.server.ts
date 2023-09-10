import {
	getCountryCodes,
	sendOPTCodeToPhoneNumber,
	verifyOPTCode
} from '$lib/helpers/sendMessage.js';
import { sendOPTCodeSchema } from '$lib/schemas/profile-setup/sendOPTCode.js';
import { setupProfileSchema } from '$lib/schemas/profile-setup/setupProfileSchema';
import { db } from '$lib/server/db';
import { profiles } from '$lib/server/schema';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw redirect(303, '/login');

	const userId = session.user.id;

	const profile = await db.select().from(profiles).where(eq(profiles.id, userId));
	console.log(profile);

	const { data } = await locals.supabase.storage.from(`avatars`).list(userId, {
		sortBy: {
			column: 'created_at'
		}
	});

	const firstImgName = data?.reverse()?.at(0)?.name;

	const countryCodes = await getCountryCodes();

	const avatarUrl = await locals.supabase.storage
		.from('avatars')
		.createSignedUrl(`${userId}/${firstImgName}`, 60);

	return {
		form: superValidate(setupProfileSchema),
		countryCodes,
		avatar: avatarUrl.data
	};
};

export const actions = {
	sendOPTCode: async ({ request }) => {
		const form = await superValidate(request, sendOPTCodeSchema);

		if (!form.valid) {
			console.log(form.data);
			return fail(400, {
				form
			});
		}

		const { countryCode, phoneNumber } = form.data;

		const verification = await sendOPTCodeToPhoneNumber(`+${countryCode}${phoneNumber}`);

		console.log(verification.status);

		return {
			form
		};
	},
	completeProfile: async ({ request, url }) => {
		const form = await superValidate(request, setupProfileSchema);
		const code = url.searchParams.get('code');
		if (!code) {
			throw redirect(303, '/login');
		}

		if (!form.valid) {
			console.log(form.data);
			return fail(400, {
				form
			});
		}
		const { countryCode, phoneNumber, codeToVerify } = form.data;

		const verification_check = await verifyOPTCode(`+${countryCode}${phoneNumber}`, codeToVerify);

		if (verification_check.status === 'approved') {
			// Save
			throw redirect(303, '/');
		}

		// Save
		throw redirect(303, '/login');
	}
} satisfies Actions;
