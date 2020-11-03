import Error from '@/data-model/Error';

export default interface RootState {
	conditionRow: ConditionRow;
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
}
