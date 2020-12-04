<template>
	<div class="querybuilder__dropdown">
		<label id="valueTypeSelect"
			class="querybuilder__dropdown-label">
			Value Type
		</label>
		<Dropdown
			class="querybuilder__dropdown-select"
			@input="onInput"
			:value="selected"
			aria-labelledby="valueTypeSelect"
			:menuItems="optionItems"
		/>
	</div>

</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import { Dropdown } from '@wmde/wikit-vue-components';

interface PropertyValueRelationMenuItem extends MenuItem {
	value: PropertyValueRelation;
}

export default Vue.extend( {
	name: 'ValueTypeDropDown',
	props: {
		value: {
			type: String as PropType<PropertyValueRelation>,
			required: true,
		},
	},
	methods: {
		onInput( event: PropertyValueRelationMenuItem ): void {
			this.$emit( 'input', event.value );
		},
	},
	computed: {
		optionItems(): PropertyValueRelationMenuItem[] {
			return Object.values( PropertyValueRelation ).map( ( value: PropertyValueRelation ) => {
				return {
					label: value, // FIXME: replace with i18n -> T269453
					description: '',
					value,
				};
			} );
		},
		selected(): PropertyValueRelationMenuItem | null {
			return this.optionItems.find(
				( option: PropertyValueRelationMenuItem ) => option.value === this.value,
			) || null;
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
