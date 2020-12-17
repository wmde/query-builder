import RootState from './RootState';
import Property from '@/data-model/Property';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';
import { conditionRow, newEmptyPropertyData } from './index';

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
	setErrors( state: RootState, errors: Error[] ): void {
		state.errors = errors;
	},
	addCondition( state: RootState ): void {
		state.conditionRows.push( conditionRow );
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
};
