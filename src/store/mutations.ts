import RootState from './RootState';
import Property from '@/data-model/Property';
import Error from '@/data-model/Error';

export default {
	setValue( state: RootState, value: string ): void {
		state.conditionRow.valueData.value = value;
	},
	setProperty( state: RootState, property: Property ): void {
		state.conditionRow.propertyData = property;
	},
	setErrors( state: RootState, errors: Error[] ): void {
		state.errors = errors;
	},
};
