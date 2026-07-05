<script lang="ts">
	import Chip from '../Chip.svelte';

	type Props = {
		onclick?: () => void;
		isActive?: boolean;
	};

	let { onclick, isActive = false }: Props = $props();
</script>

<Chip {onclick} {isActive}>Méditation</Chip>
