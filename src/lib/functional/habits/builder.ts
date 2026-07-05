import type { Family } from '$lib/functional/garden';
import type { Cadence, IHabit, IHabitDaily } from './types';

export function hashSeed(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i += 1) {
		hash = (hash * 31 + input.charCodeAt(i)) | 0;
	}
	return Math.abs(hash) || 1;
}

const FAMILY_KEYWORDS: { family: Family; keywords: string[] }[] = [
	{ family: 'meditation', keywords: ['medit', 'respir', 'calme', 'yoga'] },
	{ family: 'water', keywords: ['eau', 'hydrat', 'boire', 'water'] },
	{ family: 'poppy', keywords: ['sport', 'muscu', 'gym', 'renfor'] },
	{ family: 'cosmos', keywords: ['course', 'run', 'marathon', 'jog'] },
	{ family: 'ranunculus', keywords: ['planche', 'gainage', 'abdo', 'plank'] }
];

const ALL_FAMILIES: Family[] = ['meditation', 'water', 'poppy', 'cosmos', 'ranunculus'];

function normalize(text: string): string {
	return text
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
}

export function familyForCategory(name?: string): Family {
	const normalized = normalize(name ?? '');

	for (const entry of FAMILY_KEYWORDS) {
		if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
			return entry.family;
		}
	}

	return ALL_FAMILIES[hashSeed(normalized || 'habitude') % ALL_FAMILIES.length];
}

export function defaultDaily(_cadence: Cadence = 'quotidien'): IHabitDaily {
	return { target: 1, step: 1, unit: 'fois' };
}

export function buildHabit(partial: Partial<IHabit>): IHabit {
	const family = partial.family ?? familyForCategory(partial.name);
	const seed = partial.seed ?? hashSeed(partial.name ?? crypto.randomUUID());

	return {
		id: partial.id ?? crypto.randomUUID(),
		name: partial.name ?? 'Nouvelle habitude',
		family,
		cadence: partial.cadence ?? 'quotidien',
		daily: partial.daily ?? defaultDaily(partial.cadence),
		goal: partial.goal,
		seed,
		createdAt: Date.now()
	};
}
