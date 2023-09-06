// src/routes/+page.server.ts
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schemas/user/loginSchema';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// if the user is already logged in return them to the account page
	if (session) {
		throw redirect(303, '/');
	}

	return { url: url.origin };
};

export const actions = {
	login: async ({ request }) => {
		const form = await superValidate(request, loginSchema);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		return { form };
	}
} satisfies Actions;
