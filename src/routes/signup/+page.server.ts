import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.getSession();

	// if the user is already logged in return them to the account page
	if (session) {
		throw redirect(303, '/');
	}

	return {};
};
