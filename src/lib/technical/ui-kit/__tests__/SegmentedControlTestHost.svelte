<script lang="ts">
	import SegmentedControl from '../SegmentedControl.svelte';

	type Cadence = 'quotidien' | 'quelques-fois' | 'objectif';

	type Props = {
		value: Cadence;
		onchange?: (value: Cadence) => void;
	};

	let { value = $bindable(), onchange }: Props = $props();
</script>

<SegmentedControl
	bind:value
	{onchange}
	options={[
		{ value: 'quotidien', label: 'Quotidien' },
		{ value: 'quelques-fois', label: 'Quelques fois' },
		{ value: 'objectif', label: 'Objectif' }
	]}
/>
