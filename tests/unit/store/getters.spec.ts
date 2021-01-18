import RootState from '@/store/RootState';
import getters from '@/store/getters';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

const simpleRootState: RootState = {
	conditionRows: [ {
		valueData: { value: 'foo', valueError: null },
		propertyData: {
			id: 'P123',
			label: 'abc',
			datatype: 'string',
			isPropertySet: true,
			propertyError: null,
		},
		propertyValueRelationData: { value: PropertyValueRelation.Matching },
		conditionId: '0.123',
		subclasses: false,
		negate: false,
	} ],
	limit: 0,
	useLimit: false,
	omitLabels: true,
	errors: [],
};

describe( 'getters', () => {

	describe( 'limitedSupport', () => {
		it( 'returns false if the datatype is supported', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );

			expect( getters.limitedSupport( state )( 0 ) ).toBe( false );
		} );

		it( 'returns false the property is empty', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );

			expect( getters.limitedSupport( state )( 0 ) ).toBe( false );
		} );

		it( 'returns true the datatype is unsupported', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
			state.conditionRows[ 0 ].propertyData.datatype = 'I am not supported';

			expect( getters.limitedSupport( state )( 0 ) ).toBe( true );
		} );
	} );

	describe( 'query', () => {
		it( 'returns the QueryRepresentation of the RootState', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );

			const expectedValue: QueryRepresentation = {
				conditions: [
					{
						propertyId: 'P123',
						value: 'foo',
						propertyValueRelation: PropertyValueRelation.Matching,
						datatype: 'string',
						subclasses: false,
						negate: false,
					},
				],
				omitLabels: true,
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );

		it( 'returns the QueryRepresentation of the RootState with a limit', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
			state.limit = 20;
			state.useLimit = true;

			const expectedValue: QueryRepresentation = {
				conditions: [
					{
						propertyId: 'P123',
						value: 'foo',
						propertyValueRelation: PropertyValueRelation.Matching,
						datatype: 'string',
						subclasses: false,
						negate: false,
					},
				],
				omitLabels: true,
				limit: 20,
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );

		it( 'returns the QueryRepresentation of the RootState with subclasses', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
			state.conditionRows[ 0 ].subclasses = true;

			const expectedValue: QueryRepresentation = {
				conditions: [
					{
						propertyId: 'P123',
						value: 'foo',
						propertyValueRelation: PropertyValueRelation.Matching,
						datatype: 'string',
						subclasses: true,
						negate: false,
					},
				],
				omitLabels: true,
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );

		it( 'returns the QueryRepresentation of the RootState with negate = true', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
			state.conditionRows[ 0 ].negate = true;

			const expectedValue: QueryRepresentation = {
				conditions: [
					{
						propertyId: 'P123',
						value: 'foo',
						propertyValueRelation: PropertyValueRelation.Matching,
						datatype: 'string',
						subclasses: false,
						negate: true,
					},
				],
				omitLabels: true,
			};

			expect( getters.query( state ) ).toStrictEqual( expectedValue );
		} );

	} );
} );
