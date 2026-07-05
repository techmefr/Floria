export const FONT_SCALE_STEPS = [
	{ value: 0.9, label: 'A-' },
	{ value: 1, label: 'A' },
	{ value: 1.15, label: 'A+' },
	{ value: 1.3, label: 'A++' }
] as const;

export type FontScale = (typeof FONT_SCALE_STEPS)[number]['value'];
