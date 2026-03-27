<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { appState } from '$lib/state.svelte';
	import { fade, slide } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';

	let { data } = $props();

	let ongoing = $derived(data.active.filter((c: any) => !c.hasWon));
	let completed = $derived(data.active.filter((c: any) => c.hasWon));

	let deleteUuid = $state('');
	let deleteId = $state<number | null>(null);

	function deleteActiveChallenge(uuid: string) {
		deleteUuid = uuid;
		deleteId = null;
		appState.showModal({
			title: 'Delete Challenge',
			message: 'Are you sure you want to delete this challenge?',
			confirmText: 'Delete',
			cancelText: 'Cancel',
			type: 'danger',
			onConfirm: () => {
				// Form will submit via use:enhance
				const form = document.getElementById('delete-active-form') as HTMLFormElement;
				form.requestSubmit();
			}
		});
	}

	function deletePastChallenge(id: number) {
		deleteId = id;
		deleteUuid = '';
		appState.showModal({
			title: 'Delete Challenge',
			message: 'Are you sure you want to delete this challenge from history?',
			confirmText: 'Delete',
			cancelText: 'Cancel',
			type: 'danger',
			onConfirm: () => {
				const form = document.getElementById('delete-past-form') as HTMLFormElement;
				form.requestSubmit();
			}
		});
	}

	function handleDeleteSuccess() {
		appState.showToast('Challenge deleted');
		goto('/history', { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>History - Challenge Machine</title>
</svelte:head>

<!-- Hidden forms for deletion -->
<form id="delete-active-form" method="POST" action="/history?/deleteActive" use:enhance={() => {
	return async ({ result }) => {
		if (result.type === 'success') {
			handleDeleteSuccess();
		}
	};
}}>
	<input type="hidden" name="uuid" value={deleteUuid} />
</form>

<form id="delete-past-form" method="POST" action="/history/{deleteId}" use:enhance={() => {
	return async ({ result }) => {
		if (result.type === 'success') {
			handleDeleteSuccess();
		}
	};
}}>
</form>

<div class="min-h-screen flex flex-col">
	<Header title="Challenge History" backLink="/" />

	<div class="flex-1 p-3 sm:p-4">

	{#if data.history.length === 0 && data.active.length === 0}
		<div class="text-center py-12 sm:py-16">
			<div class="text-4xl sm:text-6xl mb-3 sm:mb-4">📋</div>
			<h2 class="text-lg sm:text-xl font-bold text-base-content mb-2">No History Yet</h2>
			<p class="text-base-content/70 text-sm sm:text-base">Complete your first challenge to see it here!</p>
			<a href="/start" class="btn btn-primary btn-sm sm:btn-md mt-4">Start Your First Challenge</a>
		</div>
	{:else}
		<!-- Ongoing Challenges -->
		{#if ongoing.length > 0}
			<div class="mb-6 sm:mb-8">
				<h2 class="text-base sm:text-lg font-bold text-base-content mb-3 sm:mb-4">🔥 Active Challenges</h2>
				<div class="space-y-3 sm:space-y-4">
					{#each ongoing as challenge (challenge.uuid)}
						<div class="card bg-base-200 border border-base-300 hover:border-warning transition-colors" transition:slide={{ duration: 300 }}>
							<div class="card-body p-3 sm:p-4">
								<div class="flex items-center justify-between mb-2">
									<a href="/challenge/{challenge.uuid}" class="flex-1">
										<div class="text-xs sm:text-sm text-base-content/70">
											{challenge.start_date} - {challenge.end_date}
										</div>
									</a>
									<div class="flex items-center gap-2">
										<div class="badge badge-warning badge-sm sm:badge-md">
											ACTIVE
										</div>
										<button class="btn btn-xs btn-circle bg-error/20 text-error hover:bg-error hover:text-white border-0" onclick={() => deleteActiveChallenge(challenge.uuid)}>
											✕
										</button>
									</div>
								</div>
								
								<a href="/challenge/{challenge.uuid}" class="block">
									<h3 class="text-base sm:text-lg font-bold text-base-content mb-2">
										{challenge.prize}
									</h3>

									<div class="flex flex-wrap gap-1 mb-2 sm:mb-3">
										{#each challenge.participants as p}
											<span class="badge badge-outline badge-xs sm:badge-sm">{p}</span>
										{/each}
									</div>
									
									<div class="space-y-2 text-xs sm:text-sm">
									<div>
										<div class="flex justify-between text-base-content/70 mb-1">
											<span>🏃 Runs</span>
											{#if (challenge.total_runs || 0) >= challenge.runs_goal}
												<span class="font-bold text-success">Completed</span>
											{:else}
												<span class="font-bold text-base-content">{challenge.total_runs || 0}/{challenge.runs_goal}</span>
											{/if}
										</div>
										<progress class="progress progress-success w-full h-2" value={challenge.total_runs || 0} max={challenge.runs_goal}></progress>
									</div>
									<div>
										<div class="flex justify-between text-base-content/70 mb-1">
											<span>📏 Distance</span>
											{#if (challenge.total_km || 0) >= challenge.km_goal}
												<span class="font-bold text-success">Completed</span>
											{:else}
												<span class="font-bold text-base-content">{challenge.total_km?.toFixed(1) || 0}/{challenge.km_goal}km</span>
											{/if}
										</div>
										<progress class="progress progress-primary w-full h-2" value={challenge.total_km || 0} max={challenge.km_goal}></progress>
									</div>
								</div>
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Completed Challenges -->
		{#if completed.length > 0}
			<div class="mb-6 sm:mb-8">
				<h2 class="text-base sm:text-lg font-bold text-base-content mb-3 sm:mb-4">🏆 Completed</h2>
				<div class="space-y-3 sm:space-y-4">
					{#each completed as challenge (challenge.uuid)}
						<div class="card bg-base-200 border border-base-300 hover:border-warning transition-colors" transition:slide={{ duration: 300 }}>
							<div class="card-body p-3 sm:p-4">
								<div class="flex items-center justify-between mb-2">
									<a href="/challenge/{challenge.uuid}" class="flex-1">
										<div class="text-xs sm:text-sm text-base-content/70">
											{challenge.start_date} - {challenge.end_date}
										</div>
									</a>
									<div class="flex items-center gap-2">
										<div class="badge badge-success badge-sm sm:badge-md">
											🏆 WON
										</div>
										<button class="btn btn-xs btn-circle bg-error/20 text-error hover:bg-error hover:text-white border-0" onclick={() => deleteActiveChallenge(challenge.uuid)}>
											✕
										</button>
									</div>
								</div>
								
								<a href="/challenge/{challenge.uuid}" class="block">
									<h3 class="text-base sm:text-lg font-bold text-base-content mb-2">
										{challenge.prize}
									</h3>

									<div class="flex flex-wrap gap-1 mb-2 sm:mb-3">
										{#each challenge.participants as p}
											<span class="badge badge-outline badge-xs sm:badge-sm">{p}</span>
										{/each}
									</div>
									
									<div class="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
										<div class="bg-base-300/50 rounded p-2">
											<div class="text-base-content/70">Runs</div>
											<div class="font-bold text-base-content">
												{challenge.total_runs} / {challenge.runs_goal}
											</div>
										</div>
										<div class="bg-base-300/50 rounded p-2">
											<div class="text-base-content/70">Distance</div>
											<div class="font-bold text-base-content">
												{challenge.total_km?.toFixed(1) || 0} / {challenge.km_goal}km
											</div>
										</div>
									</div>
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Past Challenges -->
		{#if data.history.length > 0}
			<div>
				<h2 class="text-base sm:text-lg font-bold text-base-content mb-3 sm:mb-4">📜 Past Challenges</h2>
				<div class="space-y-3 sm:space-y-4">
					{#each data.history as challenge (challenge.id)}
						<div class="card bg-base-200 border border-base-300 hover:border-base-content/50 transition-colors" transition:slide={{ duration: 300 }}>
							<div class="card-body p-3 sm:p-4">
								<div class="flex items-center justify-between mb-2">
									<a href="/history/{challenge.id}" class="flex-1">
										<div class="text-xs sm:text-sm text-base-content/70">
											{challenge.start_date} - {challenge.end_date}
										</div>
									</a>
									<div class="flex items-center gap-2">
										<div class="badge {challenge.won ? 'badge-success' : 'badge-error'} badge-sm sm:badge-md">
											{challenge.won ? '🏆 WON' : '❌ LOST'}
										</div>
										<button class="btn btn-xs btn-circle bg-error/20 text-error hover:bg-error hover:text-white border-0" onclick={() => deletePastChallenge(challenge.id)}>
											✕
										</button>
									</div>
								</div>
								
								<a href="/history/{challenge.id}" class="block">
									<h3 class="text-base sm:text-lg font-bold text-base-content mb-2">
										{challenge.prize}
									</h3>

									<div class="flex flex-wrap gap-1 mb-2 sm:mb-3">
										{#each challenge.participants as p}
											<span class="badge badge-outline badge-xs sm:badge-sm">{p}</span>
										{/each}
									</div>
									
									<div class="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
										<div class="bg-base-300/50 rounded p-2">
											<div class="text-base-content/70">Runs</div>
											<div class="font-bold text-base-content">
												{challenge.total_runs} / {challenge.runs_goal}
											</div>
										</div>
										<div class="bg-base-300/50 rounded p-2">
											<div class="text-base-content/70">Distance</div>
											<div class="font-bold text-base-content">
												{challenge.total_km.toFixed(1)} / {challenge.km_goal}km
											</div>
										</div>
									</div>
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
	</div>
</div>
