import RootState, { ConditionRow, ItemValue } from '@/store/RootState';
import SerializedObject from '@/data-model/SerializedObject';

export default class QuerySerializer {
	public serialize( state: RootState ): string {
		const conditions: SerializedObject[] = [];
		state.conditionRows.forEach( ( condition: ConditionRow ) => {
			conditions.push(
				{
					propertyId: condition.propertyData.isPropertySet ? condition.propertyData.id : '',
					propertyDataType: condition.propertyData.datatype,
					propertyValueRelation: condition.propertyValueRelationData.value,
					referenceRelation: condition.referenceRelation,
					value: this.getValueFromCondition( condition ),
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
			omitLabels: state.omitLabels,
		} );
	}

	private getValueFromCondition( condition: ConditionRow ): string {
		if ( !condition.valueData.value ) {
			return ''; // maybe better return null?
		}
		if ( condition.propertyData.datatype === 'wikibase-item' ) {
			return ( condition.valueData.value as ItemValue ).id;
		}
		return condition.valueData.value as string;
	}
}
