<script lang="ts">
	import { page } from '$app/stores';
	import { appState } from '$lib/state.svelte';
	import { goto } from '$app/navigation';

	let deleted = $derived($page.url.searchParams.get('deleted') === 'true');

	$effect(() => {
		if (deleted) {
			appState.showToast('Challenge deleted');
			const url = new URL($page.url);
			url.searchParams.delete('deleted');
			goto(url.toString(), { replaceState: true });
		}
	});
</script>

<div class="min-h-screen p-3 sm:p-4 flex flex-col items-center text-center">
	<div class="w-full max-w-md pt-4 sm:pt-8">
		<div class="text-4xl sm:text-5xl mb-4 sm:mb-6">🏃‍♂️🏃‍♀️</div>
		
		<h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4">
			Running Challenge
		</h1>
		
		<p class="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6">
			Create a challenge with your friends. Set a goal for total runs and distance. 
			Everyone logs their runs. If you hit the goal together, you win the prize!
		</p>

		<div class="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 space-y-1 sm:space-y-2">
			<p>📅 7-day challenges</p>
			<p>👥 Any number of participants</p>
			<p>🏆 Custom prize</p>
			<p>📊 Track progress together</p>
		</div>

		<a
			href="/start"
			class="btn btn-md sm:btn-lg btn-primary bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white font-bold gap-2"
		>
			<span>🚀</span> Start New Challenge
		</a>

		<div class="mt-6 sm:mt-8">
			<a href="/history" class="btn btn-ghost btn-xs sm:btn-sm text-slate-500">
				📋 View Challenge History
			</a>
		</div>
	</div>
</div>