import mutations from '@/store/mutations';
import RootState from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = {
			conditionRows: [ {
				valueData: { value: 'foo', valueError: null },
				propertyData: { id: 'P123', label: 'abc', datatype: 'string', propertyError: null },
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
				conditionId: '0.123',
			} ],
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
					propertyData: { id: 'P123', label: 'abc', datatype: 'string', propertyError: null },
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
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
					propertyData: {
						id: 'P123',
						label: 'abc',
						datatype: 'string',
						propertyError: preExistingPropertyError,
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
				} ],
				errors: [],
			};

			mutations.setProperty( state, { property: null, conditionIndex: 0 } );

			expect( state.conditionRows[ 0 ].propertyData ).toStrictEqual(
				{
					id: '',
					label: '',
					datatype: null,
					propertyError: preExistingPropertyError,
				},
			);
		} );
	} );

	it( 'addCondition', () => {
		const expectedNewConditionRow = {
			valueData: { value: '', valueError: null },
			propertyData: { id: '', label: '', datatype: null, propertyError: null },
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			conditionId: 'TO BE FILLED WITH THE GENERATED RANDOM VALUE',
		};
		const state: RootState = {
			conditionRows: [ {
				valueData: { value: 'foo', valueError: null },
				propertyData: { id: 'P123', label: 'abc', datatype: 'string', propertyError: null },
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
				conditionId: '0.123',
			} ],
			errors: [],
		};

		mutations.addCondition( state );

		expect( state.conditionRows.length ).toBe( 2 );

		// expect the random value
		expectedNewConditionRow.conditionId = state.conditionRows[ 1 ].conditionId;
		expect( state.conditionRows[ 1 ] ).toStrictEqual( expectedNewConditionRow );
	} );

} );
