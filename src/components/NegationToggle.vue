<template>
	<ToggleButtonGroup
		:value="value"
		@input="$emit('input', $event)"
		class="negationToggle"
	>
		<template v-slot:default>
			<ToggleButton
				value="with"
			>
				{{ $i18n( 'query-builder-negation-option-label-with' ) }}
			</ToggleButton>
			<ToggleButton
				value="without"
			>
				{{ $i18n( 'query-builder-negation-option-label-without' ) }}
			</ToggleButton>
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
