<script lang="ts" generics="T extends string">
	type Option = { value: T; label: string };

	type Props = {
		options: Option[];
		value: T;
		onchange?: (value: T) => void;
	};

	let { options, value = $bindable(), onchange }: Props = $props();

	function select(next: T): void {
		value = next;
		onchange?.(next);
	}
</script>

<div class="segmented" role="radiogroup">
	{#each options as option (option.value)}
		<button
			type="button"
			role="radio"
			aria-checked={option.value === value}
			class="segment"
			class:active={option.value === value}
			onclick={() => select(option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.segmented {
		display: flex;
		gap: 4px;
		padding: 4px;
		background: var(--color-surface-card);
		border: 1px solid var(--color-border-hairline);
		border-radius: var(--radius-pill);
	}

	.segment {
		flex: 1;
		min-height: 40px;
		border: none;
		border-radius: 12px;
		background: transparent;
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 13.5px;
		color: var(--color-text-body-soft);
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.segment.active {
		background: var(--color-accent);
		color: #fff;
	}
</style>
