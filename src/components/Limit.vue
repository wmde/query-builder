<template>
	<div class="querybuilder__limit">
		<Checkbox
			class="querybuilder__limit-checkbox"
			id="limit"
			:checked.sync="checked"
			:label="$i18n('query-builder-limit-number-results-description')"
		/>
		<TextInput
			class="querybuilder__limit-input"
			v-model="textInputValue"
			:disabled="!checked"
			:label="$i18n('query-builder-limit-number-screenreader-label')"
			:placeholder="$i18n('query-builder-limit-number-placeholder')"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Checkbox, TextInput } from '@wmde/wikit-vue-components';

export default Vue.extend( {
	name: 'Limit',
	components: {
		Checkbox,
		TextInput,
	},
	computed: {
		textInputValue: {
			// TODO: change after deciding how to validate numbers for TextInput
			get(): string {
				return this.$store.getters.limit.toString();
			},
			set( value: string ): void {
				if ( isNaN( parseInt( value ) ) ) {
					this.$store.dispatch( 'setLimit', null );
					return;
				}
				this.$store.dispatch( 'setLimit', parseInt( value ) );
			},
		},
		checked: {
			// TODO: change after deciding how to validate numbers for TextInput
			get(): boolean {
				return this.$store.getters.useLimit;
			},
			set( value: boolean ): void {
				this.$store.dispatch( 'setUseLimit', value );
			},
		},
	},
} );
</script>

<style lang="scss">

.querybuilder__limit {
	display: flex;
	align-items: center;
}

.querybuilder__limit-input {
	// TODO: change to real ones
	margin-inline-start: $dimension-layout-small;

	//hides the label of the TextInput while still allowing to be used by screen readers
	.wikit-TextInput__label {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		-webkit-clip-path: inset(50%);
		clip-path: inset(50%);
		border: 0;
	}
}

.querybuilder__limit-checkbox {
	// TODO: change to real ones
	margin-inline-end: $dimension-layout-xxsmall;
}
</style>
