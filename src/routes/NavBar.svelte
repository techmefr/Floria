<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';

	const ITEMS = [
		{ href: '/', label: 'Jardin', isFab: false },
		{ href: '/nouveau', label: '＋', isFab: true },
		{ href: '/chat', label: 'Écouter', isFab: false },
		{ href: '/profil', label: 'Profil', isFab: false }
	] as const;
</script>

<nav class="navbar">
	<div class="navbar-inner">
		{#each ITEMS as item (item.href)}
			<a
				href={resolve(item.href)}
				class="nav-item"
				class:active={$page.url.pathname === item.href}
				class:fab={item.isFab}
			>
				{item.label}
			</a>
		{/each}
	</div>
</nav>

<style>
	.navbar {
		background: var(--color-app-bg);
		border-top: 1px solid var(--color-border-hairline);
		padding: 10px calc(16px + env(safe-area-inset-left)) calc(10px + env(safe-area-inset-bottom))
			calc(16px + env(safe-area-inset-right));
	}

	.navbar-inner {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		max-width: 640px;
		margin: 0 auto;
	}

	@media (min-width: 900px) {
		.navbar-inner {
			max-width: 760px;
		}
	}

	.nav-item {
		font-family: var(--font-body);
		font-size: 12.5px;
		color: var(--color-text-muted);
		text-decoration: none;
		padding: 6px 10px;
		border-radius: var(--radius-pill);
	}

	.nav-item.active {
		color: var(--color-accent);
		font-weight: 600;
	}

	.nav-item.fab {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--color-accent);
		color: #fff;
		font-size: 20px;
		box-shadow: var(--shadow-fab);
		margin-top: -22px;
	}
</style>
