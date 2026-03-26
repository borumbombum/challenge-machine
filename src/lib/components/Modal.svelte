<script lang="ts">
	import { appState } from '$lib/state.svelte';

	let modal = $derived(appState.modal);
</script>

{#if modal && modal.open}
	<dialog class="modal modal-open">
		<div class="modal-box bg-slate-800 border border-slate-700">
			<h3 class="font-bold text-lg text-white">{modal.title}</h3>
			<p class="py-4 text-slate-300">{modal.message}</p>
			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => appState.closeModal()}
				>
					{modal.cancelText}
				</button>
				<button
					class="btn {modal.type === 'danger' ? 'btn-error' : modal.type === 'warning' ? 'btn-warning' : 'btn-primary'}"
					onclick={() => {
						const onConfirm = modal.onConfirm;
						appState.closeModal();
						setTimeout(() => {
							if (onConfirm) onConfirm();
						}, 50);
					}}
				>
					{modal.confirmText}
				</button>
			</div>
		</div>
	</dialog>
{/if}
