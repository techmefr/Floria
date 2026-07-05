import { mulberry32 } from './prng';

export const SCENE_WIDTH = 390;
export const SCENE_HEIGHT = 315;
export const GROUND_Y = 300;
export const SCENE_VIEWBOX = `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`;

const PLOT_PADDING = 40;

export interface IPlantLayout {
	px: number;
	dx: number;
	baseHeight: number;
	baseScale: number;
}

export function plantLayout(seed: number, index: number, total: number): IPlantLayout {
	const rng = mulberry32(seed);
	const px =
		total <= 1
			? SCENE_WIDTH / 2
			: PLOT_PADDING + (index * (SCENE_WIDTH - 2 * PLOT_PADDING)) / (total - 1);

	return {
		px,
		dx: (rng() - 0.5) * 10,
		baseHeight: 90 + rng() * 110,
		baseScale: 0.5 + rng() * 0.45
	};
}
