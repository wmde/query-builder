import RootState from '@/store/RootState';
import getters from '@/store/getters';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'getters', () => {
	describe( 'query', () => {
		it( 'returns the QueryRepresentation of the RootState', () => {
			const state: RootState = {
				conditionRow: {
					valueData: { value: 'foo' },
					propertyData: { id: 'P123', label: 'abc' },
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
				},
				errors: [],
			};

			const expectedValue: QueryRepresentation = {
				condition: {
					propertyId: 'P123',
					value: 'foo',
					propertyValueRelation: PropertyValueRelation.Matching,
				},
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );
	} );
} );
