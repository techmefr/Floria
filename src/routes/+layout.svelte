<script lang="ts">
	import '$lib/technical/design-tokens/fonts';
	import '$lib/technical/design-tokens/tokens.css';
	import '$lib/technical/design-tokens/motion-keyframes.css';
	import { Defs } from '$lib/technical/design-tokens';

	let { children } = $props();
</script>

<Defs />

{@render children()}
