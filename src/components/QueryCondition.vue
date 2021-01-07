<template>
	<div class="query-condition">
		<DeleteConditionButton
			class="query-condition__remove"
			:disabled="!canDelete"
			@click="removeCondition"
		/>
		<div class="query-condition__toggle-button-group">
			<Button disabled="true" style="border-right: 1px darkgrey solid;">with</Button>
			<Button disabled="true">without</Button>
		</div>
		<div class="query-condition__input-container">
			<div>
				<PropertyLookup
					class="query-condition__property-lookup"
					v-model="selectedProperty"
					:error="propertyError(conditionIndex)"
				/>
			</div>
			<div>
				<ValueTypeDropDown
					class="query-condition__value-type-dropdown"
					v-model="selectedPropertyValueRelation"
					:disabled="limitedSupport(conditionIndex)"
				/>
			</div>
			<div>
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
			<div>
				<Dropdown
					class="query-condition__references"
					label="References"
					placeholder="with and without references"
					:disabled="true"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Dropdown, TextInput, Button } from '@wmde/wikit-vue-components';

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
		Dropdown,
		Button,
	},
} );
</script>

<style scoped lang="scss">
$clearWidth: 671px; // Todo: We probably don't want a magic number here

.query-condition {
	padding-block: $dimension-layout-xsmall;
	padding-inline: $dimension-layout-xsmall;
	background-color: $background-color-base-default;

	&__remove {
		margin-inline-start: $dimension-layout-small;
		float: inline-end;
	}

	&__toggle-button-group {
		white-space: nowrap;
		float: inline-start;
		margin-block-start: $dimension-layout-small;
		margin-inline-end: $dimension-layout-large;

		@media (max-width: $clearWidth) {
			margin-block-start: 0;
			margin-inline-end: 0;
		}
	}

	&__input-container {
		display: grid;
		// Todo: those 17em were chosen by trial to play nice with the 671px $clearWidth - not ideal
		grid-template-columns: repeat(auto-fit, minmax(17em, 1fr));
		grid-gap: $dimension-layout-xsmall;

		@media (max-width: $clearWidth) {
			padding-block-start: $dimension-layout-small;
			clear: both;
		}
	}
}

.query-condition__value-type-dropdown {
	margin-block-start: $dimension-layout-small;
}

</style>
