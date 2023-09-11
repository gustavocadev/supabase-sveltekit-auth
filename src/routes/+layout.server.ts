// src/routes/+layout.server.ts
export const load = async ({ locals }) => {
	const session = await locals.getSession();
	return {
		session
	};
};
