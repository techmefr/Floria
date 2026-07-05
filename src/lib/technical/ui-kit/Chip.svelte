<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		isActive?: boolean;
		accentColor?: string;
		onclick?: () => void;
		icon?: Snippet;
		children: Snippet;
	};

	let {
		isActive = false,
		accentColor = 'var(--color-accent)',
		onclick,
		icon,
		children
	}: Props = $props();
</script>

<button
	type="button"
	class="chip"
	class:active={isActive}
	style:border-color={isActive ? accentColor : 'var(--color-border-hairline)'}
	{onclick}
>
	{#if icon}
		<span class="icon">{@render icon()}</span>
	{/if}
	<span class="label">{@render children()}</span>
</button>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		padding: 6px 14px 6px 8px;
		border: 1.5px solid var(--color-border-hairline);
		border-radius: var(--radius-pill);
		background: var(--color-surface-card);
		font-family: var(--font-body);
		font-size: var(--text-body);
		color: var(--color-text-body);
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.chip.active {
		box-shadow: 0 4px 10px rgba(120, 110, 80, 0.08);
	}

	.icon {
		display: inline-flex;
		width: 28px;
		height: 28px;
	}
</style>
