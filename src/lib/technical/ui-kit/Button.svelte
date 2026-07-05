<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'fab';

	type Props = {
		variant?: Variant;
		isDisabled?: boolean;
		onclick?: () => void;
		children: Snippet;
	};

	let { variant = 'primary', isDisabled = false, onclick, children }: Props = $props();
</script>

<button type="button" class="btn {variant}" disabled={isDisabled} {onclick}>
	{@render children()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		border: none;
		font-family: var(--font-body);
		font-weight: 600;
		cursor: pointer;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn.primary {
		padding: 12px 20px;
		border-radius: var(--radius-button);
		background: var(--color-accent);
		color: #fff;
		font-size: var(--text-body);
	}

	.btn.secondary {
		padding: 10px 18px;
		border-radius: var(--radius-button);
		background: transparent;
		border: 1.5px solid var(--color-border-hairline);
		color: var(--color-text-body);
		font-size: var(--text-body);
	}

	.btn.fab {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--color-accent);
		color: #fff;
		box-shadow: var(--shadow-fab);
		font-size: 24px;
	}

	.btn:not(:disabled):active {
		transform: scale(0.96);
	}
</style>
