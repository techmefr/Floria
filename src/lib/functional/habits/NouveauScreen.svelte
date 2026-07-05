<script lang="ts">
	import { Button, SegmentedControl } from '$lib/technical/ui-kit';
	import { Flower, FLOWER_FAMILIES, type Family, type FlowerStyle } from '$lib/functional/garden';
	import type { Cadence } from './types';

	export interface IHabitDraft {
		name: string;
		family: Family;
		cadence: Cadence;
	}

	type Props = {
		initialName?: string;
		initialFamily?: Family;
		initialCadence?: Cadence;
		flowerStyle: FlowerStyle;
		isEditing?: boolean;
		onSubmit: (draft: IHabitDraft) => void;
		onBack: () => void;
	};

	let {
		initialName = '',
		initialFamily = 'poppy',
		initialCadence = 'quotidien',
		flowerStyle,
		isEditing = false,
		onSubmit,
		onBack
	}: Props = $props();

	let name = $state(initialName);
	let family = $state<Family>(initialFamily);
	let cadence = $state<Cadence>(initialCadence);

	const FAMILY_LIST = Object.keys(FLOWER_FAMILIES) as Family[];

	const CADENCE_OPTIONS: { value: Cadence; label: string }[] = [
		{ value: 'quotidien', label: 'Quotidien' },
		{ value: 'quelques-fois', label: 'Quelques fois' },
		{ value: 'objectif', label: 'Objectif' }
	];

	const CADENCE_HELP: Record<Cadence, string> = {
		quotidien: 'Chaque jour, à ton rythme.',
		'quelques-fois': 'Quelques fois par semaine, sans pression.',
		objectif: 'Un objectif à atteindre, doucement.'
	};

	function submit(): void {
		onSubmit({ name, family, cadence });
	}
</script>

<button type="button" class="back" onclick={onBack}>← Jardin</button>

<h1>{isEditing ? 'Adapter l’habitude' : 'Nouvelle habitude'}</h1>

<div class="preview">
	<Flower {family} seed={7} bloom={1} style={flowerStyle} size={150} />
</div>

<label class="field">
	<span class="label">Nom</span>
	<input type="text" bind:value={name} placeholder="Nom de l’habitude" />
</label>

<div class="family-picker">
	{#each FAMILY_LIST as candidate (candidate)}
		<button
			type="button"
			class="family-choice"
			class:selected={candidate === family}
			onclick={() => (family = candidate)}
		>
			<Flower family={candidate} seed={7} bloom={1} style={flowerStyle} size={52} />
		</button>
	{/each}
</div>

<SegmentedControl bind:value={cadence} options={CADENCE_OPTIONS} />
<p class="help">{CADENCE_HELP[cadence]}</p>

<Button onclick={submit}>{isEditing ? 'Enregistrer' : 'Planter cette habitude'}</Button>

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

	h1 {
		font-family: var(--font-title);
		font-size: var(--text-h1);
		color: var(--color-text-title);
		text-align: center;
		margin: 12px 0;
	}

	.preview {
		display: flex;
		justify-content: center;
		margin-bottom: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 16px;
	}

	.label {
		font-family: var(--font-body);
		font-size: var(--text-label);
		text-transform: uppercase;
		letter-spacing: var(--label-letter-spacing);
		color: var(--color-text-muted);
	}

	input {
		border: 1px solid var(--color-border-hairline);
		border-radius: var(--radius-button);
		padding: 12px 14px;
		font-family: var(--font-body);
		font-size: var(--text-body);
		background: var(--color-surface-card);
		color: var(--color-text-body);
	}

	.family-picker {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 4px;
		margin-bottom: 16px;
	}

	.family-choice {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 74px;
		height: 74px;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.4);
		border: 1.5px solid var(--color-border-hairline);
		cursor: pointer;
	}

	.family-choice.selected {
		background: rgba(255, 255, 255, 0.85);
		border-color: var(--color-accent);
	}

	.help {
		font-family: var(--font-title);
		font-style: italic;
		font-size: 13px;
		color: var(--color-text-italic);
		margin: 8px 0 20px;
	}
</style>
