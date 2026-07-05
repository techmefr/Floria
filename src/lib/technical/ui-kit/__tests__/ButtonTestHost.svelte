<script lang="ts">
	import Button from '../Button.svelte';

	type Props = {
		onclick?: () => void;
		isDisabled?: boolean;
	};

	let { onclick, isDisabled = false }: Props = $props();
</script>

<Button {onclick} {isDisabled}>Click me</Button>
