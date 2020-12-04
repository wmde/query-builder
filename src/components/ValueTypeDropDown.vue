<template>
	<div class="querybuilder__dropdown">
		<label id="valueTypeSelect"
			class="querybuilder__dropdown-label">
			Value Type
		</label>
		<Dropdown
			class="querybuilder__dropdown-select"
			v-model="selectedItem"
			aria-labelledby="valueTypeSelect"
			:menuItems="optionItems"
		/>
	</div>

</template>

<script lang="ts">
import Vue from 'vue';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

import { Dropdown } from '@wmde/wikit-vue-components';

export default Vue.extend( {
	name: 'ValueTypeDropDown',
	data() {
		return {
			selectedItem: {
				label: PropertyValueRelation.Matching,
				description: '',
			},
			optionItems: Object.values( PropertyValueRelation ).map( ( value: PropertyValueRelation ) => {
				return { label: value, description: '' };
			} ),
		};
	},
	props: {
		value: {
			type: String,
			default: null,
		},
	},
	computed: {
		selected: {
			get(): PropertyValueRelation {
				return this.selectedItem.label;
			},
			set( selectedOption: PropertyValueRelation ): void {
				this.selectedItem = {
					label: selectedOption,
					description: '',
				};
			},
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
	components: {
		Dropdown,
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
			margin-block-start: 21px;
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
