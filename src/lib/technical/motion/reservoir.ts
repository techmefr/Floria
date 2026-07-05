import { tweened, type Tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { clamp01 } from './clamp';

export function createReservoir(initialFraction = 0, isReduceMotion = false): Tweened<number> {
	return tweened(clamp01(initialFraction), {
		duration: isReduceMotion ? 0 : 900,
		easing: cubicOut
	});
}
