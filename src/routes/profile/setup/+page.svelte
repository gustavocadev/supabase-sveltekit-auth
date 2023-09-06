<script lang="ts">
	import { enhance } from '$app/forms';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms/client';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let data;

	const { form, errors } = superForm(data.form);

	const handleUpdateProfilePhoto = () => {
		console.log('update profile photo');
	};
</script>

<MetaTags title="Complete Profile" />

<form action="?/completeProfile" class="flex flex-col gap-2" method="post" use:enhance>
	<h1 class="text-4xl">Complete Profile</h1>

	<div class="flex flex-col gap-4">
		<figure class="flex gap-4 justify-center">
			<Avatar initials="JD" background="bg-primary-500" />
		</figure>
		<button class="btn variant-filled-secondary" type="button" on:click={handleUpdateProfilePhoto}
			>Upload Image</button
		>
	</div>

	<div class="flex flex-col gap-1">
		<label for="firstName">First Name</label>
		<input type="text" name="firstName" id="firstName" class="input" bind:value={$form.email} />
	</div>

	<div class="flex flex-col gap-1">
		<label for="lastName">Last Name</label>
		<input type="text" name="lastName" id="lastName" class="input" bind:value={$form.password} />
	</div>

	<div class="flex flex-col gap-1">
		<label for="">Mobile Number</label>

		<div class="flex gap-4">
			<input type="text" name="countryCode" class="input" />
			<input type="text" name="phone" class="input" bind:value={$form.confirmPassword} />
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label for="verifyCode">Verify Code</label>
		<input
			type="text"
			name="codeToVerify"
			id="verifyCode"
			class="input"
			bind:value={$form.password}
		/>
	</div>

	<a class="btn variant-filled-primary" type="submit" href="/">Go to my Dashboard</a>
</form>
