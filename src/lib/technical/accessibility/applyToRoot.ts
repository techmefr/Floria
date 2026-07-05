export interface ICssVarTarget {
	style: { setProperty(name: string, value: string): void };
	setAttribute(name: string, value: string): void;
	removeAttribute(name: string): void;
}

export function applyFontScale(root: ICssVarTarget, scale: number): void {
	root.style.setProperty('--font-scale', String(scale));
}

export function applyHighContrast(root: ICssVarTarget, isEnabled: boolean): void {
	if (isEnabled) {
		root.setAttribute('data-high-contrast', 'true');
	} else {
		root.removeAttribute('data-high-contrast');
	}
}

export function applyReduceMotion(root: ICssVarTarget, isEnabled: boolean): void {
	if (isEnabled) {
		root.setAttribute('data-reduce-motion', 'true');
	} else {
		root.removeAttribute('data-reduce-motion');
	}
}
