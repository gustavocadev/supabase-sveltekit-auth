// src/routes/auth/callback/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');

	// if there is no code, we redirect the user to the login page
	if (!code) {
		throw redirect(303, '/login');
	}

	// exchangeCodeForSession is a helper function that going to help us to exchange the code for a session, in other words, it's going to help us to log in the user after the email address has been verified, it gonna set a new cookie with the session data and redirect the user to the home page.
	// await locals.supabase.auth.exchangeCodeForSession(code);

	// we could instead redirect the user to a cuztomized page for confirmed email address
	throw redirect(303, `/profile/setup?code=${code}`);
};
