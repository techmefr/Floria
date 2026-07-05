export interface IStemModel {
	pathD: string;
	leaf: { cx: number; cy: number; rx: number; ry: number; rotate: number };
}

export function stem(px: number, base: number, tx: number, ty: number): IStemModel {
	const midY = (base + ty) / 2;
	const cx1 = px + (tx - px) * 0.2;
	const cx2 = tx - (tx - px) * 0.2;
	const leafCx = (px + tx) / 2 - 6;

	return {
		pathD: `M ${px} ${base} C ${cx1} ${midY + 18} ${cx2} ${midY - 18} ${tx} ${ty}`,
		leaf: { cx: leafCx, cy: midY, rx: 8, ry: 3.4, rotate: -28 }
	};
}
