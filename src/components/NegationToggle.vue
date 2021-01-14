<template>
	<span class="negationToggle">
		<Button
			:type="value==='with' ? 'progressive' : 'neutral'"
			:variant="value==='with' ? 'primary' : 'normal'"
			@click.native="$emit('input', 'with')"
		>{{ $i18n( 'query-builder-negation-option-label-with' ) }}</Button>
		<Button
			:type="value==='without' ? 'progressive' : 'neutral'"
			:variant="value==='without' ? 'primary' : 'normal'"
			@click.native="$emit('input', 'without')"
		>{{ $i18n( 'query-builder-negation-option-label-without' ) }}</Button>
	</span>
</template>

<script lang="ts">
import { Button } from '@wmde/wikit-vue-components';
import Vue from 'vue';

export default Vue.extend( {
	name: 'NegationToggle',
	components: { Button },
	props: {
		value: {
			required: true,
			type: String,
		},
	},
} );
</script>

<style scoped lang="scss">
	.negationToggle {
		white-space: nowrap;
	}
</style>
