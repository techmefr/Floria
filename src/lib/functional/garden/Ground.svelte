<script lang="ts">
	const TUFT_X_POSITIONS = [36, 88, 150, 205, 262, 318, 360];
</script>

<g>
	<ellipse
		cx="195"
		cy="308"
		rx="235"
		ry="42"
		fill="hsl(96 30% 62%)"
		opacity="0.34"
		filter="url(#wc)"
	/>
	<ellipse
		cx="110"
		cy="302"
		rx="130"
		ry="26"
		fill="hsl(84 32% 58%)"
		opacity="0.3"
		filter="url(#wc)"
	/>
	<ellipse
		cx="300"
		cy="304"
		rx="135"
		ry="24"
		fill="hsl(120 26% 60%)"
		opacity="0.28"
		filter="url(#wc)"
	/>
	{#each TUFT_X_POSITIONS as x (x)}
		<path
			d="M {x} 302 q 3 -17 6 -21"
			stroke="hsl(100 30% 50%)"
			stroke-width="2"
			fill="none"
			opacity="0.5"
			filter="url(#wc-soft)"
		/>
	{/each}
</g>
