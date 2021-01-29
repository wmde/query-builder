import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import RootState from '@/store/RootState';

export function getFreshRootState(): RootState {
	return {
		conditionRows: [ {
			valueData: { value: 'foo', valueError: null },
			propertyData: {
				id: 'P123',
				label: 'abc',
				datatype: 'string',
				isPropertySet: true,
				propertyError: null,
			},
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			conditionId: '0.123',
			subclasses: false,
			negate: false,
		} ],
		limit: 0,
		useLimit: false,
		omitLabels: true,
		errors: [],
	};
}
