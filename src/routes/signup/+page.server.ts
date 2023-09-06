import { signupSchema } from '$lib/schemas/user/signupSchema.js';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async ({ locals }) => {
	const session = await locals.getSession();

	// if the user is already logged in return them to the account page
	if (session) {
		throw redirect(303, '/');
	}

	return {
		form: superValidate(signupSchema)
	};
};

export const actions = {
	signup: async ({ request, locals, url }) => {
		const form = await superValidate(request, signupSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		await locals.supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		return { form };
	}
} satisfies Actions;
