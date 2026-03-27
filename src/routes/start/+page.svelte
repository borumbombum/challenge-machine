<script lang="ts">
	import { enhance } from '$app/forms';
	import { appState } from '$lib/state.svelte';
	import Header from '$lib/components/Header.svelte';

	const funnyNames = ['Alex', 'Sam', 'Jordan', 'Riley', 'Morgan', 'Casey', 'Taylor', 'Jamie', 'Quinn', 'Avery', 'Charlie', 'Dakota'];
	
	function getRandomNames() {
		const shuffled = [...funnyNames].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 2);
	}
	
	let participants = $state(getRandomNames());

	let error = $state('');

	function addParticipant() {
		participants = [...participants, ''];
	}

	function removeParticipant(index: number) {
		if (participants.length > 1) {
			participants = participants.filter((_, i) => i !== index);
		}
	}
</script>

<Header title="Create Challenge" backLink="/" />

<div class="p-3 sm:p-4 max-w-2xl mx-auto">
	{#if error}
		<div class="alert alert-error mb-4">
			<span>{error}</span>
		</div>
	{/if}

	<form method="POST" use:enhance={() => {
		appState.submitting = true;
		return async ({ update }) => {
			await update();
			appState.submitting = false;
		};
	}}>
		<!-- Participants -->
		<div class="card bg-base-200 border border-base-300 mb-4">
			<div class="card-body p-4 sm:p-6">
				<h2 class="card-title text-base-content mb-4">👥 Participants</h2>
				
				<div class="space-y-3">
					{#each participants as _, i}
						<div class="flex gap-2">
							<input
								type="text"
								name="participant_{i}"
								bind:value={participants[i]}
								class="input input-sm sm:input-md input-bordered flex-1 bg-base-300 border-base-300 text-base-content"
								placeholder="Name (e.g., Flash, Bolt)"
							/>
							{#if participants.length > 1}
								<button
									type="button"
									class="btn btn-ghost text-error"
									onclick={() => removeParticipant(i)}
								>
									✕
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<button
					type="button"
					class="btn btn-ghost btn-sm mt-3 text-base-content/70"
					onclick={addParticipant}
				>
					+ Add Participant
				</button>
			</div>
		</div>

		<!-- Prize -->
		<div class="card bg-base-200 border border-base-300 mb-4">
			<div class="card-body p-4 sm:p-6">
				<h2 class="card-title text-base-content mb-3 sm:mb-4">🏆 Prize</h2>
				<input
					type="text"
					name="prize"
					class="input input-sm sm:input-md input-bordered w-full bg-base-300 border-base-300 text-base-content font-bold"
					placeholder="What are you playing for?"
					value="🎉 MYSTERY PRIZE 🎉"
				/>
			</div>
		</div>

		<!-- Goals -->
		<div class="card bg-base-200 border border-base-300 mb-4">
			<div class="card-body p-4 sm:p-6">
				<h2 class="card-title text-base-content mb-3 sm:mb-4">📊 Goals (7 days)</h2>
				
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="label" for="km_goal">
							<span class="label-text text-base-content/80">📏 Total Km</span>
						</label>
						<input
							type="number"
							id="km_goal"
							name="km_goal"
							class="input input-sm sm:input-md input-bordered w-full bg-base-300 border-base-300 text-base-content"
							value="30"
							min="1"
						/>
					</div>
					<div>
						<label class="label" for="runs_goal">
							<span class="label-text text-base-content/80">🏃 Total Runs</span>
						</label>
						<input
							type="number"
							id="runs_goal"
							name="runs_goal"
							class="input input-sm sm:input-md input-bordered w-full bg-base-300 border-base-300 text-base-content"
							value="6"
							min="1"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Submit -->
		<button
			type="submit"
			class="btn btn-primary btn-lg w-full font-bold gap-2"
			disabled={appState.submitting}
		>
			{#if appState.submitting}
				<span class="loading loading-spinner"></span>
				Creating...
			{:else}
				<span>🚀</span> Create Challenge
			{/if}
		</button>
	</form>
</div>
