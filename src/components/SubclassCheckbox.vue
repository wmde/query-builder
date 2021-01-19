<template>
	<div class="querybuilder__include-subclasses">
		<input
			class="querybuilder__include-subclasses-checkbox"
			type="checkbox"
			:id="id"
			:checked="isChecked"
			@change="$emit( 'subclass-check', $event.target.checked )"
		/>
		<label :for="id">
			<span
				v-i18n="{msg: 'query-builder-include-subclasses'}" />
		</label>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend( {
	name: 'SubclassCheckbox',
	data() {
		return {
			id: `include-subclasses-${Math.random()}`,
		};
	},
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
	align-items: flex-start;
	color: $font-color-base;
	margin-block-start: $dimension-layout-xxsmall;
	// TODO: change to real ones
	font-family: $font-family-style-description;

	&-checkbox {
		// TODO: change to real ones
		margin-inline-end: $dimension-layout-xxsmall;
	}
}
</style>
