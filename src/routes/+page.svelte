<script lang="ts">
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
</script>

<svelte:head>
	<title>Homepage - Challenge Machine</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Navbar -->
	<nav class="navbar bg-base-200/80 backdrop-blur sticky top-0 z-50 border-b border-base-300">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl gap-2">
				<span class="text-2xl">🏃</span>
				<span class="font-bold">Challenge</span>
			</a>
		</div>
		<div class="flex-none gap-2">
			<ThemeSwitcher />
			<a href="/history" class="btn btn-ghost btn-sm gap-1">
				<span>📋</span>
				<span class="hidden sm:inline">History</span>
			</a>
			<a href="/settings" class="btn btn-ghost btn-sm gap-1">
				<span>⚙️</span>
				<span class="hidden sm:inline">Settings</span>
			</a>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="hero min-h-[70vh] bg-base-200">
		<div class="hero-overlay bg-gradient-to-b from-base-200/50 to-base-100"></div>
		<div class="hero-content text-center px-4">
			<div class="max-w-2xl">
				<!-- Animated Emojis -->
				<div class="text-6xl sm:text-8xl mb-4 animate-bounce">
					🏃‍♂️🏃‍♀️
				</div>
				
				<h1 class="text-4xl sm:text-6xl md:text-7xl font-black leading-tight mb-4">
					RUN
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">TOGETHER</span>
					<br />
					WIN TOGETHER
				</h1>
				
				<p class="text-lg sm:text-xl text-base-content/70 mb-8 max-w-lg mx-auto">
					Create a 7-day challenge with your friends. 
					Set goals. Track progress. Claim the prize!
				</p>
				
				<a
					href="/start"
					class="btn btn-lg btn-primary gap-2 bg-gradient-to-r from-primary to-secondary border-0 hover:scale-105 transition-transform"
				>
					<span>🚀</span> Start Challenge
				</a>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="bg-base-300 py-6">
		<div class="container mx-auto px-4">
			<div class="stats stats-vertical sm:stats-horizontal shadow w-full">
				<div class="stat">
					<div class="stat-figure text-primary">
						<span class="text-3xl">📅</span>
					</div>
					<div class="stat-title">Duration</div>
					<div class="stat-value text-lg">7 Days</div>
				</div>
				
				<div class="stat">
					<div class="stat-figure text-secondary">
						<span class="text-3xl">👥</span>
					</div>
					<div class="stat-title">Participants</div>
					<div class="stat-value text-lg">Any Number</div>
				</div>
				
				<div class="stat">
					<div class="stat-figure text-accent">
						<span class="text-3xl">🏆</span>
					</div>
					<div class="stat-title">Prize</div>
					<div class="stat-value text-lg">Custom</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section class="py-12 sm:py-20 bg-base-100">
		<div class="container mx-auto px-4">
			<h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
				How It Works
			</h2>
			
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
				<!-- Step 1 -->
				<div class="card bg-base-200 shadow-xl hover:-translate-y-1 transition-transform duration-300">
					<div class="card-body items-center text-center">
						<div class="text-5xl mb-4">1️⃣</div>
						<h3 class="card-title text-xl">CREATE</h3>
						<p class="text-base-content/70">
							Set your prize, goals for runs and kilometers, and invite friends to join.
						</p>
					</div>
				</div>

				<!-- Arrow (desktop only) -->
				<div class="hidden sm:flex items-center justify-center">
					<span class="text-4xl text-primary">→</span>
				</div>

				<!-- Step 2 -->
				<div class="card bg-base-200 shadow-xl hover:-translate-y-1 transition-transform duration-300">
					<div class="card-body items-center text-center">
						<div class="text-5xl mb-4">2️⃣</div>
						<h3 class="card-title text-xl">LOG</h3>
						<p class="text-base-content/70">
							Everyone logs their runs throughout the week. Track progress together in real-time.
						</p>
					</div>
				</div>

				<!-- Arrow (desktop only) -->
				<div class="hidden sm:flex items-center justify-center">
					<span class="text-4xl text-primary">→</span>
				</div>

				<!-- Step 3 -->
				<div class="card bg-base-200 shadow-xl hover:-translate-y-1 transition-transform duration-300">
					<div class="card-body items-center text-center">
						<div class="text-5xl mb-4">3️⃣</div>
						<h3 class="card-title text-xl">WIN</h3>
						<p class="text-base-content/70">
							Hit your goals together and claim the prize! Celebrate your team victory.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-12 sm:py-20 bg-base-200">
		<div class="container mx-auto px-4 text-center">
			<h2 class="text-2xl sm:text-3xl font-bold mb-4">
				Ready to challenge your friends?
			</h2>
			<p class="text-base-content/70 mb-8 max-w-lg mx-auto">
				Start a new challenge today. It's free and takes less than a minute to set up.
			</p>
			<a
				href="/start"
				class="btn btn-lg btn-primary gap-2 bg-gradient-to-r from-primary to-secondary border-0"
			>
				<span>🚀</span> Start New Challenge
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="footer footer-center p-6 bg-base-300 text-base-content">
		<div>
			<p class="text-sm -mb-1">
				Powered by <a href="https://www.cubiq.lat" class="link" target="_blank" rel="noopener noreferrer">Cubiq</a>
			</p>
			<p class="text-sm">
				Built with Opencode • v{__APP_VERSION__}
			</p>
		</div>
	</footer>
</div>
