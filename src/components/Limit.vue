<template>
	<div class="querybuilder__limit">
		<input
			class="querybuilder__limit-checkbox"
			type="checkbox"
			id="limit"
			v-model="checked"
		/>
		<label for="limit">
			<span
				v-i18n="{msg: 'query-builder-limit-number-results-description'}" />
		</label>
		<TextInput
			class="querybuilder__limit-input"
			v-model="textInputValue"
			:disabled="!checked"
			:label="$i18n('query-builder-limit-number-results-description')"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TextInput } from '@wmde/wikit-vue-components';

export default Vue.extend( {
	name: 'Limit',
	components: {
		TextInput,
	},
	data() {
		return {
			checked: true,
		};
	},
	computed: {
		textInputValue: {
			// TODO: change after deciding how to validate numbers for TextInput
			get(): ( string | undefined ) {
				return this.$store.getters.limit?.toString();
			},
			set( value: string ): void {
				this.$store.dispatch( 'setLimit', parseInt( value ) );
			},
		},
	},
} );
</script>

<style scoped lang="scss">

.querybuilder__limit {
	display: flex;
	align-items: flex-end;
	color: $font-color-base;
	// TODO: change to real ones
	font-family: $font-family-style-description;
	margin-block-start: $dimension-layout-medium;
}

.querybuilder__limit-input {
	// TODO: change to real ones
	margin-inline-start: $dimension-layout-xxsmall;
}

.querybuilder__limit-checkbox {
	// TODO: change to real ones
	margin-inline-end: $dimension-layout-xxsmall;
}
</style>
