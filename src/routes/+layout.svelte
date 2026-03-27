<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { appState } from '$lib/state.svelte';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';

	const themes = [
		'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk',
		'valentine', 'halloween', 'garden', 'forest', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury',
		'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'catppuccin', 'lichess'
	];

	onMount(() => {
		const saved = localStorage.getItem('theme');
		if (saved && themes.includes(saved)) {
			document.documentElement.setAttribute('data-theme', saved);
		}
	});

	$effect(() => {
		if ($navigating) {
			appState.navigating = true;
		} else {
			appState.navigating = false;
		}
	});

	let { children } = $props();
</script>

<div class="min-h-screen">
	{@render children()}
</div>

<LoadingOverlay />
<Toast />
<Modal />
