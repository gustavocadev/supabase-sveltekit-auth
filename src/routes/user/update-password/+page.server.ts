import { updatePasswordSchema } from '$lib/schemas/user/updatePasswordSchema';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw redirect(303, '/login');

	const form = await superValidate(updatePasswordSchema);
	return {
		form
	};
};

export const actions = {
	updatePassword: async ({ request, locals }) => {
		const form = await superValidate(request, updatePasswordSchema);

		if (!form.valid) return fail(400, { form });

		const { data, error } = await locals.supabase.auth.updateUser({
			password: form.data.password
		});

		if (error) {
			console.log('error', error);
			return message(
				form,
				{
					type: 'error',
					text: 'Something went wrong. Please try again.'
				},
				{ status: 400 }
			);
		}

		console.log(data);
		throw redirect(303, '/');
	}
} satisfies Actions;
