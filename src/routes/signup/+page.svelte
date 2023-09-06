<script lang="ts">
	import { enhance } from '$app/forms';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors } = superForm(data.form);
</script>

<MetaTags title="Signup" />

<form action="?/signup" class="flex flex-col gap-2" method="post" use:enhance>
	<div>
		<h1 class="text-4xl">Sign up</h1>
	</div>

	<div class="flex flex-col gap-1">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" class="input" bind:value={$form.email} />
	</div>
	{#if $errors.email}<span class="text-error-200">{$errors.email}</span>{/if}

	<div class="flex flex-col gap-1">
		<label for="password">Password</label>
		<input
			type="password"
			name="password"
			id="password"
			class="input"
			bind:value={$form.password}
		/>
	</div>
	{#if $errors.password}<span class="text-error-200">{$errors.password}</span>{/if}

	<div class="flex flex-col gap-1">
		<label for="confirmPassword">Confirm password</label>
		<input
			type="password"
			name="confirmPassword"
			id="confirmPassword"
			class="input"
			bind:value={$form.confirmPassword}
		/>
	</div>
	{#if $errors.confirmPassword}<span class="text-error-200">{$errors.confirmPassword}</span>{/if}

	<button class="btn variant-filled-primary" type="submit">Signup</button>
	<p>
		Already have an account? <a href="/login" class="font-bold hover:underline">Login</a>
	</p>
</form>
