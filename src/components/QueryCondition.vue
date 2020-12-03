<template>
	<div class="querybuilder__rule">
		<PropertyLookup
			v-model="selectedProperty"
			:error="fieldErrors.property"
		/>
		<ValueTypeDropDown
			v-model="selectedPropertyValueRelation"
			:disabled="limitedSupport"
		/>
		<TextInput
			class="querybuilder__rule__value"
			:label="$i18n('query-builder-input-value-label')"
			ref="value"
			v-model="textInputValue"
			:error="fieldErrors.value ?
				{message: $i18n(fieldErrors.value.message), type: fieldErrors.value.type}: null"
			:placeholder="$i18n('query-builder-input-value-placeholder')"
			:disabled="selectedPropertyValueRelation === propertyValueRelation.Regardless"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TextInput } from '@wmde/wikit-vue-components';

import PropertyLookup from '@/components/PropertyLookup.vue';
import ValueTypeDropDown from '@/components/ValueTypeDropDown.vue';
import SearchResult from '@/data-access/SearchResult';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';
import allowedDatatypes from '@/allowedDataTypes';
import Validator from '@/form/Validator';

export default Vue.extend( {
	name: 'QueryCondition',
	data() {
		return {
			fieldErrors: {
				property: null as null | Error,
				value: null as null | Error,
			},
			limitedSupport: false,
			propertyValueRelation: PropertyValueRelation,
		};
	},
	methods: {
		validate(): void {
			const formValues = {
				property: this.selectedProperty,
				value: this.textInputValue,
				propertyValueRelation: this.selectedPropertyValueRelation,
			};
			const validator = new Validator( formValues );
			const validationResult = validator.validate();
			this.fieldErrors = validationResult.fieldErrors;
			if ( this.selectedProperty !== null ) {
				this.validateForLimitedSupport( this.selectedProperty );
			}
		},
		validateForLimitedSupport( selectedProperty: SearchResult ): void {
			this.limitedSupport = false;
			this.fieldErrors.property = null;
			if ( selectedProperty && !allowedDatatypes.includes( selectedProperty.datatype ) ) {
				this.selectedPropertyValueRelation = PropertyValueRelation.Regardless;
				this.limitedSupport = true;
				this.fieldErrors.property = {
					type: 'warning',
					message: 'query-builder-property-lookup-limited-support-note',
				};
			}
		},
	},
	computed: {
		selectedProperty: {
			get(): SearchResult | null {
				return this.$store.getters.property( 0 );
			},
			set( selectedProperty: SearchResult ): void {
				this.selectedPropertyValueRelation = PropertyValueRelation.Matching;
				this.validateForLimitedSupport( selectedProperty );
				this.$store.dispatch( 'updateProperty', { property: selectedProperty, conditionIndex: 0 } );
			},
		},
		selectedPropertyValueRelation: {
			get(): PropertyValueRelation {
				return this.$store.getters.propertyValueRelation( 0 );
			},
			set( selectedPropertyValueRelation: PropertyValueRelation ): void {
				if ( selectedPropertyValueRelation === PropertyValueRelation.Regardless ) {
					this.textInputValue = '';
				}
				this.$store.dispatch(
					'updatePropertyValueRelation',
					{ propertyValueRelation: selectedPropertyValueRelation, conditionIndex: 0 },
				);
			},
		},
		textInputValue: {
			get(): string { return this.$store.getters.value( 0 ); },
			set( value: string ): void { this.$store.dispatch( 'updateValue', { value, conditionIndex: 0 } ); },
		},
	},
	watch: {
		'$store.state.errors': function (): void {
			this.validate();
		},
	},
	components: {
		TextInput,
		PropertyLookup,
		ValueTypeDropDown,
	},
} );
</script>

<style scoped lang="scss">

	.querybuilder__rule {
		display: flex;
		margin-block-start: $dimension-layout-medium;
		padding-block: $dimension-layout-xsmall;
		padding-inline: $dimension-layout-medium;
	}

	.querybuilder__rule__value {
		margin-inline-start: $dimension-layout-xsmall;
	}

</style>
