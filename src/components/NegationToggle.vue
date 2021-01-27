<template>
	<ToggleButtonGroup
		:value="value"
		class="negationToggle"
	>
		<template v-slot:default>
			<ToggleButton
				value="with"
				@click.native="$emit('input', 'with')"
			>{{ $i18n( 'query-builder-negation-option-label-with' ) }}</ToggleButton>
			<ToggleButton
				value="without"
				@click.native="$emit('input', 'without')"
			>{{ $i18n( 'query-builder-negation-option-label-without' ) }}</ToggleButton>
		</template>
	</ToggleButtonGroup>
</template>

<script lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@wmde/wikit-vue-components';
import Vue from 'vue';

export default Vue.extend( {
	name: 'NegationToggle',
	components: { ToggleButton, ToggleButtonGroup },
	props: {
		value: {
			type: String,
			default: 'with',
		},
	},
} );
</script>

<style scoped lang="scss">
	.negationToggle {
		white-space: nowrap;
	}
</style>
