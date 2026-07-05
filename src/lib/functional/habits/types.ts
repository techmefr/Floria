import type { Family } from '$lib/functional/garden';

export type Cadence = 'quotidien' | 'quelques-fois' | 'objectif';

export interface IHabitDaily {
	target: number;
	step: number;
	unit: string;
	isLiquid?: boolean;
}

export interface IHabitGoal {
	start: number;
	current: number;
	target: number;
	unit: string;
}

export interface IHabit {
	id: string;
	name: string;
	family: Family;
	cadence: Cadence;
	daily: IHabitDaily;
	goal?: IHabitGoal;
	seed: number;
	createdAt: number;
	isArchived?: boolean;
}

export interface ILog {
	id: string;
	habitId: string;
	ts: number;
	amount: number;
}
