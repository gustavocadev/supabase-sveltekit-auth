<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-french-toast';
	import type { SubmitFunction } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import type { updatePasswordSchema } from '$lib/schemas/user/updatePasswordSchema';
	import type { Message } from '$lib/types/Message';

	export let data;
	const { form, errors } = superForm<typeof updatePasswordSchema, Message>(data.form, {
		onUpdated: ({ form }) => {
			if (form?.message?.type === 'error') {
				toast.error(form.message.text);
			}
		}
	});

	const handleSubmit: SubmitFunction = () => {
		return ({ result }) => {
			if (result.type === 'success') {
				toast.success('Password updated');
			}
		};
	};
</script>

<form
	action="?/updatePassword"
	class="flex flex-col gap-2"
	method="post"
	use:enhance={handleSubmit}
>
	<div>
		<h1 class="text-4xl">Update your Password</h1>
	</div>

	<div class="flex flex-col gap-1">
		<label for="password">New Password</label>
		<input
			type="password"
			name="password"
			id="password"
			class="input"
			placeholder="eg. *********"
		/>
	</div>

	<button class="btn variant-filled-primary" type="submit"> Update Password </button>
</form>
