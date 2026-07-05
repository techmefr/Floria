import { clamp01 } from '$lib/technical/motion';
import type { IHabit, ILog } from './types';

const DAY_MS = 86_400_000;

export interface IHabitStats {
	cons: number;
	recent: number;
	prog: number;
	days: boolean[];
}

function startOfDay(ts: number): number {
	const date = new Date(ts);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

function amountsByDay(logs: ILog[], habitId: string): Map<number, number> {
	const totals = new Map<number, number>();
	for (const log of logs) {
		if (log.habitId !== habitId) continue;
		const day = startOfDay(log.ts);
		totals.set(day, (totals.get(day) ?? 0) + log.amount);
	}
	return totals;
}

function last28Days(logs: ILog[], habitId: string, now: number): boolean[] {
	const todayStart = startOfDay(now);
	const totals = amountsByDay(logs, habitId);
	const days: boolean[] = [];
	for (let i = 27; i >= 0; i -= 1) {
		const day = todayStart - i * DAY_MS;
		days.push((totals.get(day) ?? 0) > 0);
	}
	return days;
}

export function stats(habit: IHabit, logs: ILog[], now: number = Date.now()): IHabitStats {
	const days = last28Days(logs, habit.id, now);
	const cons = days.filter(Boolean).length / 28;
	const recent = days.slice(-7).filter(Boolean).length / 7;
	const prog = habit.goal
		? clamp01((habit.goal.current - habit.goal.start) / (habit.goal.target - habit.goal.start))
		: 0;

	return { cons, recent, prog, days };
}

export function todayAmount(habit: IHabit, logs: ILog[], now: number = Date.now()): number {
	const todayStart = startOfDay(now);
	return amountsByDay(logs, habit.id).get(todayStart) ?? 0;
}

export function todayFraction(habit: IHabit, logs: ILog[], now: number = Date.now()): number {
	const amount = todayAmount(habit, logs, now);
	return Math.min(1, amount / habit.daily.target);
}

export interface IPalier {
	threshold: number;
	isReached: boolean;
	label: string;
}

const PALIER_FRACTIONS = [0.25, 0.5, 0.75, 1] as const;

export function paliers(habit: IHabit, logs: ILog[], now: number = Date.now()): IPalier[] {
	const amount = todayAmount(habit, logs, now);

	return PALIER_FRACTIONS.map((fraction) => {
		const threshold = habit.daily.target * fraction;
		return {
			threshold,
			isReached: amount >= threshold - 1e-9,
			label: formatPalierLabel(threshold, habit.daily.unit)
		};
	});
}

export function formatPalierLabel(value: number, unit: string): string {
	if (unit === 'min') {
		return formatClock(Math.round(value * 60));
	}
	if (unit === 's') {
		return formatClock(Math.round(value));
	}
	const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
	return `${formatted} ${unit}`;
}

function formatClock(totalSeconds: number): string {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
