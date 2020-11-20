<template>
	<select
		class="querybuilder__dropdown"
		v-model="selected"
	>
		<option
			class="querybuilder__dropdown-option"
			v-for="(optionItem, index) in optionItems"
			:value="optionItem"
			:key="index"
		>
			{{ optionItem }}
		</option>
	</select>
</template>

<script lang="ts">
import Vue from 'vue';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default Vue.extend( {
	name: 'ValueTypeDropDown',
	data() {
		return {
			selected: PropertyValueRelation.Matching,
			optionItems: PropertyValueRelation,
		};
	},
	props: {
		value: {
			type: String,
			default: null,
		},
	},
	watch: {
		selected(): void {
			this.$emit( 'input', this.selected );
		},
		value( selectedOption: PropertyValueRelation ): void {
			this.selected = selectedOption;
		},
	},
} );
</script>
<style scoped lang="scss">
	// will be removed once dropdown component is implemented in the DS
	.querybuilder__dropdown {
		width: 256px;
		height: 32px;
		margin-inline-start: $dimension-layout-xsmall;
		margin-block-start: 23px;
		border-color: #a2a9b1;
		border-style: solid;
		border-width: 1px;
		border-radius: 2px;
		appearance: auto;
	}
</style>
