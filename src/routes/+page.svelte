<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container mx-auto flex flex-col gap-4">
	<h1 class="text-4xl">Dashboard Home</h1>
	<p class="text-4xl">You're Authenticated!</p>
	<form action="?/signout" use:enhance method="post">
		<button class="btn variant-filled-error">Sign out</button>
	</form>
</div>
