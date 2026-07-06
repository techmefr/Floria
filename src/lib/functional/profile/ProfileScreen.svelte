<script lang="ts">
	import { Card, Button, SegmentedControl, Slider } from '$lib/technical/ui-kit';
	import { FONT_SCALE_STEPS } from '$lib/technical/accessibility';
	import { SUPPORTED_LOCALES } from '$lib/technical/i18n';
	import { AI_PROVIDERS } from '$lib/technical/ai-client';
	import type { AuthState } from '$lib/technical/auth';
	import type { IPreferences, GardenLayout, FlowerStyle, AiProvider } from './types';

	type Props = {
		preferences: IPreferences;
		authState: AuthState;
		userEmail?: string;
		onUpdate: (patch: Partial<IPreferences>) => void;
		onLogin: () => void;
		onLoginWithGoogle: () => void;
		onLogout: () => void;
		onExportData: () => void;
		onReset: () => void;
	};

	let {
		preferences,
		authState,
		userEmail,
		onUpdate,
		onLogin,
		onLoginWithGoogle,
		onLogout,
		onExportData,
		onReset
	}: Props = $props();

	const GARDEN_LAYOUT_OPTIONS: { value: GardenLayout; label: string }[] = [
		{ value: 'prairie', label: 'Prairie' },
		{ value: 'constellation', label: 'Constellation' },
		{ value: 'parterres', label: 'Parterres' }
	];

	const FLOWER_STYLE_OPTIONS: { value: FlowerStyle; label: string }[] = [
		{ value: 'aquarelle', label: 'Aquarelle' },
		{ value: 'encre', label: 'Encre' },
		{ value: 'pastel', label: 'Pastel' }
	];

	let fontScaleIndex = $derived(
		Math.max(
			0,
			FONT_SCALE_STEPS.findIndex((step) => step.value === preferences.fontScale)
		)
	);

	function setFontScaleIndex(index: number): void {
		onUpdate({ fontScale: FONT_SCALE_STEPS[index].value });
	}

	function setAiProvider(value: string): void {
		onUpdate({ aiProvider: (value || null) as AiProvider | null });
	}
</script>

<header class="screen-header">
	<h1>Profil</h1>
</header>

