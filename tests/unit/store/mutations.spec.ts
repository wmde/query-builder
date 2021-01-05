import mutations from '@/store/mutations';
import RootState from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
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

		mutations.setValue( state, { value: expectedValue, conditionIndex: 0 } );

		expect( state.conditionRows[ 0 ].valueData.value ).toBe( expectedValue );
	} );

	describe( 'setProperty', () => {

		it( 'sets a new property in the state', () => {
			const conditionIndex = 0;
			const expectedProperty = { id: 'P456', label: 'def', datatype: 'string', propertyError: null };
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

			mutations.setProperty( state, { property: expectedProperty, conditionIndex } );

			expect( state.conditionRows[ conditionIndex ].propertyData ).toStrictEqual( expectedProperty );
		} );

		it( 'clears a property from the state', () => {
			const preExistingPropertyError = { message: 'some error', type: 'warning' } as const;
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: 'foo', valueError: null },
					datatype: 'string',
					propertyData: {
						id: 'P123',
						label: 'abc',
						propertyError: preExistingPropertyError,
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 0,
				useLimit: false,
				errors: [],
			};

			mutations.setProperty( state, { property: null, conditionIndex: 0 } );

			expect( state.conditionRows[ 0 ].propertyData ).toStrictEqual(
				{
					id: '',
					label: '',
					propertyError: preExistingPropertyError,
				},
			);
		} );
	} );

	it( 'addCondition', () => {
		const expectedNewConditionRow = {
			valueData: { value: '', valueError: null },
			datatype: null,
			propertyData: { id: '', label: '', propertyError: null },
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			conditionId: 'TO BE FILLED WITH THE GENERATED RANDOM VALUE',
		};
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

		mutations.addCondition( state );

		expect( state.conditionRows.length ).toBe( 2 );

		// expect the random value
		expectedNewConditionRow.conditionId = state.conditionRows[ 1 ].conditionId;
		expect( state.conditionRows[ 1 ] ).toStrictEqual( expectedNewConditionRow );
	} );

	it( 'removeCondition', () => {
		const keptRow = {
			valueData: { value: 'foo', valueError: null },
			datatype: 'string',
			propertyData: { id: 'P123', label: 'abc', propertyError: null },
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			conditionId: '0.123',
		};
		const state: RootState = {
			conditionRows: [ keptRow,
				{
					valueData: { value: 'potato', valueError: null },
					datatype: 'string',
					propertyData: { id: 'P666', label: 'Day of the beast', propertyError: null },
					propertyValueRelationData: { value: PropertyValueRelation.Regardless },
					conditionId: '3',
				},
			],
			limit: 0,
			useLimit: false,
			errors: [],
		};

		mutations.removeCondition( state, 1 );

		expect( state.conditionRows.length ).toBe( 1 );
		expect( state.conditionRows[ 0 ] ).toStrictEqual( keptRow );

	} );

	describe( 'clearFieldErrors', () => {
		it( 'clears the property error', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: '', valueError: { message: 'message-key', type: 'error' } },
					datatype: null,
					propertyData: {
						id: '',
						label: '',
						propertyError: { message: 'message-key', type: 'error' },
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 0,
				useLimit: false,
				errors: [],
			};

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'property' } );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).toBe( null );
			expect( state.conditionRows[ 0 ].valueData.valueError ).not.toBe( null );
		} );

		it( 'clears the value error', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: '', valueError: { message: 'message-key', type: 'error' } },
					datatype: null,
					propertyData: {
						id: '',
						label: '',
						propertyError: { message: 'message-key', type: 'error' },
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 0,
				useLimit: false,
				errors: [],
			};

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'value' } );
			expect( state.conditionRows[ 0 ].valueData.valueError ).toBe( null );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).not.toBe( null );
		} );

		it( 'clears the both errors', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: '', valueError: { message: 'message-key', type: 'error' } },
					datatype: null,
					propertyData: {
						id: '',
						label: '',
						propertyError: { message: 'message-key', type: 'error' },
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				limit: 0,
				useLimit: false,
				errors: [],
			};

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'both' } );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).toBe( null );
			expect( state.conditionRows[ 0 ].valueData.valueError ).toBe( null );
		} );
	} );
} );
