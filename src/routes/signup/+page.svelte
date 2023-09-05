<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
</script>

<MetaTags title="Signup" />

<form action="" class="flex flex-col gap-2">
	<div>
		<h1 class="text-4xl">Login</h1>
	</div>

	<div class="flex flex-col gap-1">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" class="input" />
	</div>

	<div class="flex flex-col gap-1">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" class="input" />
	</div>

	<button class="btn variant-filled-primary" type="submit">Signup</button>
	<p>
		Already have an account? <a href="/login" class="font-bold hover:underline">Login</a>
	</p>
</form>
