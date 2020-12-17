import Error from '@/data-model/Error';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default interface RootState {
	conditionRows: ConditionRow[];
	errors: Error[];
}

export interface ConditionRow {
	propertyData: PropertyData;
	valueData: {
		value: string;
		valueError: Error|null;
	};
	propertyValueRelationData: {
		value: PropertyValueRelation;
	};
}

export interface PropertyData {
	id: string;
	label: string;
	datatype: string|null;
	propertyError: Error|null;
}
