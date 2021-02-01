import RootState, { ConditionRow } from '@/store/RootState';
import SerializedObject from '@/data-model/SerializedObject';

export default class QueryDeserializer {
	public deserialize( queryString: string ): RootState {
		const queryObject = JSON.parse( queryString );
		const conditions: ConditionRow[] = [];
		let conditionId = 1;
		queryObject.conditions.forEach( ( condition: SerializedObject ) => {
			conditions.push(
				{
					propertyData: {
						id: condition.propertyId,
						label: condition.propertyId,
						datatype: condition.propertyDataType,
						isPropertySet: true,
						propertyError: null,
					},
					valueData: {
						value: condition.value,
						valueError: null,
					},
					propertyValueRelationData: {
						value: condition.propertyValueRelation,
					},
					referenceRelation: condition.referenceRelation,
					subclasses: condition.subclasses,
					conditionRelation: condition.conditionRelation,
					negate: condition.negate,
					conditionId: conditionId.toString(),
				},
			);
			conditionId++;
		} );
		return {
			conditionRows: conditions,
			useLimit: queryObject.useLimit,
			limit: queryObject.limit,
			errors: [],
			omitLabels: false,
		};
	}
}
