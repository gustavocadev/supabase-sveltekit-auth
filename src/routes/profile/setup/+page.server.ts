import {
	getCountryCodes,
	sendOPTCodeToPhoneNumber,
	verifyOPTCode
} from '$lib/helpers/sendMessage.js';
import { sendOPTCodeSchema } from '$lib/schemas/profile-setup/sendOPTCodeSchema';
import { setupProfileSchema } from '$lib/schemas/profile-setup/setupProfileSchema';
import { db } from '$lib/server/db.js';
import { profiles } from '$lib/server/schema.js';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';
import { error } from '@sveltejs/kit';
import type { Message } from '$lib/types/Message';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw redirect(303, '/login');

	const userId = session.user.id;
	const profile = (await db.select().from(profiles).where(eq(profiles.id, userId))).at(0);

	if (!profile) throw error(404, 'Profile not found');

	// if the user has already setup their profile, redirect them to the home page
	if (profile.phone_validate) throw redirect(303, '/');

	// get the list of country codes
	const countryCodes = await getCountryCodes();

	// my forms validations
	const setupProfileForm = await superValidate(setupProfileSchema);
	const sendOPTCodeForm = await superValidate(sendOPTCodeSchema);

	const userAvatars = await locals.supabase.storage.from(`avatars`).list(userId, {
		sortBy: {
			column: 'created_at'
		}
	});

	if (userAvatars.error) throw error(500, userAvatars.error.message);
	if (userAvatars.data.length === 0)
		return {
			setupProfileForm,
			sendOPTCodeForm,
			countryCodes,
			avatar: null
		};
	const firstImgName = userAvatars.data.reverse().at(0)?.name;

	// generate a signed url for the user's avatar
	const publicUrl = locals.supabase.storage
		.from('avatars')
		.getPublicUrl(`${userId}/${firstImgName}`);

	if (!publicUrl.data) throw error(404, 'Error generating signed url');

	return {
		setupProfileForm,
		sendOPTCodeForm,
		countryCodes,
		avatar: publicUrl.data
	};
};

export const actions = {
	sendOPTCode: async ({ request }) => {
		const sendOPTCodeForm = await superValidate<typeof sendOPTCodeSchema, Message>(
			request,
			sendOPTCodeSchema
		);

		if (!sendOPTCodeForm.valid) {
			return fail(400, {
				sendOPTCodeForm
			});
		}

		const { countryCode, phoneNumber } = sendOPTCodeForm.data;

		// Send SMS
		try {
			await sendOPTCodeToPhoneNumber(`${countryCode}${phoneNumber}`);

			return message(sendOPTCodeForm, {
				type: 'success',
				text: 'Code sent successfully'
			});
		} catch (error) {
			return message(
				sendOPTCodeForm,
				{
					type: 'error',
					text: 'Something went wrong. Please try again later.'
				},
				{ status: 500 }
			);
		}
	},
	completeProfile: async ({ request }) => {
		const setupProfileForm = await superValidate(request, setupProfileSchema);

		if (!setupProfileForm.valid) {
			return fail(400, {
				setupProfileForm
			});
		}
		const { countryCode, phoneNumber, codeToVerify, firstName, avatarUrl, lastName } =
			setupProfileForm.data;

		const verification_check = await verifyOPTCode(`${countryCode}${phoneNumber}`, codeToVerify);

		if (verification_check.status === 'approved') {
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

		return message(
			setupProfileForm,
			{
				type: 'error',
				text: 'Code is invalid'
			},
			{ status: 400 }
		);
	}
} satisfies Actions;
