<template>
	<TextInput
		:label="$i18n('query-builder-input-value-label')"
		@input="$emit('input', $event)"
		:value="value"
		:error="error ? {message: $i18n(error.message), type: error.type} : null"
		:placeholder="$i18n('query-builder-input-value-placeholder')"
		:disabled="disabled"
	>
		<template v-slot:suffix>
			<InfoTooltip
				position="end"
				:message="$i18n('query-builder-input-value-tooltip')"
			/></template>
	</TextInput>
</template>

<script lang="ts">

import { TextInput } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import InfoTooltip from '@/components/InfoTooltip.vue';

export default Vue.extend( {
	name: 'StringValueInput',
	props: {
		value: {
			type: String,
			default: null,
		},
		error: {
			type: Object,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		TextInput,
		InfoTooltip,
	},
} );
</script>
