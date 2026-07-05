<svg width="0" height="0" style="position:absolute" aria-hidden="true">
	<defs>
		<filter id="wc" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.014 0.02"
				numOctaves="2"
				seed="7"
				result="noise"
			/>
			<feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
			<feGaussianBlur stdDeviation="0.4" />
		</filter>
		<filter id="wc-ink" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.05 0.08"
				numOctaves="2"
				seed="7"
				result="noise"
			/>
			<feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
		</filter>
		<filter id="wc-soft" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.014 0.02"
				numOctaves="2"
				seed="7"
				result="noise"
			/>
			<feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
			<feGaussianBlur stdDeviation="0.4" />
		</filter>
	</defs>
</svg>
