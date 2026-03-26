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

	onMount(() => {
		const saved = localStorage.getItem('theme');
		if (saved && themes.includes(saved)) {
			selectedTheme = saved;
			document.documentElement.setAttribute('data-theme', saved);
		}
	});

	function changeTheme(theme: string) {
		console.log('Changing theme to:', theme);
		selectedTheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		
		// Force close dropdown by removing focus
		const btn = document.activeElement as HTMLElement;
		btn?.blur();
	}
</script>

<div class="dropdown dropdown-end z-50">
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
