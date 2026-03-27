<script lang="ts">
	import { enhance } from '$app/forms';
	import confetti from 'canvas-confetti';
	import { appState } from '$lib/state.svelte';
	import Header from '$lib/components/Header.svelte';

	let {
		data
	}: {
		data: {
			challenge: {
				uuid: string;
				participants: string[];
				prize: string;
				km_goal: number;
				runs_goal: number;
				start_date: string;
				end_date: string;
			} | null;
			stats: {
				total_runs: number;
				total_km: number;
			};
			activities: {
				id: number;
				participant: string;
				distance_km: number;
				date: string;
			}[];
			daysRemaining: number;
			isComplete: boolean;
			challengeEnded?: boolean;
			previousResult?: {
				prize: string;
				kmGoal: number;
				runsGoal: number;
				totalRuns: number;
				totalKm: number;
				won: boolean;
			};
		};
	} = $props();

	let showDetails = $state(false);
	let showLogRun = $state(false);
	let logParticipant = $state(data.challenge?.participants[0] || '');
	let logDistance = $state(5);
	let logDate = $state(new Date().toISOString().split('T')[0]);
	let hasCelebratedCompletion = $state(false);

	$effect(() => {
		if (showLogRun) {
			logDistance = 5;
			logDate = new Date().toISOString().split('T')[0];
			logParticipant = data.challenge?.participants[0] || '';
		}
	});

	function triggerLogConfetti() {
		confetti({
			particleCount: 50,
			spread: 70,
			origin: { y: 0.8 },
			colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
		});
	}

	function triggerCompletionConfetti() {
		const duration = 2000;
		const end = Date.now() + duration;

		(function frame() {
			confetti({
				particleCount: 5,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
			});
			confetti({
				particleCount: 5,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
			});

			if (Date.now() < end) {
				requestAnimationFrame(frame);
			}
		})();
	}

	$effect(() => {
		if ((data.isComplete || data.challengeEnded) && !hasCelebratedCompletion) {
			hasCelebratedCompletion = true;
			triggerCompletionConfetti();
		}
	});

	let kmGoal = $derived(data.challenge?.km_goal || 30);
	let runsGoal = $derived(data.challenge?.runs_goal || 6);
	let kmProgress = $derived(data.stats ? Math.min(100, (data.stats.total_km / kmGoal) * 100) : 0);
	let runsProgress = $derived(data.stats ? Math.min(100, (data.stats.total_runs / runsGoal) * 100) : 0);
</script>

