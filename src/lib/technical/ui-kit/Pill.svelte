<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		isFilled?: boolean;
		accentColor?: string;
		children: Snippet;
	};

	let { isFilled = false, accentColor = 'var(--color-accent)', children }: Props = $props();
</script>

<span
	class="pill"
	class:filled={isFilled}
	style:background={isFilled ? accentColor : 'transparent'}
	style:border-color={isFilled ? accentColor : 'var(--color-border-hairline)'}
>
	{@render children()}
</span>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px 12px;
		border: 1.5px solid var(--color-border-hairline);
		border-radius: 14px;
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 12.5px;
		color: var(--color-text-body-soft);
		transition:
			background 0.3s ease,
			border-color 0.3s ease,
			color 0.3s ease;
	}

	.pill.filled {
		color: #fff;
	}
</style>
