import RootState, { ConditionRow, ItemValue } from '@/store/RootState';
import SerializedObject from '@/data-model/SerializedObject';

export default class QuerySerializer {
	public serialize( state: RootState ): string {
		const conditions: SerializedObject[] = [];
		state.conditionRows.forEach( ( condition: ConditionRow ) => {
			conditions.push(
				{
					propertyId: condition.propertyData.id,
					propertyDataType: condition.propertyData.datatype,
					propertyValueRelation: condition.propertyValueRelationData.value,
					referenceRelation: condition.referenceRelation,
					value: condition.propertyData.datatype === 'wikibase-item' ?
						( condition.valueData.value as ItemValue ).id : condition.valueData.value,
					subclasses: condition.subclasses,
					conditionRelation: condition.conditionRelation,
					negate: condition.negate,
				},
			);
		} );
		return JSON.stringify( {
			conditions,
			limit: state.limit,
			useLimit: state.useLimit,
		} );
	}
}
