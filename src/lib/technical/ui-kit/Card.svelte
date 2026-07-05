<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		strong?: boolean;
		class?: string;
		children: Snippet;
	};

	let { strong = false, class: className = '', children }: Props = $props();
</script>

<div class="card {className}" class:strong>
	{@render children()}
</div>

<style>
	.card {
		background: var(--color-surface-card);
		border: 1px solid var(--color-border-hairline);
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-card-plot);
		padding: 16px 18px;
	}

	.card.strong {
		background: var(--color-surface-card-strong);
	}
</style>
