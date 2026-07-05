<script lang="ts">
	import { Card, Chip } from '$lib/technical/ui-kit';
	import {
		PrairieGarden,
		ParterresGarden,
		ConstellationGarden,
		Flower,
		type FlowerStyle
	} from '$lib/functional/garden';
	import { buildGardenPlants } from './gardenPlants';
	import { todayFraction } from './stats';
	import type { IHabit, ILog } from './types';

	export type GardenLayout = 'prairie' | 'parterres' | 'constellation';

	type Props = {
		habits: IHabit[];
		logs: ILog[];
		flowerStyle: FlowerStyle;
		gardenLayout: GardenLayout;
		isReduceMotion?: boolean;
		onToggleToday: (habitId: string) => void;
		onSelectHabit: (habitId: string) => void;
	};

	let {
		habits,
		logs,
		flowerStyle,
		gardenLayout,
		isReduceMotion = false,
		onToggleToday,
		onSelectHabit
	}: Props = $props();

	let activeHabits = $derived(habits.filter((habit) => !habit.isArchived));
	let doneTodayCount = $derived(
		activeHabits.filter((habit) => todayFraction(habit, logs) >= 1).length
	);
	let plants = $derived(buildGardenPlants(habits, logs));

	let todayLabel = $derived(
		new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(
			new Date()
		)
	);

	let footerMessage = $derived(
		doneTodayCount === 0
			? 'Prends ton temps, rien ne presse.'
			: `Tu as fait éclore ${doneTodayCount} fleur${doneTodayCount > 1 ? 's' : ''} aujourd’hui.`
	);
</script>

<header class="screen-header">
	<span class="date">{todayLabel}</span>
	<h1>Ton jardin</h1>
</header>

<Card>
	<div class="today-header">
		<span class="title">Aujourd’hui</span>
		<span class="count tabular-nums">{doneTodayCount} / {activeHabits.length}</span>
	</div>
	<div class="chips">
		{#each activeHabits as habit (habit.id)}
			{@const isDone = todayFraction(habit, logs) >= 1}
			<Chip isActive={isDone} onclick={() => onToggleToday(habit.id)}>
				{#snippet icon()}
					<Flower
						family={habit.family}
						seed={habit.seed}
						bloom={isDone ? 1 : 0.42}
						style={flowerStyle}
						size={28}
					/>
				{/snippet}
				{habit.name}
			</Chip>
		{/each}
	</div>
	<p class="footer-message">{footerMessage}</p>
</Card>

{#if gardenLayout === 'parterres'}
	<ParterresGarden {plants} {flowerStyle} {isReduceMotion} onSelect={onSelectHabit} />
{:else if gardenLayout === 'constellation'}
	<ConstellationGarden {plants} {flowerStyle} {isReduceMotion} onSelect={onSelectHabit} />
{:else}
	<PrairieGarden {plants} {flowerStyle} {isReduceMotion} onSelect={onSelectHabit} />
{/if}

<p class="legend">Plus une habitude est constante, plus sa fleur est haute et fournie.</p>

<style>
	.screen-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 8px 4px 16px;
	}

	.date {
		font-family: var(--font-body);
		font-size: var(--text-label);
		text-transform: uppercase;
		letter-spacing: var(--label-letter-spacing);
		color: var(--color-text-muted);
	}

	h1 {
		font-family: var(--font-title);
		font-size: var(--text-h1);
		font-weight: 500;
		color: var(--color-text-title);
		margin: 0;
	}

	.today-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	.title {
		font-family: var(--font-title);
		font-size: var(--text-card-title);
		color: var(--color-text-body);
	}

	.count {
		font-family: var(--font-body);
		font-size: var(--text-body);
		color: var(--color-text-muted);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 12px;
	}

	.footer-message {
		font-family: var(--font-title);
		font-style: italic;
		font-size: 13px;
		color: var(--color-text-italic);
		margin: 10px 0 0;
	}

	.legend {
		font-family: var(--font-title);
		font-style: italic;
		font-size: 12.5px;
		color: var(--color-text-italic-soft);
		text-align: center;
		margin: 10px 0;
	}
</style>
