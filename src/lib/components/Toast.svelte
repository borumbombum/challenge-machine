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
			transform: translateX(-50%) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}
</style>
