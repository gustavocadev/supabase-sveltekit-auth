import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { db } from '$lib/server/db';
import { profiles } from '$lib/server/schema';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const handle = (async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const { data } = await event.locals.supabase.auth.getSession();

		const { session } = data;
		return session;
	};

	// protect mutliple routes
	if (event.url.pathname === '/') {
		const session = await event.locals.getSession();
		if (!session) throw redirect(303, '/login');

		const userId = session.user.id;
		const profile = await db.select().from(profiles).where(eq(profiles.id, userId));

		// if the user has not completed their profile, redirect them to the setup page
		if (!profile.at(0)?.last_name) throw redirect(303, '/profile/setup');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
}) satisfies Handle;
