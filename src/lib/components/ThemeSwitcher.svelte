<script lang="ts">
	import { onMount } from 'svelte';

	const themes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter',
		'catppuccin',
		'lichess'
	];

	let selectedTheme = $state('night');
	let showModal = $state(false);

	onMount(() => {
		const saved = localStorage.getItem('theme');
		if (saved && themes.includes(saved)) {
			selectedTheme = saved;
			document.documentElement.setAttribute('data-theme', saved);
		}
	});

	function changeTheme(theme: string) {
		selectedTheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		showModal = false;
	}
</script>

<!-- Mobile: Button to open modal -->
<button 
	class="btn btn-ghost btn-sm gap-1 sm:hidden"
	onclick={() => showModal = true}
>
	<span>◐</span>
	<span>{selectedTheme}</span>
</button>

<!-- Desktop: Dropdown -->
<div class="dropdown dropdown-end z-50 hidden sm:block">
	<div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-1">
		<span>◐</span>
		<span class="hidden sm:inline">{selectedTheme}</span>
		<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
	</div>
	<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-40 max-h-80 overflow-y-auto">
		{#each themes as theme}
			<li>
				<button
					class="btn btn-sm btn-ghost justify-between"
					class:btn-active={selectedTheme === theme}
					onclick={() => changeTheme(theme)}
				>
					<span>{theme}</span>
					{#if selectedTheme === theme}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</div>

<!-- Mobile Modal - Fixed fullscreen to break out of navbar -->
{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-[100] grid place-items-center p-4">
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/50" onclick={() => showModal = false}></div>
		<!-- Modal Content -->
		<div class="relative bg-base-100 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col self-center">
			<div class="p-4 border-b border-base-300 flex items-center justify-between shrink-0">
				<h3 class="font-bold text-lg">Choose Theme</h3>
				<button class="btn btn-sm btn-ghost" onclick={() => showModal = false}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
				</button>
			</div>
			<div class="p-4 overflow-y-auto flex-1">
				<div class="grid grid-cols-2 gap-2">
					{#each themes as theme}
						<button
							class="btn {selectedTheme === theme ? 'btn-primary' : 'btn-ghost'} justify-between"
							onclick={() => changeTheme(theme)}
						>
							<span>{theme}</span>
							{#if selectedTheme === theme}
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
