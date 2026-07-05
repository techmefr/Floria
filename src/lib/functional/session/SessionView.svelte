<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Flower, type Family, type FlowerStyle } from '$lib/functional/garden';
	import { sessionFraction, type ISessionState } from './sessionMachine';

	export interface ISessionPalier {
		label: string;
		isReached: boolean;
	}

	type Props = {
		session: ISessionState;
		habitName: string;
		family: Family;
		seed: number;
		flowerStyle: FlowerStyle;
		elapsedLabel: string;
		targetLabel: string;
		paliers: ISessionPalier[];
		isReduceMotion?: boolean;
		onPause: () => void;
		onResume: () => void;
		onStop: () => void;
		onReturnToGarden: () => void;
		onTick: () => void;
	};

	let {
		session,
		habitName,
		family,
		seed,
		flowerStyle,
		elapsedLabel,
		targetLabel,
		paliers,
		isReduceMotion = false,
		onPause,
		onResume,
		onStop,
		onReturnToGarden,
		onTick
	}: Props = $props();

	let fraction = $derived(sessionFraction(session));
	let bloom = $derived(0.3 + 0.7 * fraction);

	const RADIUS = 90;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
	let dashOffset = $derived(CIRCUMFERENCE * (1 - fraction));

	let intervalId: ReturnType<typeof setInterval> | undefined;

	$effect(() => {
		if (!session.running) return;
		intervalId = setInterval(onTick, 250);
		return () => clearInterval(intervalId);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<div class="session-view">
	<span class="label">Séance en cours</span>
	<h2>{habitName}</h2>
	<div class="clock tabular-nums">{elapsedLabel} / {targetLabel}</div>

	<div class="ring-wrap" class:breathes={!isReduceMotion}>
		<svg viewBox="0 0 200 200" width="220" height="220">
			<circle
				cx="100"
				cy="100"
				r={RADIUS}
				fill="none"
				stroke="rgba(120,110,85,.15)"
				stroke-width="6"
			/>
			<circle
				cx="100"
				cy="100"
				r={RADIUS}
				fill="none"
				stroke="var(--color-accent)"
				stroke-width="6"
				stroke-linecap="round"
				stroke-dasharray={CIRCUMFERENCE}
				stroke-dashoffset={dashOffset}
				transform="rotate(-90 100 100)"
			/>
		</svg>
		<div class="flower-wrap">
			<Flower {family} {seed} {bloom} style={flowerStyle} size={140} />
		</div>
	</div>

	<div class="paliers">
		{#each paliers as palier, i (i)}
			<span class="palier" class:reached={palier.isReached}>{palier.label}</span>
		{/each}
	</div>

	{#if session.done}
		<button type="button" class="primary" onclick={onReturnToGarden}>Retour au jardin</button>
	{:else}
		<div class="controls">
			<button type="button" class="secondary" onclick={onStop}>Arrêter</button>
			<button type="button" class="primary" onclick={session.running ? onPause : onResume}>
				{session.running ? 'Pause' : 'Reprendre'}
			</button>
		</div>
	{/if}
</div>

<style>
	.session-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 32px 20px;
		background: linear-gradient(180deg, #faf6ec, #eee6d5);
		min-height: 100%;
	}

	.label {
		font-family: var(--font-body);
		font-size: var(--text-label);
		text-transform: uppercase;
		letter-spacing: var(--label-letter-spacing);
		color: var(--color-text-muted);
	}

	h2 {
		font-family: var(--font-title);
		font-size: 22px;
		color: var(--color-text-title);
		margin: 0;
	}

	.clock {
		font-family: var(--font-body);
		font-size: 15px;
		color: var(--color-text-body-soft);
	}

	.ring-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 12px 0;
	}

	.flower-wrap {
		position: absolute;
	}

	.paliers {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.palier {
		padding: 4px 10px;
		border-radius: 12px;
		border: 1px solid var(--color-border-hairline);
		font-size: 12px;
		color: var(--color-text-body-soft);
	}

	.palier.reached {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: #fff;
	}

	.controls {
		display: flex;
		gap: 10px;
		margin-top: 16px;
	}

	button {
		border: none;
		border-radius: var(--radius-button);
		padding: 12px 20px;
		font-family: var(--font-body);
		font-weight: 600;
		cursor: pointer;
	}

	.primary {
		background: var(--color-accent);
		color: #fff;
	}

	.secondary {
		background: transparent;
		border: 1.5px solid var(--color-border-hairline);
		color: var(--color-text-body);
	}
</style>
