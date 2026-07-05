export const MAX_SUNS = 3;
export const MIN_SUNS = 0;

export function gainSun(current: number): number {
	return Math.min(MAX_SUNS, current + 1);
}

export function loseSun(current: number): number {
	return Math.max(MIN_SUNS, current - 1);
}

export function vitality(suns: number): number {
	return suns / MAX_SUNS;
}

export type PlantState = 'epanouie' | 'sereine' | 'fatiguee' | 'assoupie';

export function plantState(suns: number): PlantState {
	if (suns >= 3) return 'epanouie';
	if (suns === 2) return 'sereine';
	if (suns === 1) return 'fatiguee';
	return 'assoupie';
}
