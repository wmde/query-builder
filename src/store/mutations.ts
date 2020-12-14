import RootState from './RootState';
import Property from '@/data-model/Property';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';
import { conditionRow } from './index';

export default {
	setValue( state: RootState, payload: { value: string; conditionIndex: number } ): void {
		state.conditionRows[ payload.conditionIndex ].valueData.value = payload.value;
	},
	setProperty( state: RootState, payload: { property: Property; conditionIndex: number } ): void {
		state.conditionRows[ payload.conditionIndex ].propertyData = payload.property;
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
};
