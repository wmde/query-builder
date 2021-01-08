<template>
	<TextInput
		:label="$i18n('query-builder-input-value-label')"
		@input="$emit('input', $event)"
		:value="value"
		:error="error ? {message: $i18n(error.message), type: error.type} : null"
		:placeholder="$i18n('query-builder-input-value-placeholder')"
		:disabled="disabled"
	/>
</template>

<script lang="ts">

import { TextInput } from '@wmde/wikit-vue-components';
import Vue from 'vue';

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
	},
} );
</script>
