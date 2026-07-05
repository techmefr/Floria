<script lang="ts">
	import { Card, Pill, Button } from '$lib/technical/ui-kit';
	import { Flower, type FlowerStyle } from '$lib/functional/garden';
	import { stats, todayAmount, todayFraction, paliers, formatPalierLabel } from './stats';
	import type { IHabit, ILog } from './types';

	type Props = {
		habit: IHabit;
		logs: ILog[];
		flowerStyle: FlowerStyle;
		sunCount?: number;
		isReduceMotion?: boolean;
		onAdjustToday: (delta: number) => void;
		onStartSession?: (habitId: string) => void;
		onWake?: (habitId: string) => void;
		onAdapt: (habitId: string) => void;
		onBack: () => void;
	};

	let {
		habit,
		logs,
		flowerStyle,
		sunCount = 3,
		isReduceMotion = false,
		onAdjustToday,
		onStartSession,
		onWake,
		onAdapt,
		onBack
	}: Props = $props();

	const hasTimedSession = $derived(habit.daily.unit !== 'L' && !habit.daily.isLiquid);
	const isAsleep = $derived(sunCount <= 0);

	let habitStats = $derived(stats(habit, logs));
	let fraction = $derived(todayFraction(habit, logs));
	let amount = $derived(todayAmount(habit, logs));
	let todayPaliers = $derived(paliers(habit, logs));

	let bloom = $derived(0.55 + 0.45 * fraction);
	let intensity = $derived(Math.max(0.2, habitStats.cons * (0.35 + 0.65 * (sunCount / 3))));

	let todayLabel = $derived(
		`${formatPalierLabel(amount, habit.daily.unit)} / ${formatPalierLabel(habit.daily.target, habit.daily.unit)}`
	);

	let familyVariations = $derived(Array.from({ length: 5 }, (_, i) => habit.seed + i * 29 + 7));
</script>

<button type="button" class="back" onclick={onBack}>← Jardin</button>

<div class="hero" class:asleep={isAsleep} class:breathes={!isReduceMotion}>
	<Flower
		family={habit.family}
		seed={habit.seed}
		{bloom}
		style={flowerStyle}
		intensity={isAsleep ? 0.2 : intensity}
		size={170}
	/>
</div>

<h1>{habit.name}</h1>

<div class="suns">
	{#each [0, 1, 2] as index (index)}
		<span class="sun" class:filled={index < sunCount}>☀</span>
	{/each}
</div>

{#if isAsleep}
	<p class="asleep-note">Cette fleur s’est assoupie — une séance la réveillera.</p>
	<Button variant="secondary" onclick={() => onWake?.(habit.id)}>La réveiller</Button>
{/if}

<Card>
	<div class="today-header">
		<span class="title">Aujourd’hui</span>
		<span class="value tabular-nums">{todayLabel}</span>
	</div>
	<div class="paliers">
		{#each todayPaliers as palier (palier.threshold)}
			<Pill isFilled={palier.isReached}>{palier.label}</Pill>
		{/each}
	</div>
	<div class="controls">
		<Button variant="secondary" onclick={() => onAdjustToday(-habit.daily.step)}>−</Button>
		<Button onclick={() => onAdjustToday(habit.daily.step)}
			>+ {habit.daily.step} {habit.daily.unit}</Button
		>
	</div>
	{#if hasTimedSession && onStartSession && !isAsleep}
		<Button onclick={() => onStartSession(habit.id)}>Commencer la séance</Button>
	{/if}
</Card>

{#if habit.goal}
	<Card>
		<span class="title">Là où tu en es</span>
		<div class="progress-track">
			<div class="progress-fill" style:width="{habitStats.prog * 100}%"></div>
		</div>
		<p class="progress-note">
			{habit.goal.current} / {habit.goal.target}
			{habit.goal.unit}
		</p>
	</Card>
{/if}

<Card>
	<span class="title">Ces quatre semaines</span>
	<div class="calendar">
		{#each habitStats.days as done, i (i)}
			{#if done}
				<Flower
					family={habit.family}
					seed={habit.seed + i * 13}
					bloom={0.92}
					style={flowerStyle}
					size={30}
				/>
			{:else}
				<span class="empty-ring"></span>
			{/if}
		{/each}
	</div>
	<p class="calendar-note">Les jours sans fleur ne comptent pas contre toi.</p>
</Card>

<Card>
	<span class="title">Sa famille de fleurs</span>
	<div class="family-row">
		{#each familyVariations as seed (seed)}
			<Flower family={habit.family} {seed} bloom={1} style={flowerStyle} size={62} />
		{/each}
	</div>
</Card>

<Card>
	<span class="title">Ta fleur est ton graphe</span>
	<ul class="graph-legend">
		<li>Régularité — {Math.round(habitStats.cons * 100)}%</li>
		<li>Énergie récente — {Math.round(habitStats.recent * 100)}%</li>
		{#if habit.goal}
			<li>Progression — {Math.round(habitStats.prog * 100)}%</li>
		{/if}
	</ul>
</Card>

<Button variant="secondary" onclick={() => onAdapt(habit.id)}>Adapter cette habitude</Button>

<style>
	.back {
		border: none;
		background: var(--color-surface-card);
		border-radius: var(--radius-pill);
		padding: 8px 16px;
		font-family: var(--font-body);
		color: var(--color-text-body);
		cursor: pointer;
	}

	.hero {
		display: flex;
		justify-content: center;
		margin: 16px 0;
	}

	.hero.asleep {
		filter: grayscale(0.5);
		opacity: 0.85;
	}

	h1 {
		font-family: var(--font-title);
		font-size: var(--text-h1);
		text-align: center;
		color: var(--color-text-title);
		margin: 0 0 8px;
	}

	.suns {
		display: flex;
		justify-content: center;
		gap: 6px;
		margin-bottom: 12px;
	}

	.sun {
		color: rgba(224, 168, 78, 0.35);
	}

	.sun.filled {
		color: var(--color-sun-full);
	}

	.asleep-note {
		text-align: center;
		font-family: var(--font-title);
		font-style: italic;
		color: var(--color-text-italic);
	}

	.today-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.title {
		font-family: var(--font-title);
		font-size: var(--text-card-title);
		color: var(--color-text-body);
	}

	.paliers {
		display: flex;
		gap: 6px;
		margin: 10px 0;
		flex-wrap: wrap;
	}

	.controls {
		display: flex;
		gap: 8px;
	}

	.progress-track {
		height: 8px;
		border-radius: 4px;
		background: var(--color-border-hairline);
		overflow: hidden;
		margin: 10px 0 6px;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-accent);
	}

	.progress-note {
		font-size: var(--text-body);
		color: var(--color-text-body-soft);
		margin: 0;
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
		margin: 10px 0;
	}

	.empty-ring {
		display: block;
		width: 30px;
		height: 30px;
		margin: 0 auto;
		border-radius: 50%;
		border: 1.5px solid var(--color-border-hairline);
	}

	.calendar-note {
		font-family: var(--font-title);
		font-style: italic;
		font-size: 12.5px;
		color: var(--color-text-italic-soft);
		margin: 0;
	}

	.family-row {
		display: flex;
		justify-content: space-between;
		gap: 4px;
	}

	.graph-legend {
		margin: 8px 0 0;
		padding-left: 18px;
		font-size: var(--text-body);
		color: var(--color-text-body-soft);
	}
</style>
