import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schemas/user/loginSchema';
import type { Message } from '$lib/types/Message';

export const load: PageServerLoad = async ({ url, locals }) => {
	const session = await locals.getSession();

	// if the user is already logged in return them to the account page
	if (session) throw redirect(303, '/');

	const form = superValidate(loginSchema);

	return { url: url.origin, form };
};

export const actions = {
	login: async ({ request, locals }) => {
		const form = await superValidate<typeof loginSchema, Message>(request, loginSchema);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: signInError } = await locals.supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (signInError) {
			return message(
				form,
				{
					type: 'error',
					text: 'Make sure you have entered the correct email and password.'
				},
				{ status: 400 }
			);
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
