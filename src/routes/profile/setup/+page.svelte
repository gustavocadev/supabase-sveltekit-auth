<script lang="ts">
	import { enhance } from '$app/forms';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms/client';
	import {
		Autocomplete,
		Avatar,
		type AutocompleteOption,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';

	export let data;

	let countryCode = '';
	let phoneNumber = '';

	const { form, errors } = superForm(data.form);

	const handleUpdateProfilePhoto = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		const avatar = target.files![0];

		const avatarId = crypto.randomUUID();
		const avatarExt = avatar.name.split('.').pop();
		const userId = data.session?.user.id;

		// delete previous avatar
		const avatarsBucket = await data.supabase.storage.from('avatars').list(userId);
		if (avatarsBucket.data) {
			const latestFile = avatarsBucket.data?.at(0);

			console.log({ latestFile });

			await data.supabase.storage.from('avatars').remove([`${userId}/${latestFile?.name}`]);
		}

		// upload img to supabase storage
		await data.supabase.storage
			.from('avatars')
			.upload(`${userId}/${avatarId}.${avatarExt}`, avatar);

		// Load all the loaders again
		await invalidateAll();
	};

	const countryOptions: AutocompleteOption[] = data.countryCodes.map((country) => ({
		label: `${country.icon} ${country.countryCode}`,
		value: country.countryCode,
		keywords: [country.countryName, country.countryCode]
	}));

	// function onPopupCountryCodeSelection(event: CustomEvent<AutocompleteOption>): void {
	// 	countryCode = event.detail.label;
	// }

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};
</script>

<MetaTags title="Complete Profile" />

<form action="?/completeProfile" class="flex flex-col gap-2" method="post" use:enhance>
	<h1 class="text-4xl">Complete Profile</h1>

	<div class="flex flex-col gap-4">
		<figure class="flex gap-4 justify-center">
			<Avatar initials="JD" background="bg-primary-500" src={data.avatar?.signedUrl} width="w-60" />
		</figure>

		<div class="flex justify-center">
			<input type="file" name="avatar" on:change={handleUpdateProfilePhoto} />
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label for="firstName">First Name</label>
		<input type="text" name="firstName" id="firstName" class="input" placeholder="Eg. Ryan" />
	</div>

	<div class="flex flex-col gap-1">
		<label for="lastName">Last Name</label>
		<input type="text" name="lastName" id="lastName" class="input" placeholder="Eg. Carniato" />
	</div>

	<div class="flex flex-col gap-1">
		<form
			action="?/sendOPTCode"
			class="flex flex-col gap-4"
			use:enhance={() => {
				return ({ result }) => {
					if (result.type === 'success') {
						toast.success('Code sent to your phone number');
					}
				};
			}}
			method="post"
		>
			<div class="flex gap-4">
				<div class="w-2/12 flex flex-col gap-2">
					<label for="">Country Code</label>
					<input
						class="input autocomplete"
						type="search"
						name="countryCode"
						autocomplete="off"
						bind:value={countryCode}
						placeholder="Country Code"
						use:popup={popupSettings}
					/>
					<div
						data-popup="popupAutocomplete"
						class="card w-full max-w-xs max-h-60 p-4 overflow-y-auto"
					>
						<Autocomplete bind:input={countryCode} options={countryOptions} />
					</div>
				</div>

				<div class="w-10/12 flex flex-col gap-2">
					<label for="">Mobile Number</label>
					<input
						type="text"
						name="phoneNumber"
						class="input"
						autocomplete="off"
						bind:value={phoneNumber}
						placeholder="Phone number"
					/>
				</div>
			</div>
			<button type="submit" class="input p-2 variant-filled-tertiary">Enviar Codigo</button>
		</form>
	</div>

	<div class="flex flex-col gap-1">
		<label for="verifyCode">Verify Code</label>
		<input type="text" name="codeToVerify" id="verifyCode" class="input" placeholder="Eg. 123456" />
	</div>

	<input type="hidden" bind:value={countryCode} name="countryCode" />
	<input type="hidden" bind:value={phoneNumber} name="phoneNumber" />
	<input type="hidden" value={data.avatar?.signedUrl} name="avatarUrl" />

	<button class="btn variant-filled-primary" type="submit">Go to my Dashboard</button>
</form>
