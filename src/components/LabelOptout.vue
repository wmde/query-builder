<template>
	<div class="querybuilder__label-optout">
		<Checkbox
			class="querybuilder__label-optout-checkbox"
			id="label-optout"
			:checked.sync="checked"
			:label="$i18n('query-builder-label-opt-out')"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Checkbox } from '@wmde/wikit-vue-components';

export default Vue.extend( {
	name: 'LabelOptout',
	computed: {
		checked: {
			get(): boolean {
				return this.$store.getters.omitLabels;
			},
			set( value: boolean ): void {
				this.$store.dispatch( 'setOmitLabels', value );
			},
		},
	},
	components: {
		Checkbox,
	},
} );
</script>

<style lang="scss">
.querybuilder__label-optout {
	display: flex;
	align-items: flex-end;
	margin-block-start: $dimension-layout-xsmall;
}
</style>
