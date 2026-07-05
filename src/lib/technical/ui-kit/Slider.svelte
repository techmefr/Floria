<script lang="ts">
	type Props = {
		min: number;
		max: number;
		step: number;
		value: number;
		onchange?: (value: number) => void;
		label?: string;
	};

	let { min, max, step, value = $bindable(), onchange, label }: Props = $props();

	function handleInput(event: Event): void {
		const next = Number((event.target as HTMLInputElement).value);
		value = next;
		onchange?.(next);
	}
</script>

<label class="slider">
	{#if label}
		<span class="label">{label}</span>
	{/if}
	<input type="range" {min} {max} {step} {value} oninput={handleInput} />
</label>

<style>
	.slider {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.label {
		font-family: var(--font-body);
		font-size: var(--text-label);
		text-transform: uppercase;
		letter-spacing: var(--label-letter-spacing);
		color: var(--color-text-muted);
	}

	input[type='range'] {
		width: 100%;
		accent-color: var(--color-accent);
		min-height: 44px;
	}
</style>
