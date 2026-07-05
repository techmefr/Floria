import { mulberry32 } from './prng';
import { FLOWER_FAMILIES, type Family } from './families';

export type FlowerStyle = 'aquarelle' | 'encre' | 'pastel';
export type FilterId = 'wc' | 'wc-ink' | 'wc-soft';

export interface IPetalModel {
	angle: number;
	rx: number;
	ry: number;
	tipRx: number;
	tipRy: number;
	baseFill: string;
	tipFill: string;
	opacity: number;
	tipOpacity: number;
}

export interface ICircleModel {
	cx: number;
	cy: number;
	radius: number;
	fill: string;
	opacity: number;
}

export interface IFlowerModel {
	filterId: FilterId;
	bloom: number;
	petals: IPetalModel[];
	darkCenter: ICircleModel | null;
	center: ICircleModel;
	stamens: ICircleModel[];
}

interface IStyleAdjustment {
	satShift: number;
	lightShift: number;
	opacity: number;
	filterId: FilterId;
}

const STYLE_ADJUSTMENTS: Record<FlowerStyle, IStyleAdjustment> = {
	aquarelle: { satShift: 0, lightShift: 0, opacity: 0.72, filterId: 'wc' },
	encre: { satShift: 12, lightShift: -2, opacity: 0.6, filterId: 'wc-ink' },
	pastel: { satShift: -16, lightShift: 8, opacity: 0.9, filterId: 'wc-soft' }
};

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function makeFlower(
	family: Family,
	seed: number,
	bloom: number,
	style: FlowerStyle,
	intensity: number | null = null
): IFlowerModel {
	const config = FLOWER_FAMILIES[family];
	const rng = mulberry32(seed * 97 + 13);
	const it = intensity == null ? 1 : clamp(intensity, 0.26, 1);
	const adj = STYLE_ADJUSTMENTS[style];

	const satShift = Math.round((it - 0.6) * 34);
	const lightShift = Math.round((0.6 - it) * 12);

	const petalCount = Math.max(
		3,
		Math.round(config.petals * (0.48 + 0.72 * it)) + Math.round(rng() * config.pv * it)
	);

	const petals: IPetalModel[] = [];
	for (let i = 0; i < petalCount; i += 1) {
		const angle = (i / petalCount) * 360 + (rng() - 0.5) * 12;
		const hueJitter = (rng() - 0.5) * 16;
		const rx = config.rx * (0.85 + rng() * 0.3);
		const ry = config.ry * (0.85 + rng() * 0.3);
		const hue = config.hue + hueJitter;
		const sat = config.sat + adj.satShift + satShift;

		petals.push({
			angle,
			rx,
			ry,
			tipRx: rx * 0.55,
			tipRy: ry * 0.55,
			baseFill: `hsl(${hue} ${sat}% ${config.light + adj.lightShift + lightShift}%)`,
			tipFill: `hsl(${hue} ${sat + 6}% ${config.deepL + adj.lightShift + lightShift}%)`,
			opacity: adj.opacity,
			tipOpacity: adj.opacity * 0.82
		});
	}

	const darkCenter: ICircleModel | null = config.isDark
		? {
				cx: 50,
				cy: 50,
				radius: config.cr * 1.2,
				fill: `hsl(${config.chue} 32% 22%)`,
				opacity: 0.85
			}
		: null;

	const center: ICircleModel = {
		cx: 50,
		cy: 50,
		radius: config.cr,
		fill: `hsl(${config.chue} ${config.csat}% ${config.cl + adj.lightShift}%)`,
		opacity: 0.85
	};

	const stamenCount = Math.max(2, Math.round(config.stamen * (0.4 + 0.7 * it)));
	const stamens: ICircleModel[] = [];
	for (let i = 0; i < stamenCount; i += 1) {
		const angle = rng() * 6.283;
		const distance = rng() * config.cr * 0.75;
		stamens.push({
			cx: 50 + Math.cos(angle) * distance,
			cy: 50 + Math.sin(angle) * distance,
			radius: 0.8 + rng() * 0.9,
			fill: `hsl(${config.chue} 48% ${config.isDark ? 72 : 38}%)`,
			opacity: 0.8
		});
	}

	return {
		filterId: adj.filterId,
		bloom,
		petals,
		darkCenter,
		center,
		stamens
	};
}
