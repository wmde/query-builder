import RootState from './RootState';
import Property from '@/data-model/Property';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';
import { getFreshConditionRow, newEmptyPropertyData } from './index';

export default {
	setValue( state: RootState, payload: { value: string; conditionIndex: number } ): void {
		state.conditionRows[ payload.conditionIndex ].valueData.value = payload.value;
	},
	setProperty( state: RootState, payload: { property: Property | null; conditionIndex: number } ): void {
		if ( !payload.property ) {
			state.conditionRows[ payload.conditionIndex ].propertyData = newEmptyPropertyData(
				state.conditionRows[ payload.conditionIndex ].propertyData.propertyError,
			);
		}
		state.conditionRows[ payload.conditionIndex ].propertyData = {
			...state.conditionRows[ payload.conditionIndex ].propertyData,
			...payload.property,
		};
	},
	setPropertyValueRelation( state: RootState,
		payload: { propertyValueRelation: PropertyValueRelation; conditionIndex: number } ): void {
		state.conditionRows[ payload.conditionIndex ].propertyValueRelationData.value = payload.propertyValueRelation;
	},
	setLimit( state: RootState, limit: number ): void {
		state.limit = limit;
	},
	setErrors( state: RootState, errors: Error[] ): void {
		state.errors = errors;
	},
	addCondition( state: RootState ): void {
		state.conditionRows.push( getFreshConditionRow() );
	},
	removeCondition( state: RootState, conditionIndex: number ): void {
		state.conditionRows.splice( conditionIndex, 1 );
	},
	setFieldErrors(
		state: RootState,
		payload: {
			index: number;
			errors: {
				propertyError?: Error|null;
				valueError?: Error|null;
			};
		},
	): void {
		if ( payload.errors.propertyError !== undefined ) {
			state.conditionRows[ payload.index ].propertyData.propertyError = payload.errors.propertyError;
		}
		if ( payload.errors.valueError !== undefined ) {
			state.conditionRows[ payload.index ].valueData.valueError = payload.errors.valueError;
		}
	},
	clearFieldErrors(
		state: RootState,
		payload: {
			conditionIndex: number;
			errorsToClear: 'property'|'value'|'both';
		},
	): void {
		if ( payload.errorsToClear === 'property' || payload.errorsToClear === 'both' ) {
			state.conditionRows[ payload.conditionIndex ].propertyData.propertyError = null;
		}
		if ( payload.errorsToClear === 'value' || payload.errorsToClear === 'both' ) {
			state.conditionRows[ payload.conditionIndex ].valueData.valueError = null;
		}
	},
};
