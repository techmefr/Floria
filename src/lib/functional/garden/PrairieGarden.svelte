<script lang="ts">
	import { SCENE_VIEWBOX } from './layout';
	import { computePrairieScene } from './prairieScene';
	import Ground from './Ground.svelte';
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

	let scenes = $derived(computePrairieScene(plants));
</script>

<svg viewBox={SCENE_VIEWBOX} width="100%" style:display="block" style:overflow="visible">
	<Ground />
	{#each scenes as scene (scene.habitId)}
		<g
			role="button"
			tabindex="0"
			aria-label={scene.name}
			onclick={() => onSelect(scene.habitId)}
			onkeydown={(event) => {
				if (event.key === 'Enter') onSelect(scene.habitId);
			}}
			style:cursor="pointer"
			style:transform-box="fill-box"
			style:transform-origin="bottom center"
			style:animation={isReduceMotion
				? 'none'
				: `sway ${scene.swayDurationSeconds}s ease-in-out ${scene.swayDelaySeconds}s infinite alternate`}
		>
			<path
				d={scene.stemPathD}
				fill="none"
				stroke="hsl(96 26% 47%)"
				stroke-width="3"
				stroke-linecap="round"
				opacity="0.72"
				filter="url(#wc-soft)"
			/>
			<ellipse
				cx={scene.leaf.cx}
				cy={scene.leaf.cy}
				rx={scene.leaf.rx}
				ry={scene.leaf.ry}
				fill="hsl(100 30% 52%)"
				opacity="0.55"
				transform="rotate({scene.leaf.rotate} {scene.leaf.cx} {scene.leaf.cy})"
				filter="url(#wc-soft)"
			/>
			<g transform={scene.flowerTransform}>
				<Flower
					family={scene.family}
					seed={scene.seed}
					bloom={1}
					style={flowerStyle}
					intensity={scene.intensity}
					size={100}
				/>
			</g>
		</g>
	{/each}
</svg>
