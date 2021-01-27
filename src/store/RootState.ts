import Error from '@/data-model/Error';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ConditionRelation from '@/data-model/ConditionRelation';

export default interface RootState {
	conditionRows: ConditionRow[];
	errors: Error[];
	limit: number;
	useLimit: boolean;
	omitLabels: boolean;
}

export interface ItemValue {
	id: string;
	label: string;
}

export type StringValue = string;

export type Value = ItemValue | StringValue | null;

export interface ConditionRow {
	propertyData: PropertyData;
	valueData: {
		value: Value;
		valueError: Error|null;
	};
	propertyValueRelationData: {
		value: PropertyValueRelation;
	};
	subclasses: boolean;
	// conditionRelation between the current condition and the condition above.
	// If there is only one condition this property = null
	conditionRelation: ConditionRelation | null;
	negate: boolean;
	readonly conditionId: string;
}

export interface PropertyData {
	id: string;
	label: string;
	datatype: string|null;
	propertyError: Error|null;
	isPropertySet: boolean;
}
