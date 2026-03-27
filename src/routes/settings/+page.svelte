<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';

	const themeCategories = [
		{
			name: 'Light',
			themes: ['light', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'pastel', 'fantasy', 'lemonade', 'winter', 'catppuccin']
		},
		{
			name: 'Dark',
			themes: ['dark', 'night', 'coffee', 'dracula', 'business', 'luxury', 'black', 'CMYK', 'acid', 'halloween', 'synthwave']
		},
		{
			name: 'Creative',
			themes: ['cyberpunk', 'retro', 'valentine', 'garden', 'forest', 'wireframe', 'autumn', 'lichess']
		}
	];

	let allThemes = [
		'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk',
		'valentine', 'halloween', 'garden', 'forest', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury',
		'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'catppuccin', 'lichess'
	];

	let selectedTheme = $state('forest');
	let expandedCategory = $state<string | null>('Creative');

	onMount(() => {
		const saved = localStorage.getItem('theme');
		if (saved && allThemes.includes(saved)) {
			selectedTheme = saved;
			document.documentElement.setAttribute('data-theme', saved);
		}
	});

	function changeTheme(theme: string) {
		selectedTheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}

	function toggleCategory(category: string) {
		expandedCategory = expandedCategory === category ? null : category;
	}
</script>

<svelte:head>
	<title>App Settings - Challenge Machine</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Header title="App Settings" backLink="/" />

	<!-- Settings Content -->
	<div class="flex-1 p-4 max-w-2xl mx-auto w-full">
		<!-- Appearance Section -->
		<div class="card bg-base-200 border border-base-300">
			<div class="card-body">
				<h2 class="card-title text-xl mb-4">🎨 Appearance</h2>
				
				<p class="text-base-content/70 mb-4">
					Choose a theme for the app. The selected theme will be applied across all pages.
				</p>

				<div class="space-y-4">
					{#each themeCategories as category}
						<div class="border border-base-300 rounded-lg overflow-hidden">
							<button
								class="w-full p-3 flex items-center justify-between bg-base-300 hover:bg-base-100 transition-colors"
								onclick={() => toggleCategory(category.name)}
							>
								<span class="font-medium">{category.name}</span>
								<svg 
									xmlns="http://www.w3.org/2000/svg" 
									width="20" 
									height="20" 
									viewBox="0 0 24 24" 
									fill="none" 
									stroke="currentColor" 
									stroke-width="2" 
									class="transition-transform {expandedCategory === category.name ? 'rotate-180' : ''}"
								>
									<path d="m6 9 6 6 6-6"/>
								</svg>
							</button>
							
							{#if expandedCategory === category.name}
								<div class="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-base-100">
									{#each category.themes as theme}
										<button
											class="btn {selectedTheme === theme ? 'btn-primary' : 'btn-ghost'} btn-sm"
											onclick={() => changeTheme(theme)}
										>
											{theme}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="mt-4 p-3 bg-base-300 rounded-lg">
					<p class="text-sm text-base-content/70">
						Current theme: <span class="font-bold text-primary">{selectedTheme}</span>
					</p>
				</div>
			</div>
		</div>

		<!-- More Settings Coming Soon -->
		<div class="mt-6">
			<div class="card bg-base-200/50 border border-base-300 border-dashed">
				<div class="card-body items-center text-center">
					<p class="text-base-content/50">More settings coming soon...</p>
				</div>
			</div>
		</div>
	</div>
</div>
