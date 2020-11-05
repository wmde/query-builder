export default interface RootState {
	conditionRow: ConditionRow;
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
