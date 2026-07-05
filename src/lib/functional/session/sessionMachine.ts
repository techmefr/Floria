export interface ISessionState {
	habitId: string;
	/** Epoch milliseconds (Date.now()). */
	startedAt: number;
	/** Seconds elapsed within the session. */
	elapsed: number;
	/** Target duration in seconds. */
	duration: number;
	running: boolean;
	done: boolean;
}

export type SessionAction =
	| { type: 'start'; habitId: string; duration: number; now: number }
	| { type: 'tick'; now: number }
	| { type: 'pause' }
	| { type: 'resume'; now: number }
	| { type: 'stop' }
	| { type: 'close' };

export function sessionReducer(
	state: ISessionState | null,
	action: SessionAction
): ISessionState | null {
	switch (action.type) {
		case 'start':
			return {
				habitId: action.habitId,
				startedAt: action.now,
				elapsed: 0,
				duration: action.duration,
				running: true,
				done: false
			};

		case 'tick': {
			if (!state || !state.running) return state;
			const elapsed = Math.min(Math.floor((action.now - state.startedAt) / 1000), state.duration);
			const done = elapsed >= state.duration;
			return { ...state, elapsed, running: !done, done };
		}

		case 'pause':
			if (!state || !state.running) return state;
			return { ...state, running: false };

		case 'resume':
			if (!state || state.running || state.done) return state;
			return { ...state, running: true, startedAt: action.now - state.elapsed * 1000 };

		case 'stop':
			return null;

		case 'close':
			return null;

		default:
			return state;
	}
}

export function sessionFraction(state: ISessionState): number {
	return state.duration === 0 ? 0 : Math.min(1, state.elapsed / state.duration);
}
