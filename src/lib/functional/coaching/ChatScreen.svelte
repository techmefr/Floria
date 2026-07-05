<script lang="ts">
	import { Button } from '$lib/technical/ui-kit';
	import type { IChatTurn } from './chatFlow';
	import type { IHabit } from '$lib/functional/habits';

	type Props = {
		turns: IChatTurn[];
		isLoading?: boolean;
		onSend: (text: string) => void;
		onAcceptSuggestion: (habit: IHabit) => void;
		onAdjustSuggestion: (habit: IHabit) => void;
	};

	let {
		turns,
		isLoading = false,
		onSend,
		onAcceptSuggestion,
		onAdjustSuggestion
	}: Props = $props();

	let draft = $state('');
	let acceptedIds = $state<Record<string, boolean>>({});

	const QUICK_REPLIES = [
		'Lister mes habitudes',
		"J'ai raté plusieurs jours",
		'Adapter une habitude'
	];

	function submit(): void {
		const text = draft.trim();
		if (!text) return;
		onSend(text);
		draft = '';
	}

	function accept(habit: IHabit): void {
		acceptedIds = { ...acceptedIds, [habit.id]: true };
		onAcceptSuggestion(habit);
	}
</script>

<header class="screen-header">
	<span class="label">Accompagnement</span>
	<h1>On en parle, en douceur</h1>
</header>

<div class="thread">
	{#each turns as turn (turn.id)}
		<div class="bubble {turn.role}">{turn.text}</div>
		{#each turn.suggestions as habit (habit.id)}
			<div class="suggestion-card">
				<span class="title">{habit.name}</span>
				<span class="meta">{habit.cadence}</span>
				<div class="actions">
					<Button
						variant={acceptedIds[habit.id] ? 'secondary' : 'primary'}
						onclick={() => accept(habit)}
					>
						{acceptedIds[habit.id] ? '✓ Adopté' : 'Ajouter à mon jardin'}
					</Button>
					<Button variant="secondary" onclick={() => onAdjustSuggestion(habit)}>Ajuster</Button>
				</div>
			</div>
		{/each}
	{/each}
	{#if isLoading}
		<div class="bubble assistant loading">…</div>
	{/if}
</div>

<div class="quick-replies">
	{#each QUICK_REPLIES as reply (reply)}
		<button type="button" class="quick-reply" onclick={() => onSend(reply)}>{reply}</button>
	{/each}
</div>

<form
	class="composer"
	onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}
>
	<input type="text" bind:value={draft} placeholder="Écris ici…" />
	<button type="submit" class="send" aria-label="Envoyer">➤</button>
</form>

<style>
	.screen-header {
		padding: 8px 4px 16px;
	}

	.label {
		font-family: var(--font-body);
		font-size: var(--text-label);
		text-transform: uppercase;
		letter-spacing: var(--label-letter-spacing);
		color: var(--color-text-muted);
	}

	h1 {
		font-family: var(--font-title);
		font-size: var(--text-h1);
		color: var(--color-text-title);
		margin: 4px 0 0;
	}

	.thread {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 8px 0;
	}

	.bubble {
		max-width: 80%;
		padding: 10px 14px;
		border-radius: 16px;
		font-family: var(--font-body);
		font-size: var(--text-body);
		line-height: 1.4;
	}

	.bubble.assistant {
		align-self: flex-start;
		background: var(--color-app-bg);
		color: var(--color-text-body);
	}

	.bubble.user {
		align-self: flex-end;
		background: var(--color-accent);
		color: #fff;
	}

	.suggestion-card {
		align-self: flex-start;
		max-width: 85%;
		background: linear-gradient(135deg, rgba(201, 138, 106, 0.16), rgba(201, 138, 106, 0.05));
		border: 1px solid rgba(201, 138, 106, 0.35);
		border-radius: 16px;
		padding: 12px 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.suggestion-card .title {
		font-family: var(--font-title);
		font-size: 15px;
		color: #8a4f38;
	}

	.suggestion-card .meta {
		font-size: 12.5px;
		color: var(--color-text-muted);
	}

	.actions {
		display: flex;
		gap: 8px;
		margin-top: 6px;
	}

	.quick-replies {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding: 8px 0;
	}

	.quick-reply {
		flex: none;
		border: 1px solid var(--color-border-hairline);
		background: var(--color-surface-card);
		border-radius: 14px;
		padding: 8px 14px;
		font-size: 13px;
		color: var(--color-text-body);
		cursor: pointer;
	}

	.composer {
		display: flex;
		gap: 8px;
		padding: 8px 0;
	}

	.composer input {
		flex: 1;
		border: 1px solid var(--color-border-hairline);
		border-radius: var(--radius-pill);
		padding: 12px 16px;
		font-family: var(--font-body);
		background: var(--color-surface-card);
	}

	.send {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		background: var(--color-accent);
		color: #fff;
		cursor: pointer;
	}
</style>
