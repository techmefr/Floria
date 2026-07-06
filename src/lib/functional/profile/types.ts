import type { GardenLayout } from '$lib/functional/habits';
import type { FlowerStyle } from '$lib/functional/garden';
import type { AiProvider } from '$lib/technical/ai-client';

export type { GardenLayout, FlowerStyle, AiProvider };

export interface IReminders {
	enabled: boolean;
	time?: string;
}

export interface IPreferences {
	gardenLayout: GardenLayout;
	flowerStyle: FlowerStyle;
	fontScale: number;
	highContrast: boolean;
	reduceMotion: boolean;
	locale: string;
	reminders: IReminders;
	aiProvider: AiProvider | null;
	aiApiKey: string | null;
}

export const DEFAULT_PREFERENCES: IPreferences = {
	gardenLayout: 'prairie',
	flowerStyle: 'aquarelle',
	fontScale: 1,
	highContrast: false,
	reduceMotion: false,
	locale: 'fr',
	reminders: { enabled: false },
	aiProvider: null,
	aiApiKey: null
};
