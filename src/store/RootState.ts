import Error from '@/data-model/Error';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default interface RootState {
	conditionRows: ConditionRow[];
	errors: Error[];
}

export interface ConditionRow {
	propertyData: {
		id: string;
		label: string;
	};
	valueData: {
		value: string;
	};
	propertyValueRelationData: {
		value: PropertyValueRelation;
	};
}
