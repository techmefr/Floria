<script lang="ts">
	import Flower from './Flower.svelte';
	import type { IGardenPlant } from './gardenPlant';
	import type { FlowerStyle } from './engine';

	type Props = {
		plants: IGardenPlant[];
		flowerStyle: FlowerStyle;
		isReduceMotion?: boolean;
		onSelect: (habitId: string) => void;
	};

	let { plants, flowerStyle, isReduceMotion = false, onSelect }: Props = $props();

	const PLOT_BLOOMS = [0.7, 1, 0.82] as const;
</script>

<div class="grid">
	{#each plants as plant (plant.habitId)}
		<button type="button" class="plot" onclick={() => onSelect(plant.habitId)}>
			<div class="flowers">
				{#each PLOT_BLOOMS as bloom, k (k)}
					<div
						class="sway-slot"
						style:animation={isReduceMotion
							? 'none'
							: `sway ${4 + k}s ease-in-out ${(k * 0.3).toFixed(1)}s infinite alternate`}
					>
						<Flower
							family={plant.family}
							seed={plant.seed + k * 7}
							{bloom}
							style={flowerStyle}
							intensity={plant.consistency}
							size={32}
						/>
					</div>
				{/each}
			</div>
			<div class="name">{plant.name}</div>
			<div class="cadence">{plant.cadence}</div>
		</button>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 11px;
		padding: 14px;
	}

	.plot {
		cursor: pointer;
		background: var(--color-surface-card);
		border: 1px solid var(--color-border-hairline);
		border-radius: var(--radius-card);
		padding: 10px 10px 9px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: var(--shadow-card-plot);
		font: inherit;
	}

	.flowers {
		height: 88px;
		display: flex;
		align-items: flex-end;
		gap: 1px;
	}

	.sway-slot {
		width: 32px;
		transform-origin: bottom center;
	}

	.name {
		font-family: var(--font-title);
		font-size: 15px;
		color: var(--color-text-body);
		margin-top: 7px;
	}

	.cadence {
		font-size: 11px;
		color: var(--color-text-muted);
		margin-top: 1px;
	}
</style>
