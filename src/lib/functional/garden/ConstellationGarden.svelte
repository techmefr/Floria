<script lang="ts">
	import { computeConstellationScene } from './constellationScene';
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

	let nodes = $derived(computeConstellationScene(plants));
</script>

<div class="scene">
	<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none">
		{#each nodes.slice(0, -1) as node, i (node.habitId)}
			<line
				x1={node.x}
				y1={node.y}
				x2={nodes[i + 1].x}
				y2={nodes[i + 1].y}
				stroke="rgba(120,110,90,.2)"
				stroke-width="0.25"
				stroke-dasharray="1 1.6"
			/>
		{/each}
	</svg>
	{#each nodes as node (node.habitId)}
		<button
			type="button"
			class="node"
			style:left="{node.x}%"
			style:top="{node.y}%"
			style:width="{node.size}px"
			style:animation={isReduceMotion
				? 'none'
				: `floatY ${node.floatDurationSeconds}s ease-in-out ${node.floatDelaySeconds}s infinite alternate`}
			onclick={() => onSelect(node.habitId)}
		>
			<Flower
				family={node.family}
				seed={node.seed}
				bloom={1}
				style={flowerStyle}
				intensity={node.intensity}
				size={node.size}
			/>
		</button>
	{/each}
</div>

<style>
	.scene {
		position: relative;
		height: 360px;
		margin: 6px 0;
	}

	.lines {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.node {
		position: absolute;
		cursor: pointer;
		transform: translate(-50%, -50%);
		background: none;
		border: none;
		padding: 0;
	}
</style>
