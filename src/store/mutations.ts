import RootState from './RootState';
import Property from '@/data-model/Property';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';

export default {
	setValue( state: RootState, value: string ): void {
		state.conditionRow.valueData.value = value;
	},
	setProperty( state: RootState, property: Property ): void {
		state.conditionRow.propertyData = property;
	},
	setPropertyValueRelation( state: RootState, propertyValueRelation: PropertyValueRelation ): void {
		state.conditionRow.propertyValueRelationData.value = propertyValueRelation;
	},
	setErrors( state: RootState, errors: Error[] ): void {
		state.errors = errors;
	},
};
