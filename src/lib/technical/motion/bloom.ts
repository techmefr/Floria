import { spring, type Spring } from 'svelte/motion';
import { clamp01 } from './clamp';

export function createBloom(initial = 0, isReduceMotion = false): Spring<number> {
	return spring(
		clamp01(initial),
		isReduceMotion ? { stiffness: 1, damping: 1 } : { stiffness: 0.15, damping: 0.6 }
	);
}
