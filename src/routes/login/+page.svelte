<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { loginSchema } from '$lib/schemas/user/loginSchema.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-french-toast';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import type { Message } from '$lib/types/Message';
	import { page } from '$app/stores';

	export let data: PageData;

	const { message } = superForm<typeof loginSchema, Message>(data.form, {
		onUpdated: ({ form }) => {
			if (form?.message?.type === 'error') {
				toast.error(form.message.text);
			}
		}
	});

	const handleSignInGoogleProvider = async () => {
		const { error } = await data.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				// redirect to callback url to generate a session by code
				redirectTo: `${$page.url.origin}/auth/callback`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});

		if (error) {
			toast.error(error.message);
			return;
		}
	};

	const handleLoginSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') toast.success('Successfully logged in');

			await applyAction(result);
		};
	};
</script>

<MetaTags title="Login" />

<form action="?/login" class="flex flex-col gap-2" method="post" use:enhance={handleLoginSubmit}>
	<div>
		<h1 class="text-4xl">Login</h1>
	</div>

	<button class="btn variant-filled-secondary" on:click={handleSignInGoogleProvider} type="button"
		>Continue with Google</button
	>

	<div class="flex flex-col gap-1">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" class="input" />
	</div>

	<div class="flex flex-col gap-1">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" class="input" />
	</div>

	<p>
		Forgot your password? <a href="/user/forgot-password" class="font-bold hover:underline">Reset</a
		>
	</p>

	<button class="btn variant-filled-primary" type="submit"> Login </button>

	<p>
		Don't have an account? <a href="/signup" class="font-bold hover:underline">Signup</a>
	</p>
</form>
