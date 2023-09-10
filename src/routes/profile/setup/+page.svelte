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

		// upload img to supabase storage
		await data.supabase.storage
			.from('avatars')
			.upload(`${userId}/${avatarId}.${avatarExt}`, avatar);

		await invalidateAll();
	};

	const countryOptions: AutocompleteOption[] = data.countryCodes.map((country) => ({
		label: `${country.icon} ${country.countryName}`,
		value: country.countryCode,
		keywords: [country.countryName, country.countryCode]
	}));

	function onPopupCountryCodeSelection(event: CustomEvent<AutocompleteOption>): void {
		countryCode = event.detail.label;
	}

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
		<input type="hidden" name="avatarUrl" />
		<div class="flex justify-center">
			<input type="file" name="avatar" on:change={handleUpdateProfilePhoto} />
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label for="firstName">First Name</label>
		<input type="text" name="firstName" id="firstName" class="input" />
	</div>

	<div class="flex flex-col gap-1">
		<label for="lastName">Last Name</label>
		<input type="text" name="lastName" id="lastName" class="input" />
	</div>

	<div class="flex flex-col gap-1">
		<label for="">Mobile Number</label>

		<form action="?/sendOPTCode" class="flex flex-col gap-4" use:enhance method="post">
			<div class="flex gap-4">
				<div class="w-2/12">
					<input
						class="input autocomplete"
						type="search"
						name="autocomplete-search"
						bind:value={countryCode}
						placeholder="Country Code"
						use:popup={popupSettings}
					/>
					<div
						data-popup="popupAutocomplete"
						class="card w-full max-w-xs max-h-60 p-4 overflow-y-auto"
					>
						<Autocomplete
							bind:input={countryCode}
							options={countryOptions}
							on:selection={onPopupCountryCodeSelection}
						/>
					</div>
				</div>

				<div class="w-10/12">
					<input
						type="text"
						name="phoneNumber"
						class="input"
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
		<input type="text" name="codeToVerify" id="verifyCode" class="input" />
	</div>

	<input type="hidden" bind:value={countryCode} name="countryCode" />
	<input type="hidden" bind:value={phoneNumber} name="phoneNumber" />

	<button class="btn variant-filled-primary" type="submit">Go to my Dashboard</button>
</form>
