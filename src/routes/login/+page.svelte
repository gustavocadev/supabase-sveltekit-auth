<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	export let data;

	const handleSignGoogleProvider = async () => {
		const { error, data: googleData } = await data.supabase.auth.signInWithOAuth({
			provider: 'google'
		});
		if (error) {
			console.log(error);
		}

		console.log(googleData);
	};
</script>

<MetaTags title="Login" />

<form action="?/login" class="flex flex-col gap-2">
	<div>
		<h1 class="text-4xl">Login</h1>
	</div>
	<button class="btn variant-filled-secondary" on:click={handleSignGoogleProvider}
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
