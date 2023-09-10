import {
	getCountryCodes,
	sendOPTCodeToPhoneNumber,
	verifyOPTCode
} from '$lib/helpers/sendMessage.js';
import { sendOPTCodeSchema } from '$lib/schemas/profile-setup/sendOPTCodeSchema.js';
import { setupProfileSchema } from '$lib/schemas/profile-setup/setupProfileSchema';
import { db } from '$lib/server/db.js';
import { profiles } from '$lib/server/schema.js';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw redirect(303, '/login');

	const userId = session.user.id;
	const profile = await db.select().from(profiles).where(eq(profiles.id, userId));

	// if the user has already setup their profile, redirect them to the home page
	if (profile.at(0)?.phone_validate) throw redirect(303, '/');

	const { data } = await locals.supabase.storage.from(`avatars`).list(userId, {
		sortBy: {
			column: 'created_at'
		}
	});

	const firstImgName = data?.reverse()?.at(0)?.name;

	// get the list of country codes
	const countryCodes = await getCountryCodes();

	// generate a signed url for the user's avatar
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

		// Send SMS
		await sendOPTCodeToPhoneNumber(`${countryCode}${phoneNumber}`);

		return {
			form
		};
	},
	completeProfile: async ({ request }) => {
		const form = await superValidate(request, setupProfileSchema);

		if (!form.valid) {
			console.log(form.data);
			return fail(400, {
				form
			});
		}
		const { countryCode, phoneNumber, codeToVerify, firstName, avatarUrl, lastName } = form.data;

		const verification_check = await verifyOPTCode(`${countryCode}${phoneNumber}`, codeToVerify);

		if (verification_check.status === 'approved') {
			console.log({
				first_name: firstName,
				last_name: lastName,
				avatar_url: avatarUrl,
				phone_validate: true,
				country_code: countryCode,
				phone_number: phoneNumber
			});
			// Save
			await db.update(profiles).set({
				first_name: firstName,
				last_name: lastName,
				avatar_url: avatarUrl,
				phone_validate: true,
				country_code: countryCode,
				phone_number: phoneNumber
			});

			throw redirect(303, '/');
		}

		// Save
		throw redirect(303, '/profile/setup');
	}
} satisfies Actions;
