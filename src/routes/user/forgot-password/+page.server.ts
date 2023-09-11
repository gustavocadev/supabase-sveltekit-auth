import { forgotPasswordSchema } from '$lib/schemas/user/forgotPasswordSchema';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

export const load = async () => {
	const form = await superValidate(forgotPasswordSchema);

	return {
		form
	};
};

export const actions = {
	forgotPassword: async ({ request, locals, url }) => {
		const form = await superValidate(request, forgotPasswordSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const resetPasswordForEmail = await locals.supabase.auth.resetPasswordForEmail(
			form.data.email,
			{
				redirectTo: `${url.origin}/user/update-password`
			}
		);

		if (resetPasswordForEmail.error) {
			return message(
				form,
				{
					type: 'error',
					message: resetPasswordForEmail.error.message
				},
				{ status: 400 }
			);
		}

		return message(form, 'Please check your email for a link to reset your password.');
	}
};
