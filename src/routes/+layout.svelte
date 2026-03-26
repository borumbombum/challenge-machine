<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { appState } from '$lib/state.svelte';
	import { navigating } from '$app/stores';

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
