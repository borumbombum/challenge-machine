<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { appState } from '$lib/state.svelte';

	let { data } = $props();

	let saved = $derived($page.url.searchParams.get('saved') === 'true');

	function confirmDelete() {
		appState.showModal({
			title: 'Delete Challenge',
			message: 'Are you sure you want to delete this challenge? This action cannot be undone.',
			confirmText: 'Delete',
			cancelText: 'Cancel',
			type: 'danger',
			onConfirm: async () => {
				appState.submitting = true;
				const formData = new FormData();
				formData.append('action', 'reset');
				
				await fetch(`/challenge/${data.challenge.uuid}/settings`, {
					method: 'POST',
					body: formData
				});
				
				appState.submitting = false;
				goto('/?deleted=true');
			}
		});
	}
</script>

<div class="min-h-screen p-3 sm:p-4">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<a href="/challenge/{data.challenge.uuid}" class="btn btn-ghost btn-xs sm:btn-sm">← Back</a>
		<h1 class="text-lg sm:text-xl font-bold text-base-content">Settings</h1>
		<div class="w-12 sm:w-16"></div>
	</div>

	{#if saved}
		<div class="alert alert-success mb-4 bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white">
			<span>✅ Settings saved!</span>
		</div>
	{/if}

	<div class="card bg-base-200 border border-base-300 w-full max-w-md mx-auto">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title text-base-content mb-3 sm:mb-4">👥 Participants</h2>
			<div class="flex flex-wrap gap-2 mb-6">
				{#each data.challenge.participants as p}
					<div class="badge badge-lg badge-primary">{p}</div>
				{/each}
			</div>
			<p class="text-sm text-base-content/60 mb-6">Participants can only be changed when creating a new challenge.</p>

			<form method="POST" use:enhance>
				<!-- Prize -->
				<div class="form-control mb-6">
					<label class="label" for="prize">
						<span class="label-text text-base-content/80 font-bold">🏆 Prize</span>
					</label>
					<input
						type="text"
						id="prize"
						name="prize"
						value={data.challenge.prize}
						class="input input-bordered bg-base-300 border-base-300 text-base-content font-bold text-lg"
					/>
				</div>

				<!-- Km Goal -->
				<div class="form-control mb-6">
					<label class="label" for="km_goal">
						<span class="label-text text-base-content/80 font-bold">📏 Weekly Km Goal</span>
					</label>
					<input
						type="number"
						id="km_goal"
						name="km_goal"
						value={data.challenge.km_goal}
						min="1"
						step="1"
						class="input input-bordered bg-base-300 border-base-300 text-base-content"
					/>
				</div>

				<!-- Runs Goal -->
				<div class="form-control mb-6">
					<label class="label" for="runs_goal">
						<span class="label-text text-base-content/80 font-bold">🏃 Weekly Runs Goal</span>
					</label>
					<input
						type="number"
						id="runs_goal"
						name="runs_goal"
						value={data.challenge.runs_goal}
						min="1"
						step="1"
						class="input input-bordered bg-base-300 border-base-300 text-base-content"
					/>
				</div>

				<!-- Save Button -->
				<button
					type="submit"
					class="btn btn-primary w-full font-bold"
				>
					💾 Save Settings
				</button>
			</form>
		</div>
	</div>

	<!-- Reset Button -->
	<div class="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-base-300 max-w-md mx-auto">
		<button
			type="button"
			class="btn btn-outline btn-error btn-sm"
			onclick={confirmDelete}
		>
			🗑️ Delete This Challenge
		</button>
	</div>
</div>
