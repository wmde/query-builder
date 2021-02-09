import QueryDeserializer from '@/serialization/QueryDeserializer';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import RootState, { ConditionRow, Value } from '@/store/RootState';
import ReferenceRelation from '@/data-model/ReferenceRelation';

function getStateConditionRow( propertyId: string, value: Value, datatype = 'string' ): ConditionRow {
	const simpleCondition =
		{
			propertyData: {
				id: propertyId,
				label: propertyId,
				datatype,
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
			referenceRelation: ReferenceRelation.Regardless,
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
				"referenceRelation":"regardless",
				"value":"${value}",
				"subclasses":false,
				"conditionRelation":null,
				"negate":false}],
			"limit":${limit},
			"useLimit":${useLimit},
			"omitLabels":false}
		`;
		expect( deserializer.deserialize( givenSerializedString ) ).toEqual( expectedRootState );
	} );

	it( 'deserializes a condition with wikibase-item property datatype and value', () => {
		const givenSerialization = `
			{"conditions":[{
				"propertyId":"P31",
				"propertyDataType":"wikibase-item",
				"propertyValueRelation":"matching",
				"referenceRelation":"regardless",
				"value":"Q5",
				"subclasses":false,
				"conditionRelation":null,
				"negate":false}],
			"limit":100,
			"useLimit":true,
			"omitLabels": false}
		`;
		const deserializer = new QueryDeserializer();

		const deserializedState = deserializer.deserialize( givenSerialization );

		const expectedState: RootState = {
			conditionRows: [
				getStateConditionRow( 'P31', { label: 'Q5', id: 'Q5' }, 'wikibase-item' ),
			],
			limit: 100,
			useLimit: true,
			omitLabels: false,
			errors: [],
		};
		expect( deserializedState ).toStrictEqual( expectedState );
	} );

	it( 'throws an exception for an invalid query string', () => {
		const deserializer = new QueryDeserializer();
		expect( () => deserializer.deserialize( '{"foo":"bar"}' ) ).toThrow();
	} );

	it( 'throws an exception for a query string that is not valid JSON', () => {
		const deserializer = new QueryDeserializer();
		expect( () => deserializer.deserialize( 'foo=bar' ) ).toThrow();
	} );

} );
