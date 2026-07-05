export function toggleAmount(current: number, target: number): number {
	return current >= target ? -current : target - current;
}
