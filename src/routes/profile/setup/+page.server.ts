import { setupProfileSchema } from '$lib/schemas/user/setupProfileSchema';
import { redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async ({ url }) => {
	const code = url.searchParams.get('code');
	if (!code) {
		throw redirect(303, '/login');
	}

	return {
		form: superValidate(setupProfileSchema)
	};
};

export const actions = {
	completeProfile: () => {
		return {};
	}
} satisfies Actions;
