<template>
	<div class="querybuilder__dropdown">
		<label class="querybuilder__dropdown-label">Value Type</label>
		<select
			class="querybuilder__dropdown-select"
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
	</div>

</template>

<script lang="ts">
import Vue from 'vue';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default Vue.extend( {
	name: 'ValueTypeDropDown',
	data() {
		return {
			selected: '',
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
		&-select {
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

		&-label {
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
</style>
