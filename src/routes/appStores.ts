import { getContext, setContext } from 'svelte';
import { preferencesStore as kv } from '$lib/technical/database';
import { createHabitsStore, type IHabitsStore } from '$lib/functional/habits';
import { createSessionStore, type ISessionStore } from '$lib/functional/session';
import { createPreferencesStore, type IPreferencesStore } from '$lib/functional/profile';

const APP_STORES_KEY = Symbol('floria-app-stores');

export interface IAppStores {
	habits: IHabitsStore;
	session: ISessionStore;
	preferences: IPreferencesStore;
}

export function createAppStores(): IAppStores {
	return {
		habits: createHabitsStore(kv),
		session: createSessionStore(kv),
		preferences: createPreferencesStore(kv)
	};
}

export function setAppStores(stores: IAppStores): void {
	setContext(APP_STORES_KEY, stores);
}

export function getAppStores(): IAppStores {
	return getContext<IAppStores>(APP_STORES_KEY);
}