<div class="min-h-screen flex flex-col">
	<Header title="Challenge" backLink="/">
		{#snippet rightSlot()}
			<a href="/challenge/{data.challenge?.uuid}/settings" class="btn btn-ghost btn-sm">
				⚙️
			</a>
		{/snippet}
	</Header>

	<div class="flex-1 p-3 sm:p-4 pb-20 sm:pb-4">
	{#if data.challengeEnded && data.previousResult && !data.challenge}
		<!-- Show only when challenge was fully ended and deleted -->
		<div class="alert {data.previousResult.won ? 'alert-success' : 'alert-error'} mb-4 sm:mb-6 bg-gradient-to-r {data.previousResult.won ? 'from-green-500 to-emerald-600' : 'from-red-500 to-orange-600'} border-0 text-white justify-center">
			<span class="text-2xl sm:text-3xl">{data.previousResult.won ? '🎉' : '😢'}</span>
			<span class="font-bold text-base sm:text-lg">{data.previousResult.won ? 'Challenge Complete - You Won!' : 'Challenge Ended'}</span>
		</div>
		
		<div class="text-center">
			<a href="/start" class="btn btn-primary btn-lg font-bold gap-2">
				<span>🚀</span> Start New Challenge
			</a>
		</div>
	{:else if data.challenge}
		<!-- Prize Hero -->
		<div class="mb-4 sm:mb-6 text-center">
			<div class="mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-widest text-base-content/70">
				The Goal
			</div>
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
				{data.challenge.prize}
			</h1>
		</div>

		<!-- Goals Display -->
		<div class="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-base-content/70">
			<div class="text-center">
				<div class="text-xl sm:text-2xl font-bold text-base-content">{runsGoal}</div>
				<div class="text-xs">runs</div>
			</div>
			<div class="text-base-content/50">|</div>
			<div class="text-center">
				<div class="text-xl sm:text-2xl font-bold text-base-content">{kmGoal}km</div>
				<div class="text-xs">distance</div>
			</div>
		</div>

		<!-- Days Remaining -->
		<div class="text-center mb-3 sm:mb-4">
			<div class="badge badge-md sm:badge-lg badge-warning gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3">
				<span>⏰</span>
				<span class="text-xs sm:text-sm">{data.daysRemaining} day{data.daysRemaining !== 1 ? 's' : ''} remaining</span>
			</div>
		</div>

		{#if data.isComplete}
			<!-- Celebration -->
			<div class="alert alert-success mb-3 sm:mb-4 bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white justify-center">
				<span class="text-xl sm:text-2xl">🎉</span>
				<span class="font-bold text-sm sm:text-base">CHALLENGE COMPLETE!</span>
			</div>
		{/if}

		<!-- Progress Cards -->
		<div class="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
			<!-- Runs Progress -->
			<div class="card bg-base-200 border border-base-300">
				<div class="card-body p-3 sm:p-4">
					<h3 class="card-title text-base-content/80 text-xs sm:text-sm uppercase tracking-wider">
						🏃 Runs
					</h3>
					<div class="text-2xl sm:text-3xl font-black text-base-content mb-1 sm:mb-2">
						{data.stats?.total_runs || 0}<span class="text-base-content/50 text-base sm:text-xl">/{runsGoal}</span>
					</div>
					<progress
						class="progress progress-success w-full h-4"
						value={data.stats?.total_runs || 0}
						max={runsGoal}
					></progress>
					<div class="text-xs text-base-content/70 mt-1">
						{Math.round(runsProgress)}% complete
					</div>
				</div>
			</div>

			<!-- Km Progress -->
			<div class="card bg-base-200 border border-base-300">
				<div class="card-body p-3 sm:p-4">
					<h3 class="card-title text-base-content/80 text-xs sm:text-sm uppercase tracking-wider">
						📏 Distance
					</h3>
					<div class="text-2xl sm:text-3xl font-black text-base-content mb-1 sm:mb-2">
						{data.stats?.total_km?.toFixed(1) || 0}<span class="text-base-content/50 text-base sm:text-xl">/{kmGoal}km</span>
					</div>
					<progress
						class="progress progress-primary w-full h-4"
						value={data.stats?.total_km || 0}
						max={kmGoal}
					></progress>
					<div class="text-xs text-base-content/70 mt-1">
						{Math.round(kmProgress)}% complete
					</div>
				</div>
			</div>
		</div>

		<!-- Details Toggle -->
		<div class="text-center mb-3 sm:mb-4">
			<button
				class="btn btn-ghost btn-xs sm:btn-sm text-base-content/70"
				onclick={() => showDetails = !showDetails}
			>
				{showDetails ? '👁️' : '👁️'} {showDetails ? 'Hide' : 'Show'} Details
			</button>
		</div>

		{#if showDetails}
			<!-- Individual Stats -->
			<div class="grid grid-cols-2 sm:grid-cols-{Math.min(data.challenge.participants.length, 3)} gap-3 sm:gap-4 mb-3 sm:mb-4">
				{#each data.challenge.participants as participant}
					{@const participantKey = participant.replace(/\s/g, '_')}
					{@const runs = data.stats ? (data.stats as any)[`runs_${participantKey}`] || 0 : 0}
					{@const kms = data.stats ? (data.stats as any)[`km_${participantKey}`] || 0 : 0}
					<div class="card bg-base-200/50 border border-base-300">
						<div class="card-body p-3 sm:p-4 text-center">
							<h3 class="text-lg sm:text-2xl font-bold text-primary">{participant}</h3>
							<div class="text-lg sm:text-2xl font-black text-base-content">
								{runs} runs
							</div>
							<div class="text-base-content/70 text-sm">
								{kms.toFixed(1)} km
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if !data.isComplete}
			<!-- Log Run Button -->
			<div class="fixed bottom-6 right-4 z-40">
				<button
					class="btn btn-primary btn-lg rounded-full w-14 h-14 p-0 shadow-lg shadow-primary/30 hover:shadow-primary/50"
					onclick={() => showLogRun = true}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>
		{/if}

		<!-- Recent Activities -->
		{#if data.activities.length > 0}
			<div class="mt-6">
				<h3 class="text-lg font-bold text-base-content/80 mb-4">Recent Activities</h3>
				<div class="space-y-2">
					{#each data.activities.slice(0, 5) as activity}
						<div class="flex items-center justify-between bg-base-200/50 rounded-lg p-3">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-primary/20 text-primary">
									{activity.participant.charAt(0).toUpperCase()}
								</div>
								<div>
									<div class="font-bold text-base-content">{activity.participant} ran</div>
									<div class="text-xs text-base-content/70">{activity.date}</div>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<div class="text-xl font-black text-success">
									+{activity.distance_km}km
								</div>
								<form method="POST" action="?/deleteActivity" use:enhance={() => {
									appState.submitting = true;
									return async ({ update }) => {
										await update();
										appState.submitting = false;
									};
								}}>
									<input type="hidden" name="activityId" value={activity.id} />
									<button type="submit" class="btn btn-ghost btn-xs text-error hover:text-error/70">
										✕
									</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Log Run Modal -->
		{#if showLogRun}
			<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
				<div class="card bg-base-200 border border-base-300 w-full max-w-md">
					<div class="card-body">
						<h2 class="card-title text-base-content mb-4">🏃 Log Your Run</h2>
						
						<form method="POST" action="?/logActivity" use:enhance={() => {
							appState.submitting = true;
							return async ({ update }) => {
								await update();
								appState.submitting = false;
								triggerLogConfetti();
								showLogRun = false;
							};
						}}>
							<!-- Participant -->
							<div class="form-control mb-4">
								<label class="label" for="participant">
									<span class="label-text text-base-content/80">Who ran?</span>
								</label>
								<select
									id="participant"
									name="participant"
									bind:value={logParticipant}
									class="select select-bordered bg-base-300 border-base-300 text-base-content"
								>
									{#each data.challenge.participants as p}
										<option value={p}>{p}</option>
									{/each}
								</select>
							</div>

							<!-- Distance -->
							<div class="form-control mb-4">
								<label class="label" for="distance_km">
									<span class="label-text text-base-content/80">Distance (km)</span>
								</label>
								<input
									type="number"
									id="distance_km"
									name="distance_km"
									bind:value={logDistance}
									step="0.5"
									min="0.5"
									class="input input-bordered bg-base-300 border-base-300 text-base-content"
								/>
							</div>

							<!-- Date -->
							<div class="form-control mb-4">
								<label class="label" for="date">
									<span class="label-text text-base-content/80">Date</span>
								</label>
								<input
									type="date"
									id="date"
									name="date"
									bind:value={logDate}
									class="input input-bordered bg-base-300 border-base-300 text-base-content"
								/>
							</div>

							<!-- Buttons -->
							<div class="flex gap-2">
								<button
									type="button"
									class="btn btn-ghost flex-1"
									onclick={() => showLogRun = false}
								>
									Cancel
								</button>
								<button
									type="submit"
									class="btn btn-primary flex-1 font-bold"
								>
									🎉 Log Run
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		{/if}
	{/if}
	</div>
</div>
