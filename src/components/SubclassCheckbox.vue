<template>
	<div class="querybuilder__include-subclasses">
		<input
			class="querybuilder__include-subclasses-checkbox"
			type="checkbox"
			id="include-subclasses"
			:checked="isChecked"
			@change="$emit( 'subclass-check', $event )"
		/>
		<label for="include-subclasses">
			<span
				v-i18n="{msg: 'query-builder-include-subclasses'}" />
		</label>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend( {
	name: 'SubclassCheckbox',
	props: {
		isChecked: {
			type: Boolean,
			required: true,
		},
	},
} );
</script>

<style lang="scss">
.querybuilder__include-subclasses {
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
