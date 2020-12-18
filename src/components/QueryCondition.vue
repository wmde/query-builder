<template>
	<div class="query-condition">
		<PropertyLookup
			class="query-condition__property-lookup"
			v-model="selectedProperty"
			:error="propertyError(conditionIndex)"
		/>
		<ValueTypeDropDown
			class="query-condition__value-type-dropdown"
			v-model="selectedPropertyValueRelation"
			:disabled="limitedSupport(conditionIndex)"
		/>
		<TextInput
			class="query-condition__value-input"
			:label="$i18n('query-builder-input-value-label')"
			ref="value"
			v-model="textInputValue"
			:error="valueError"
			:placeholder="$i18n('query-builder-input-value-placeholder')"
			:disabled="isTextInputDisabled()"
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
import { mapGetters } from 'vuex';

export default Vue.extend( {
	name: 'QueryCondition',
	props: {
		conditionIndex: {
			type: Number,
			required: true,
		},
	},
	methods: {
		isTextInputDisabled(): boolean {
			return this.selectedPropertyValueRelation === PropertyValueRelation.Regardless;
		},
	},
	computed: {
		selectedProperty: {
			get(): SearchResult | null {
				return this.$store.getters.property( this.conditionIndex );
			},
			set( selectedProperty: SearchResult ): void {
				this.$store.dispatch(
					'updateProperty',
					{ property: selectedProperty, conditionIndex: this.conditionIndex },
				);
			},
		},
		selectedPropertyValueRelation: {
			get(): PropertyValueRelation {
				return this.$store.getters.propertyValueRelation( this.conditionIndex );
			},
			set( selectedPropertyValueRelation: PropertyValueRelation ): void {
				if ( selectedPropertyValueRelation === PropertyValueRelation.Regardless ) {
					this.textInputValue = '';
				}
				this.$store.dispatch(
					'updatePropertyValueRelation',
					{ propertyValueRelation: selectedPropertyValueRelation, conditionIndex: this.conditionIndex },
				);
			},
		},
		textInputValue: {
			get(): string { return this.$store.getters.value( this.conditionIndex ); },
			set( value: string ): void {
				this.$store.dispatch( 'updateValue', { value, conditionIndex: this.conditionIndex } );
			},
		},
		valueError(): Error | null {
			const valueError = this.$store.getters.valueError( this.conditionIndex );
			if ( valueError === null ) {
				return null;
			}
			return {
				message: this.$i18n( valueError.message ),
				type: valueError.type,
			};
		},
		...mapGetters( [
			'propertyError',
			'limitedSupport',
		] ),
	},
	components: {
		TextInput,
		PropertyLookup,
		ValueTypeDropDown,
	},
} );
</script>

<style scoped lang="scss">

	.query-condition {
		display: flex;
		align-items: flex-end;
		margin-block-start: $dimension-layout-medium;
		padding-block: $dimension-layout-xsmall;
		padding-inline: $dimension-layout-medium;
	}

	.query-condition__value-type-dropdown {
		margin-inline-start: $dimension-layout-xsmall;
	}

	.query-condition__value-input {
		margin-inline-start: $dimension-layout-xsmall;
	}

</style>
