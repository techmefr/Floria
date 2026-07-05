import { get, writable, type Writable } from 'svelte/store';
import type { IKeyValueStore } from '$lib/technical/database';
import { sessionReducer, type ISessionState, type SessionAction } from './sessionMachine';
import { gainSun, loseSun } from './sunRules';

const SUNS_KEY = 'floria.suns';
const COLLECTED_KEY = 'floria.collected';
const SESSION_KEY = 'floria.session';
const LAST_PENALIZED_KEY = 'floria.lastPenalizedDay';

function startOfDay(ts: number): number {
	const date = new Date(ts);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

export interface ISessionStore {
	suns: Writable<Record<string, number>>;
	collected: Writable<number>;
	session: Writable<ISessionState | null>;
	load(): Promise<void>;
	start(habitId: string, duration: number, now?: number): Promise<void>;
	tick(now?: number): void;
	pause(): Promise<void>;
	resume(now?: number): Promise<void>;
	abandon(): Promise<void>;
	complete(): Promise<void>;
	applyInactivityPenalty(habitId: string, wasInactive: boolean, now?: number): Promise<void>;
}

export function createSessionStore(kv: IKeyValueStore): ISessionStore {
	const suns = writable<Record<string, number>>({});
	const collected = writable(0);
	const session = writable<ISessionState | null>(null);
	let lastPenalizedDay: Record<string, number> = {};

	async function load(): Promise<void> {
		suns.set((await kv.get<Record<string, number>>(SUNS_KEY)) ?? {});
		collected.set((await kv.get<number>(COLLECTED_KEY)) ?? 0);
		session.set((await kv.get<ISessionState>(SESSION_KEY)) ?? null);
		lastPenalizedDay = (await kv.get<Record<string, number>>(LAST_PENALIZED_KEY)) ?? {};
	}

	function dispatch(action: SessionAction): void {
		session.update((current) => sessionReducer(current, action));
	}

	async function persistSession(): Promise<void> {
		await kv.set(SESSION_KEY, get(session));
	}

	async function persistSuns(next: Record<string, number>): Promise<void> {
		suns.set(next);
		await kv.set(SUNS_KEY, next);
	}

	async function start(habitId: string, duration: number, now: number = Date.now()): Promise<void> {
		dispatch({ type: 'start', habitId, duration, now });
		await persistSession();
	}

	function tick(now: number = Date.now()): void {
		dispatch({ type: 'tick', now });
	}

	async function pause(): Promise<void> {
		dispatch({ type: 'pause' });
		await persistSession();
	}

	async function resume(now: number = Date.now()): Promise<void> {
		dispatch({ type: 'resume', now });
		await persistSession();
	}

	async function abandon(): Promise<void> {
		const current = get(session);
		dispatch({ type: 'stop' });
		await persistSession();
		if (current) {
			await persistSuns({
				...get(suns),
				[current.habitId]: loseSun(get(suns)[current.habitId] ?? 3)
			});
		}
	}

	async function complete(): Promise<void> {
		const current = get(session);
		if (!current) return;

		dispatch({ type: 'close' });
		await persistSession();
		await persistSuns({
			...get(suns),
			[current.habitId]: gainSun(get(suns)[current.habitId] ?? 3)
		});
		collected.update((count) => count + 1);
		await kv.set(COLLECTED_KEY, get(collected));
	}

	async function applyInactivityPenalty(
		habitId: string,
		wasInactive: boolean,
		now: number = Date.now()
	): Promise<void> {
		const today = startOfDay(now);
		if (!wasInactive || lastPenalizedDay[habitId] === today) return;

		lastPenalizedDay = { ...lastPenalizedDay, [habitId]: today };
		await kv.set(LAST_PENALIZED_KEY, lastPenalizedDay);
		await persistSuns({ ...get(suns), [habitId]: loseSun(get(suns)[habitId] ?? 3) });
	}

	return {
		suns,
		collected,
		session,
		load,
		start,
		tick,
		pause,
		resume,
		abandon,
		complete,
		applyInactivityPenalty
	};
}
