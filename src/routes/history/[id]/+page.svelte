<script lang="ts">
	import { goto } from '$app/navigation';
	import { appState } from '$lib/state.svelte';

	let { data } = $props();

	function confirmDelete() {
		appState.showModal({
			title: 'Delete Challenge',
			message: 'Are you sure you want to delete this challenge from history? This cannot be undone.',
			confirmText: 'Delete',
			cancelText: 'Cancel',
			type: 'danger',
			onConfirm: async () => {
				appState.submitting = true;
				await fetch(`/history/${data.challenge.id}`, {
					method: 'POST'
				});
				appState.submitting = false;
				goto('/history');
			}
		});
	}
</script>

<div class="min-h-screen p-3 sm:p-4">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<a href="/history" class="btn btn-ghost btn-xs sm:btn-sm">← Back</a>
		<h1 class="text-lg sm:text-xl font-bold text-base-content">Challenge Details</h1>
		<button class="btn btn-ghost btn-xs text-error" onclick={confirmDelete}>
			🗑️
		</button>
	</div>

	<!-- Result Banner -->
	<div class="alert {data.challenge.won ? 'alert-success' : 'alert-error'} mb-4 bg-gradient-to-r {data.challenge.won ? 'from-green-500 to-emerald-600' : 'from-red-500 to-orange-600'} border-0 text-white justify-center">
		<span class="text-2xl sm:text-3xl">{data.challenge.won ? '🎉' : '😢'}</span>
		<span class="font-bold text-base sm:text-lg">{data.challenge.won ? 'CHALLENGE WON!' : 'CHALLENGE NOT COMPLETED'}</span>
	</div>

	<!-- Prize -->
	<div class="text-center mb-4 sm:mb-6">
		<div class="mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-widest text-base-content/70">
			The Goal
		</div>
		<h1 class="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
			{data.challenge.prize}
		</h1>
	</div>

	<!-- Dates -->
	<div class="text-center mb-4 sm:mb-6">
		<div class="badge badge-md sm:badge-lg badge-outline">
			{data.challenge.start_date} - {data.challenge.end_date}
		</div>
	</div>

	<!-- Participants -->
	<div class="card bg-base-200 border border-base-300 mb-4 w-full max-w-md mx-auto">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title text-base-content mb-3 sm:mb-4">👥 Participants</h2>
			<div class="flex flex-wrap gap-2 justify-center">
				{#each data.challenge.participants as p}
					<span class="badge badge-lg badge-primary">{p}</span>
				{/each}
			</div>
		</div>
	</div>

	<!-- Results -->
	<div class="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full max-w-md mx-auto">
		<div class="card bg-base-200 border border-base-300">
			<div class="card-body p-3 sm:p-4">
				<h3 class="card-title text-base-content/80 text-xs sm:text-sm uppercase tracking-wider">
					🏃 Runs
				</h3>
				<div class="text-2xl sm:text-3xl font-black text-base-content mb-1 sm:mb-2">
					{data.challenge.total_runs}<span class="text-base-content/50 text-base sm:text-xl">/{data.challenge.runs_goal}</span>
				</div>
				<progress
					class="progress {data.challenge.won ? 'progress-success' : 'progress-error'} w-full h-3 sm:h-4"
					value={data.challenge.total_runs}
					max={data.challenge.runs_goal}
				></progress>
			</div>
		</div>

		<div class="card bg-base-200 border border-base-300">
			<div class="card-body p-3 sm:p-4">
				<h3 class="card-title text-base-content/80 text-xs sm:text-sm uppercase tracking-wider">
					📏 Distance
				</h3>
				<div class="text-2xl sm:text-3xl font-black text-base-content mb-1 sm:mb-2">
					{data.challenge.total_km.toFixed(1)}<span class="text-base-content/50 text-base sm:text-xl">/{data.challenge.km_goal}km</span>
				</div>
				<progress
					class="progress {data.challenge.won ? 'progress-success' : 'progress-error'} w-full h-3 sm:h-4"
					value={data.challenge.total_km}
					max={data.challenge.km_goal}
				></progress>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex justify-center gap-4">
		<a href="/history" class="btn btn-outline btn-md border-base-300 gap-2">
			📋 Back to History
		</a>
		<a href="/start" class="btn btn-primary btn-md bg-gradient-to-r from-green-500 to-emerald-600 border-0">
			🚀 New Challenge
		</a>
	</div>
</div>
