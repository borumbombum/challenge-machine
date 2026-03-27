<script lang="ts">
	import { appState } from '$lib/state.svelte';
</script>

{#if appState.submitting || appState.navigating}
	<div class="fixed inset-0 bg-base-100/90 z-50 flex items-center justify-center">
		<div class="loading loading-spinner loading-lg text-primary"></div>
	</div>
{/if}