<Card>
	<div class="account-row">
		<div class="avatar">{(userEmail ?? '?').charAt(0).toUpperCase()}</div>
		<div class="account-info">
			<span class="name">{authState === 'authenticated' ? (userEmail ?? '') : 'Invité'}</span>
			<span class="hint">
				{authState === 'authenticated'
					? 'Connecté — tes données se synchronisent.'
					: 'Hors ligne — connecte-toi pour synchroniser.'}
			</span>
		</div>
		{#if authState === 'authenticated'}
			<Button variant="secondary" onclick={onLogout}>Se déconnecter</Button>
		{:else}
			<div class="login-actions">
				<Button onclick={onLogin}>Recevoir un lien par e-mail</Button>
				<Button variant="secondary" onclick={onLoginWithGoogle}>Continuer avec Google</Button>
			</div>
		{/if}
	</div>
</Card>

<Card>
	<span class="title">Apparence du jardin</span>
	<div class="field">
		<span class="label">Composition</span>
		<SegmentedControl
			options={GARDEN_LAYOUT_OPTIONS}
			value={preferences.gardenLayout}
			onchange={(value) => onUpdate({ gardenLayout: value })}
		/>
	</div>
	<div class="field">
		<span class="label">Style des fleurs</span>
		<SegmentedControl
			options={FLOWER_STYLE_OPTIONS}
			value={preferences.flowerStyle}
			onchange={(value) => onUpdate({ flowerStyle: value })}
		/>
	</div>
</Card>

<Card>
	<span class="title">Accessibilité &amp; lecture</span>
	<div class="field">
		<Slider
			min={0}
			max={FONT_SCALE_STEPS.length - 1}
			step={1}
			value={fontScaleIndex}
			label="Taille du texte — {FONT_SCALE_STEPS[fontScaleIndex].label}"
			onchange={setFontScaleIndex}
		/>
	</div>
	<label class="toggle-row">
		<span>Contraste renforcé</span>
		<input
			type="checkbox"
			checked={preferences.highContrast}
			onchange={(event) => onUpdate({ highContrast: event.currentTarget.checked })}
		/>
	</label>
	<label class="toggle-row">
		<span>Réduire les animations</span>
		<input
			type="checkbox"
			checked={preferences.reduceMotion}
			onchange={(event) => onUpdate({ reduceMotion: event.currentTarget.checked })}
		/>
	</label>
</Card>

<Card>
	<span class="title">Langue</span>
	<select
		value={preferences.locale}
		onchange={(event) => onUpdate({ locale: event.currentTarget.value })}
	>
		{#each SUPPORTED_LOCALES as locale (locale)}
			<option value={locale}>{locale.toUpperCase()}</option>
		{/each}
	</select>
</Card>

<Card>
	<span class="title">Rappels</span>
	<label class="toggle-row">
		<span>Rappels doux</span>
		<input
			type="checkbox"
			checked={preferences.reminders.enabled}
			onchange={(event) =>
				onUpdate({ reminders: { ...preferences.reminders, enabled: event.currentTarget.checked } })}
		/>
	</label>
	{#if preferences.reminders.enabled}
		<input
			type="time"
			value={preferences.reminders.time ?? ''}
			onchange={(event) =>
				onUpdate({ reminders: { ...preferences.reminders, time: event.currentTarget.value } })}
		/>
	{/if}
</Card>

<Card>
	<span class="title">IA d’accompagnement</span>
	<p class="hint">
		Utilise ta propre clé API — elle reste stockée en local sur cet appareil, jamais envoyée à nos
		serveurs.
	</p>
	<div class="field">
		<span class="label">Fournisseur</span>
		<select
			value={preferences.aiProvider ?? ''}
			onchange={(event) => setAiProvider(event.currentTarget.value)}
		>
			<option value="">Aucun</option>
			{#each AI_PROVIDERS as provider (provider.id)}
				<option value={provider.id}>{provider.label}</option>
			{/each}
		</select>
	</div>
	{#if preferences.aiProvider}
		<div class="field">
			<span class="label">Clé API</span>
			<input
				type="password"
				autocomplete="off"
				placeholder="Colle ta clé API ici"
				value={preferences.aiApiKey ?? ''}
				onchange={(event) => onUpdate({ aiApiKey: event.currentTarget.value || null })}
			/>
		</div>
	{/if}
</Card>

<Card>
	<span class="title">Données</span>
	<div class="data-actions">
		<Button variant="secondary" onclick={onExportData}>Exporter mes données</Button>
		<Button variant="secondary" onclick={onReset}>Réinitialiser</Button>
	</div>
	<p class="hint">Tes données vivent d’abord en local ; la connexion ne fait que synchroniser.</p>
</Card>

<style>
	.screen-header {
		padding: 8px 4px 16px;
	}

	h1 {
		font-family: var(--font-title);
		font-size: var(--text-h1);
		color: var(--color-text-title);
		margin: 0;
	}

	.title {
		display: block;
		font-family: var(--font-title);
		font-size: var(--text-card-title);
		color: var(--color-text-body);
		margin-bottom: 10px;
	}

	.account-row {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.login-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.avatar {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--color-app-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-title);
		color: var(--color-text-title);
	}

	.account-info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.name {
		font-family: var(--font-body);
		font-weight: 600;
		color: var(--color-text-body);
	}

	.hint {
		font-size: 12px;
		color: var(--color-text-muted);
	}

	.field {
		margin-bottom: 14px;
	}

	.label {
		display: block;
		font-family: var(--font-body);
		font-size: var(--text-label);
		text-transform: uppercase;
		letter-spacing: var(--label-letter-spacing);
		color: var(--color-text-muted);
		margin-bottom: 6px;
	}

	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
		font-family: var(--font-body);
		color: var(--color-text-body);
	}

	.data-actions {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	select,
	input[type='time'],
	input[type='password'] {
		width: 100%;
		border: 1px solid var(--color-border-hairline);
		border-radius: var(--radius-button);
		padding: 10px 12px;
		font-family: var(--font-body);
		background: var(--color-surface-card);
	}
</style>
