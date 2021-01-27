import RootState from '@/store/RootState';
import getters from '@/store/getters';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { getFreshRootState } from '../../util/store';

describe( 'getters', () => {
	function getFreshRootState(): RootState {
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
				conditionRelation: null,
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
		return simpleRootState;
	}

	describe( 'limitedSupport', () => {
		it( 'returns false if the datatype is supported', () => {
			const state: RootState = getFreshRootState();

			expect( getters.limitedSupport( state )( 0 ) ).toBe( false );
		} );

		it( 'returns false the property is empty', () => {
			const state: RootState = getFreshRootState();

			expect( getters.limitedSupport( state )( 0 ) ).toBe( false );
		} );

		it( 'returns true the datatype is unsupported', () => {
			const state: RootState = getFreshRootState();
			state.conditionRows[ 0 ].propertyData.datatype = 'I am not supported';

			expect( getters.limitedSupport( state )( 0 ) ).toBe( true );
		} );
	} );

	describe( 'conditionRelation', () => {
		it( 'returns conditionRelation null if conditionRows.length === 1', () => {
			const state: RootState = getFreshRootState(); // has one element by default

			expect( getters.conditionRelation( state )( 0 ) ).toBe( null );
		} );
	} );

	describe( 'query', () => {
		it( 'returns the QueryRepresentation of the RootState', () => {
			const state: RootState = getFreshRootState();

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
			const state: RootState = getFreshRootState();
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
			const state: RootState = getFreshRootState();
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
			const state: RootState = getFreshRootState();
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
