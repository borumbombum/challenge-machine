<script lang="ts">
	import { appState } from '$lib/state.svelte';
</script>

{#if appState.toast}
	<div class="fixed top-4 left-1/2 -translate-x-1/2 z-50">
		<div class="alert {appState.toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg animate-fade-in">
			<span>{appState.toast.type === 'success' ? '✓' : '✕'}</span>
			<span>{appState.toast.message}</span>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}
</style>
