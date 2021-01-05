import RootState from '@/store/RootState';
import getters from '@/store/getters';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'getters', () => {

	describe( 'limitedSupport', () => {
		it( 'returns false if the datatype is supported', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: '', valueError: null },
					datatype: 'string',
					propertyData: { id: 'P123', label: 'abc', propertyError: null },
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				errors: [],
				limit: 0,
				useLimit: false,
			};

			expect( getters.limitedSupport( state )( 0 ) ).toBe( false );
		} );

		it( 'returns false the property is empty', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: '', valueError: null },
					datatype: null,
					propertyData: { id: '', label: '', propertyError: null },
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 0,
				errors: [],
				useLimit: false,
			};

			expect( getters.limitedSupport( state )( 0 ) ).toBe( false );
		} );

		it( 'returns true the datatype is unsupported', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: '', valueError: null },
					datatype: 'I am not supported',
					propertyData: {
						id: 'P123',
						label: 'Lorem Ipsum',
						propertyError: null,
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 0,
				useLimit: false,
				errors: [],
			};

			expect( getters.limitedSupport( state )( 0 ) ).toBe( true );
		} );
	} );

	describe( 'query', () => {
		it( 'returns the QueryRepresentation of the RootState', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: 'foo', valueError: null },
					datatype: 'string',
					propertyData: { id: 'P123', label: 'abc', propertyError: null },
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 0,
				useLimit: false,
				errors: [],
			};

			const expectedValue: QueryRepresentation = {
				conditions: [
					{
						propertyId: 'P123',
						value: 'foo',
						propertyValueRelation: PropertyValueRelation.Matching,
						datatype: 'string',
					},
				],
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );

		it( 'returns the QueryRepresentation of the RootState with a limit', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: 'foo', valueError: null },
					datatype: 'string',
					propertyData: { id: 'P123', label: 'abc', propertyError: null },
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 20,
				useLimit: true,
				errors: [],
			};

			const expectedValue: QueryRepresentation = {
				conditions: [
					{
						propertyId: 'P123',
						value: 'foo',
						propertyValueRelation: PropertyValueRelation.Matching,
						datatype: 'string',
					},
				],
				limit: 20,
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );
	} );
} );
