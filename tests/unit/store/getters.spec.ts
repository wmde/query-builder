import RootState from '@/store/RootState';
import getters from '@/store/getters';
import QueryRepresentation from '@/sparql/QueryRepresentation';

describe( 'getters', () => {
	describe( 'query', () => {
		it( 'returns the QueryRepresentation of the RootState', () => {
			const state: RootState = {
				conditionRow: {
					valueData: { value: 'foo' },
					propertyData: { id: 'P123', label: 'abc' },
				},
				errors: [],
			};

			const expectedValue: QueryRepresentation = {
				condition: {
					propertyId: 'P123',
					value: 'foo',
				},
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );
	} );
} );
