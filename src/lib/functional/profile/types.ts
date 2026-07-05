import type { GardenLayout } from '$lib/functional/habits';
import type { FlowerStyle } from '$lib/functional/garden';

export type { GardenLayout, FlowerStyle };

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
}

export const DEFAULT_PREFERENCES: IPreferences = {
	gardenLayout: 'prairie',
	flowerStyle: 'aquarelle',
	fontScale: 1,
	highContrast: false,
	reduceMotion: false,
	locale: 'fr',
	reminders: { enabled: false }
};
