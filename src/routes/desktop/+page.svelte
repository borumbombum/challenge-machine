<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<Header title="Desktop Detected" backLink="/" />

<div class="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
	<div class="text-6xl mb-6">🚫</div>
	<h1 class="text-2xl font-bold text-base-content mb-4">Whoa there, big screen!</h1>
	<p class="text-lg text-base-content/70 mb-2">
		This running app is meant for your phone 📱
	</p>
	<p class="text-base-content/60">
		Go grab your mobile and run! 🏃
	</p>
</div>