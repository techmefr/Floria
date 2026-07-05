<script lang="ts">
	import { makeFlower, type FlowerStyle } from './engine';
	import type { Family } from './families';

	type Props = {
		family: Family;
		seed: number;
		bloom: number;
		style: FlowerStyle;
		intensity?: number | null;
		size: number;
	};

	let { family, seed, bloom, style, intensity = null, size }: Props = $props();

	let model = $derived(makeFlower(family, seed, bloom, style, intensity));
</script>

<svg
	viewBox="0 0 100 100"
	width={size}
	height={size}
	style:display="block"
	style:overflow="visible"
>
	<g filter="url(#{model.filterId})">
		<g transform="translate(50 50) scale({model.bloom}) translate(-50 -50)">
			{#each model.petals as petal, i (i)}
				<g transform="rotate({petal.angle} 50 50)">
					<ellipse
						cx="50"
						cy={50 - petal.ry - 3}
						rx={petal.rx}
						ry={petal.ry}
						fill={petal.baseFill}
						opacity={petal.opacity}
						style:mix-blend-mode="multiply"
					/>
					<ellipse
						cx="50"
						cy={50 - petal.ry * 1.28 - 3}
						rx={petal.tipRx}
						ry={petal.tipRy}
						fill={petal.tipFill}
						opacity={petal.tipOpacity}
						style:mix-blend-mode="multiply"
					/>
				</g>
			{/each}
			{#if model.darkCenter}
				<circle
					cx={model.darkCenter.cx}
					cy={model.darkCenter.cy}
					r={model.darkCenter.radius}
					fill={model.darkCenter.fill}
					opacity={model.darkCenter.opacity}
					style:mix-blend-mode="multiply"
				/>
			{/if}
			<circle
				cx={model.center.cx}
				cy={model.center.cy}
				r={model.center.radius}
				fill={model.center.fill}
				opacity={model.center.opacity}
				style:mix-blend-mode="multiply"
			/>
			{#each model.stamens as stamen, i (i)}
				<circle
					cx={stamen.cx}
					cy={stamen.cy}
					r={stamen.radius}
					fill={stamen.fill}
					opacity={stamen.opacity}
				/>
			{/each}
		</g>
	</g>
</svg>
