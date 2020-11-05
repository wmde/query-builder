import RootState from './RootState';
import Property from '@/data-model/Property';

export default {
	setValue( state: RootState, value: string ): void {
		state.conditionRow.valueData.value = value;
	},
	setProperty( state: RootState, property: Property ): void {
		state.conditionRow.propertyData = property;
	},
};
