import mutations from '@/store/mutations';
import RootState, { ConditionRow } from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ConditionRelation from '@/data-model/ConditionRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';

describe( 'mutations', () => {
	function getFreshRootState(): RootState {
		const simpleRootState = {
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
				referenceRelation: ReferenceRelation.Regardless,
				conditionRelation: null,
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
	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = getFreshRootState();

		mutations.setValue( state, { value: expectedValue, conditionIndex: 0 } );

		expect( state.conditionRows[ 0 ].valueData.value ).toBe( expectedValue );
	} );

	describe( 'setProperty', () => {

		it( 'sets a new property in the state', () => {
			const conditionIndex = 0;
			const expectedProperty = {
				id: 'P456',
				label: 'def',
				datatype: 'string',
				isPropertySet: true,
				propertyError: null,
			};
			const state: RootState = getFreshRootState();

			mutations.setProperty( state, { property: expectedProperty, conditionIndex } );

			expect( state.conditionRows[ conditionIndex ].propertyData ).toStrictEqual( expectedProperty );
		} );
	} );

	it( 'unsetProperty', () => {
		const preExistingPropertyError = { message: 'some error', type: 'warning' } as const;
		const state: RootState = getFreshRootState();
		state.conditionRows[ 0 ].propertyData.propertyError = preExistingPropertyError;

		mutations.unsetProperty( state, 0 );

		expect( state.conditionRows[ 0 ].propertyData ).toStrictEqual(
			{
				id: 'P123',
				label: 'abc',
				datatype: 'string',
				isPropertySet: false,
				propertyError: preExistingPropertyError,
			},
		);
	} );

	it( 'setSubclasses', () => {
		const expectedValue = true;
		const state: RootState = getFreshRootState();

		mutations.setSubclasses( state, { subclasses: expectedValue, conditionIndex: 0 } );

		expect( state.conditionRows[ 0 ].subclasses ).toBe( expectedValue );
	} );

	it( 'addCondition', () => {
		const expectedNewConditionRow = {
			valueData: { value: null, valueError: null },
			propertyData: { id: '', label: '', datatype: null, isPropertySet: false, propertyError: null },
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			referenceRelation: ReferenceRelation.Regardless,
			conditionId: 'TO BE FILLED WITH THE GENERATED RANDOM VALUE',
			conditionRelation: ConditionRelation.And,
			subclasses: false,
			negate: false,
		};
		const state: RootState = getFreshRootState();

		mutations.addCondition( state );

		expect( state.conditionRows.length ).toBe( 2 );

		// expect the random value
		expectedNewConditionRow.conditionId = state.conditionRows[ 1 ].conditionId;
		expect( state.conditionRows[ 1 ] ).toStrictEqual( expectedNewConditionRow );
	} );

	it( 'removeCondition', () => {
		const keptRow: ConditionRow = {
			valueData: { value: 'foo', valueError: null },
			propertyData: {
				id: 'P123',
				label: 'abc',
				datatype: 'string',
				isPropertySet: true,
				propertyError: null,
			},
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			referenceRelation: ReferenceRelation.Regardless,
			conditionId: '0.123',
			conditionRelation: null,
			subclasses: false,
			negate: false,
		};
		const state: RootState = getFreshRootState();
		state.conditionRows.push( keptRow );

		mutations.removeCondition( state, 1 );

		expect( state.conditionRows.length ).toBe( 1 );
		expect( state.conditionRows[ 0 ] ).toStrictEqual( keptRow );

	} );

	it( 'setOmitLabels', () => {
		const state: RootState = getFreshRootState();
		const omitLabels = false;

		mutations.setOmitLabels( state, omitLabels );

		expect( state.omitLabels ).toBe( omitLabels );

	} );

	it( 'setNegate', () => {
		const state: RootState = getFreshRootState();
		const negate = true;

		mutations.setNegate( state, { conditionIndex: 0, value: negate } );

		expect( state.conditionRows[ 0 ].negate ).toBe( negate );

	} );

	it( 'setConditionRelation', () => {
		const state: RootState = getFreshRootState();
		const conditionRelation = ConditionRelation.Or;

		mutations.setConditionRelation( state, { conditionIndex: 0, value: conditionRelation } );

		expect( state.conditionRows[ 0 ].conditionRelation ).toBe( conditionRelation );

	} );

	describe( 'clearFieldErrors', () => {
		it( 'clears the property error', () => {
			const state: RootState = getFreshRootState();
			state.conditionRows[ 0 ].propertyData.propertyError = { message: 'message-key', type: 'error' };
			state.conditionRows[ 0 ].valueData.valueError = { message: 'message-key', type: 'error' };

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'property' } );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).toBe( null );
			expect( state.conditionRows[ 0 ].valueData.valueError ).not.toBe( null );
		} );

		it( 'clears the value error', () => {
			const state: RootState = getFreshRootState();
			state.conditionRows[ 0 ].propertyData.propertyError = { message: 'message-key', type: 'error' };
			state.conditionRows[ 0 ].valueData.valueError = { message: 'message-key', type: 'error' };

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'value' } );
			expect( state.conditionRows[ 0 ].valueData.valueError ).toBe( null );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).not.toBe( null );
		} );

		it( 'clears the both errors', () => {
			const state: RootState = getFreshRootState();
			state.conditionRows[ 0 ].propertyData.propertyError = { message: 'message-key', type: 'error' };
			state.conditionRows[ 0 ].valueData.valueError = { message: 'message-key', type: 'error' };

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'both' } );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).toBe( null );
			expect( state.conditionRows[ 0 ].valueData.valueError ).toBe( null );
		} );
	} );

	it( 'referenceRelation', () => {
		const expectedValue = ReferenceRelation.Without;
		const state: RootState = getFreshRootState();

		mutations.setReferenceRelation( state, { referenceRelation: expectedValue, conditionIndex: 0 } );

		expect( state.conditionRows[ 0 ].referenceRelation ).toBe( expectedValue );
	} );

	it( 'setState', () => {
		const initialState = getFreshRootState();
		const newState = getFreshRootState();
		newState.conditionRows = [];
		newState.omitLabels = true;
		newState.errors = [
			{
				message: 'just-proving-a-point-error',
				type: 'error',
			},
		];

		mutations.setState( initialState, newState );

		expect( initialState ).toStrictEqual( newState );
	} );
} );
