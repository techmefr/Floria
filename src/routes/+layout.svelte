<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import '$lib/technical/design-tokens/fonts';
	import '$lib/technical/design-tokens/tokens.css';
	import '$lib/technical/design-tokens/motion-keyframes.css';
	import { Defs } from '$lib/technical/design-tokens';
	import {
		applyFontScale,
		applyHighContrast,
		applyReduceMotion,
		effectiveReduceMotion
	} from '$lib/technical/accessibility';
	import NavBar from './NavBar.svelte';
	import { createAppStores, setAppStores } from './appStores';

	let { children } = $props();

	const stores = createAppStores();
	setAppStores(stores);

	const preferences = stores.preferences.preferences;

	onMount(() => {
		void stores.habits.load();
		void stores.session.load();
		void stores.preferences.load();
	});

	$effect(() => {
		const prefs = $preferences;
		const root = document.documentElement;
		applyFontScale(root, prefs.fontScale);
		applyHighContrast(root, prefs.highContrast);
		applyReduceMotion(
			root,
			effectiveReduceMotion(prefs.reduceMotion, prefersReducedMotion.current)
		);
	});
</script>

<Defs />

<div class="app-frame">
	<div class="app-scroll">
		<main class="app-content">
			{@render children()}
		</main>
	</div>
	<NavBar />
</div>

<style>
	.app-frame {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		background: var(--gradient-page);
		isolation: isolate;
	}

	.app-scroll {
		flex: 1;
		overflow-y: auto;
		display: flex;
		justify-content: center;
	}

	.app-content {
		width: 100%;
		max-width: 640px;
		padding: calc(16px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) 16px
			calc(16px + env(safe-area-inset-left));
	}

	@media (min-width: 900px) {
		.app-content {
			max-width: 760px;
			padding-top: calc(32px + env(safe-area-inset-top));
			padding-bottom: 32px;
		}
	}
</style>
