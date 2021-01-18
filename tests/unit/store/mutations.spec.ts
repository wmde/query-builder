import mutations from '@/store/mutations';
import RootState, { ConditionRow } from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

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
		conditionId: '0.123',
		subclasses: false,
		negate: false,
	} ],
	limit: 0,
	useLimit: false,
	omitLabels: true,
	errors: [],
};

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );

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
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );

			mutations.setProperty( state, { property: expectedProperty, conditionIndex } );

			expect( state.conditionRows[ conditionIndex ].propertyData ).toStrictEqual( expectedProperty );
		} );
	} );

	it( 'unsetProperty', () => {
		const preExistingPropertyError = { message: 'some error', type: 'warning' } as const;
		const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
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
		const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );

		mutations.setSubclasses( state, { subclasses: expectedValue, conditionIndex: 0 } );

		expect( state.conditionRows[ 0 ].subclasses ).toBe( expectedValue );
	} );

	it( 'addCondition', () => {
		const expectedNewConditionRow = {
			valueData: { value: null, valueError: null },
			propertyData: { id: '', label: '', datatype: null, isPropertySet: false, propertyError: null },
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			conditionId: 'TO BE FILLED WITH THE GENERATED RANDOM VALUE',
			subclasses: false,
			negate: false,
		};
		const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );

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
			conditionId: '0.123',
			subclasses: false,
			negate: false,
		};
		const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
		state.conditionRows.push( keptRow );

		mutations.removeCondition( state, 1 );

		expect( state.conditionRows.length ).toBe( 1 );
		expect( state.conditionRows[ 0 ] ).toStrictEqual( keptRow );

	} );

	it( 'setOmitLabels', () => {
		const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
		const omitLabels = false;

		mutations.setOmitLabels( state, omitLabels );

		expect( state.omitLabels ).toBe( omitLabels );

	} );

	it( 'setNegate', () => {
		const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
		const negate = true;

		mutations.setNegate( state, { conditionIndex: 0, value: negate } );

		expect( state.conditionRows[ 0 ].negate ).toBe( negate );

	} );

	describe( 'clearFieldErrors', () => {
		it( 'clears the property error', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
			state.conditionRows[ 0 ].propertyData.propertyError = { message: 'message-key', type: 'error' };
			state.conditionRows[ 0 ].valueData.valueError = { message: 'message-key', type: 'error' };

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'property' } );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).toBe( null );
			expect( state.conditionRows[ 0 ].valueData.valueError ).not.toBe( null );
		} );

		it( 'clears the value error', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
			state.conditionRows[ 0 ].propertyData.propertyError = { message: 'message-key', type: 'error' };
			state.conditionRows[ 0 ].valueData.valueError = { message: 'message-key', type: 'error' };

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'value' } );
			expect( state.conditionRows[ 0 ].valueData.valueError ).toBe( null );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).not.toBe( null );
		} );

		it( 'clears the both errors', () => {
			const state: RootState = JSON.parse( JSON.stringify( simpleRootState ) );
			state.conditionRows[ 0 ].propertyData.propertyError = { message: 'message-key', type: 'error' };
			state.conditionRows[ 0 ].valueData.valueError = { message: 'message-key', type: 'error' };

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'both' } );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).toBe( null );
			expect( state.conditionRows[ 0 ].valueData.valueError ).toBe( null );
		} );
	} );
} );
