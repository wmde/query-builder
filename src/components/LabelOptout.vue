<template>
	<div class="querybuilder__label-optout">
		<input
			class="querybuilder__label-optout-checkbox"
			type="checkbox"
			id="label-optout"
			v-model="checked"
		/>
		<label for="label-optout">
			<span
				v-i18n="{msg: 'query-builder-label-opt-out'}" />
		</label>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
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
} );
</script>

<style lang="scss">
.querybuilder__label-optout {
	display: flex;
	align-items: flex-end;
	color: $font-color-base;
	// TODO: change to real ones
	font-family: $font-family-style-description;
	margin-block-start: $dimension-layout-medium;

	&-checkbox {
		// TODO: change to real ones
		margin-inline-end: $dimension-layout-xxsmall;
	}
}
</style>
