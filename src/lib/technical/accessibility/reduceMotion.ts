export function effectiveReduceMotion(
	isUserOverride: boolean,
	isSystemPreferred: boolean
): boolean {
	return isUserOverride || isSystemPreferred;
}
