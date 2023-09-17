<script lang="ts">
	import { enhance } from '$app/forms';
	import type { forgotPasswordSchema } from '$lib/schemas/user/forgotPasswordSchema.js';
	import type { Message } from '$lib/types/Message.js';
	import { toast } from 'svelte-french-toast';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors } = superForm<typeof forgotPasswordSchema, Message>(data.form, {
		onUpdated: ({ form }) => {
			if (form?.message?.type === 'error') {
				toast.error(form.message.text);
			}
			if (form?.message?.type === 'success') {
				toast.success(form.message.text);
			}
		}
	});
</script>

<MetaTags title="Forgot Password" />
<form action="?/forgotPassword" class="flex flex-col gap-2" method="post" use:enhance>
	<div>
		<h1 class="text-4xl">Forgot Password</h1>
	</div>

	<div class="flex flex-col gap-1">
		<label for="email">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			class="input"
			placeholder="eg. email@email.com"
			bind:value={$form.email}
		/>
		{#if $errors.email}
			<span class="text-error-200">
				❌ {$errors.email}
			</span>
		{/if}
	</div>

	<button class="btn variant-filled-primary" type="submit"> Reset Password </button>

	<p>
		or <a href="/login" class="font-bold hover:underline">Login</a>
	</p>
</form>
