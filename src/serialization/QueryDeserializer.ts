import RootState, { ConditionRow, PropertyData, Value } from '@/store/RootState';
import SerializedCondition from '@/data-model/SerializedObject';

export default class QueryDeserializer {
	public deserialize( queryString: string ): RootState {
		const queryObject = JSON.parse( queryString );
		const conditions: ConditionRow[] = [];
		let conditionId = 1;
		queryObject.conditions.forEach( ( condition: SerializedCondition ) => {
			conditions.push(
				{
					propertyData: this.getPropertyData( condition ),
					valueData: {
						value: this.getConditionValue( condition ),
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
			omitLabels: queryObject.omitLabels,
		};
	}

	private getPropertyData( condition: SerializedCondition ): PropertyData {
		return {
			id: condition.propertyId,
			label: condition.propertyId,
			datatype: condition.propertyDataType,
			isPropertySet: condition.propertyId !== '',
			propertyError: null,
		};
	}

	private getConditionValue( condition: SerializedCondition ): Value {
		if ( condition.value === '' || condition.value === null ) {
			return null;
		}
		if ( condition.propertyDataType === 'wikibase-item' ) {
			return {
				id: condition.value,
				label: condition.value,
			};
		}
		return condition.value;
	}
}
