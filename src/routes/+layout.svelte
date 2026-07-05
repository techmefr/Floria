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
	<main class="app-content">
		{@render children()}
	</main>
	<NavBar />
</div>

<style>
	.app-frame {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--gradient-page);
		isolation: isolate;
	}

	.app-content {
		flex: 1;
		overflow-y: auto;
		padding: calc(16px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) 16px
			calc(16px + env(safe-area-inset-left));
	}
</style>
