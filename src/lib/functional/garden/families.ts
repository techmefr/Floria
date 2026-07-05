export type Family = 'meditation' | 'water' | 'poppy' | 'cosmos' | 'ranunculus';

export interface IFamilyConfig {
	hue: number;
	sat: number;
	light: number;
	deepL: number;
	petals: number;
	pv: number;
	rx: number;
	ry: number;
	cr: number;
	chue: number;
	csat: number;
	cl: number;
	stamen: number;
	isDark?: boolean;
}

export const FLOWER_FAMILIES: Record<Family, IFamilyConfig> = {
	meditation: {
		hue: 265,
		sat: 30,
		light: 71,
		deepL: 57,
		petals: 8,
		pv: 2,
		rx: 8,
		ry: 24,
		cr: 7,
		chue: 50,
		csat: 55,
		cl: 74,
		stamen: 6
	},
	water: {
		hue: 206,
		sat: 40,
		light: 70,
		deepL: 56,
		petals: 5,
		pv: 1,
		rx: 7,
		ry: 11,
		cr: 4,
		chue: 48,
		csat: 62,
		cl: 72,
		stamen: 4
	},
	poppy: {
		hue: 12,
		sat: 64,
		light: 62,
		deepL: 50,
		petals: 5,
		pv: 1,
		rx: 17,
		ry: 21,
		cr: 9,
		chue: 15,
		csat: 40,
		cl: 30,
		isDark: true,
		stamen: 11
	},
	cosmos: {
		hue: 342,
		sat: 46,
		light: 77,
		deepL: 63,
		petals: 8,
		pv: 2,
		rx: 7,
		ry: 26,
		cr: 8,
		chue: 46,
		csat: 60,
		cl: 70,
		stamen: 8
	},
	ranunculus: {
		hue: 44,
		sat: 56,
		light: 66,
		deepL: 52,
		petals: 15,
		pv: 5,
		rx: 7,
		ry: 11,
		cr: 5,
		chue: 42,
		csat: 46,
		cl: 60,
		stamen: 5
	}
};

export const FAMILY_ACCENT_COLOR: Record<Family, string> = {
	meditation: '#8e7fb8',
	water: '#5b93c4',
	poppy: '#d0694c',
	cosmos: '#d98ba0',
	ranunculus: '#b89a3e'
};
