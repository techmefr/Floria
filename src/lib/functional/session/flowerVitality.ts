import { vitality } from './sunRules';

export function flowerIntensity(consistency: number, suns: number): number {
	return Math.max(0.2, consistency * (0.35 + 0.65 * vitality(suns)));
}

export function plantSize(baseSize: number, consistency: number, suns: number): number {
	return baseSize * (0.6 + 0.52 * consistency) * (0.7 + 0.3 * vitality(suns));
}
