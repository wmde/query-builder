import RootState from './RootState';
import Property from '@/data-model/Property';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';

export default {
	setValue( state: RootState, payload: { value: string; conditionIndex: number } ): void {
		state.conditionRows[ payload.conditionIndex ].valueData.value = payload.value;
	},
	setProperty( state: RootState, payload: { property: Property; conditionIndex: number } ): void {
		state.conditionRows[ payload.conditionIndex ].propertyData = payload.property;
	},
	setPropertyValueRelation( state: RootState, propertyValueRelation: PropertyValueRelation ): void {
		state.conditionRows[ 0 ].propertyValueRelationData.value = propertyValueRelation;
	},
	setErrors( state: RootState, errors: Error[] ): void {
		state.errors = errors;
	},
};
