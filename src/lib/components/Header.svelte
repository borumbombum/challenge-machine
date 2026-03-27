<script lang="ts">
	import type { Snippet } from 'svelte';

	let { 
		title, 
		backLink = '/',
		rightSlot
	}: { 
		title: string, 
		backLink?: string,
		rightSlot?: Snippet
	} = $props();
</script>

<nav class="navbar bg-base-200/80 backdrop-blur sticky top-0 z-50 border-b border-base-300">
	<div class="flex-1">
		<a href={backLink} class="btn btn-ghost text-xl gap-2">
			<span>←</span>
			<span class="font-bold">{title}</span>
		</a>
	</div>
	{#if rightSlot}
		<div class="flex-none">
			{@render rightSlot()}
		</div>
	{/if}
</nav>
