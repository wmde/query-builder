import QuerySerializer from '@/serialization/QuerySerializer';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import RootState, { ConditionRow } from '@/store/RootState';

function getStateConditionRow( propertyId: string, value: string ): ConditionRow {
	const simpleCondition =
		{
			propertyData: {
				id: propertyId,
				label: 'some string',
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
			subclasses: false,
			negate: false,
			conditionId: '123',
		};

	return simpleCondition;
}

describe( 'QuerySerializer', () => {

	it( 'serializes a serialized object for sharing in a URL', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const propertyDataType = 'string';
		const limit = 10;
		const useLimit = true;
		const serializer = new QuerySerializer();
		const givenStore: RootState = {
			conditionRows: [ getStateConditionRow( propertyId, value ) ],
			limit,
			useLimit,
			errors: [],
			omitLabels: false,
		};
		const expectedSerialization = `
			{"conditions":[{
				"propertyId":"${propertyId}",
				"propertyDataType":"${propertyDataType}",
				"propertyValueRelation":"matching",
				"value":"${value}",
				"subclasses":false,
				"negate":false}],
			"limit":${limit},
			"useLimit":${useLimit}}
		`;
		expect( serializer.serialize( givenStore ) ).toEqual( expectedSerialization.replace( /\s+/g, '' ) );
	} );

} );
