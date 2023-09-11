import { signupSchema } from '$lib/schemas/user/signupSchema.js';
import type { Message } from '$lib/types/Message.js';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

export const load = async ({ locals }) => {
	const session = await locals.getSession();

	// if the user is already logged in return them to the account page
	if (session) throw redirect(303, '/');

	return {
		form: superValidate(signupSchema)
	};
};

export const actions = {
	signup: async ({ request, locals, url }) => {
		const form = await superValidate<typeof signupSchema, Message>(request, signupSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { error: signUpError } = await locals.supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		if (signUpError) {
			// set error for email and password fields
			return message(
				form,
				{
					type: 'error',
					text: 'Make sure your email and password are correct'
				},
				{
					status: 400
				}
			);
		}

		return message(form, {
			type: 'success',
			text: 'Please check your email to confirm your account.'
		});
	}
} satisfies Actions;
