import QueryDeserializer from '@/serialization/QueryDeserializer';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import RootState, { ConditionRow } from '@/store/RootState';

function getStateConditionRow( propertyId: string, value: string ): ConditionRow {
	const simpleCondition =
		{
			propertyData: {
				id: propertyId,
				label: propertyId,
				datatype: 'string',
				isPropertySet: true,
				propertyError: null,
			},
			valueData: {
				value,
				valueError: null,
			},
			propertyValueRelationData: {
				value: PropertyValueRelation.Matching,
			},
			conditionRelation: null,
			subclasses: false,
			negate: false,
			conditionId: '1',
		};

	return simpleCondition;
}

describe( 'QueryDeserializer', () => {

	it( 'deserializes the serializedObject and converts it to Rootstate', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const propertyDataType = 'string';
		const limit = 10;
		const useLimit = true;
		const deserializer = new QueryDeserializer();
		const expectedRootState: RootState = {
			conditionRows: [ getStateConditionRow( propertyId, value ) ],
			limit,
			useLimit,
			errors: [],
			omitLabels: false,
		};
		const givenSerializedString = `
			{"conditions":[{
				"propertyId":"${propertyId}",
				"propertyDataType":"${propertyDataType}",
				"propertyValueRelation":"matching",
				"value":"${value}",
				"subclasses":false,
				"conditionRelation":null,
				"negate":false}],
			"limit":${limit},
			"useLimit":${useLimit}}
		`;
		expect( deserializer.deserialize( givenSerializedString ) ).toEqual( expectedRootState );
	} );

} );
