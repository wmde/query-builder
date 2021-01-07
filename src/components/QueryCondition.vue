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
		<DeleteConditionButton
			class="query-condition__remove"
			:disabled="!canDelete"
			@click="removeCondition"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TextInput } from '@wmde/wikit-vue-components';

import DeleteConditionButton from '@/components/DeleteConditionButton.vue';
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
		removeCondition(): void {
			if ( this.canDelete ) {
				this.$store.dispatch( 'removeCondition', this.conditionIndex );
			}
		},
	},
	computed: {
		canDelete(): boolean {
			return this.$store.getters.conditionRows.length > 1;
		},
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
		DeleteConditionButton,
	},
} );
</script>

<style scoped lang="scss">

	.query-condition {
		display: flex;
		align-items: flex-start;
		padding-block: $dimension-layout-xsmall;
		padding-inline: $dimension-layout-medium;
		background-color: $background-color-base-default;

		&__remove {
			margin-inline-start: auto;
		}
	}

	.query-condition__value-type-dropdown {
		margin-block-start: $dimension-layout-small;
		margin-inline-start: $dimension-layout-xsmall;
	}

	.query-condition__value-input {
		margin-inline-start: $dimension-layout-xsmall;
	}

</style>
