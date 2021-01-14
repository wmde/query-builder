import mutations from '@/store/mutations';
import RootState, { ConditionRow } from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = {
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
			} ],
			limit: 0,
			useLimit: false,
			omitLabels: true,
			errors: [],
		};

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
			const state: RootState = {
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
				} ],
				limit: 0,
				useLimit: false,
				omitLabels: true,
				errors: [],
			};

			mutations.setProperty( state, { property: expectedProperty, conditionIndex } );

			expect( state.conditionRows[ conditionIndex ].propertyData ).toStrictEqual( expectedProperty );
		} );
	} );

	it( 'unsetProperty', () => {
		const preExistingPropertyError = { message: 'some error', type: 'warning' } as const;
		const state: RootState = {
			conditionRows: [ {
				valueData: { value: 'foo', valueError: null },
				propertyData: {
					id: 'P123',
					label: 'abc',
					datatype: 'string',
					isPropertySet: true,
					propertyError: preExistingPropertyError,
				},
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
				conditionId: '0.123',
				subclasses: false,
			} ],
			limit: 0,
			useLimit: false,
			omitLabels: false,
			errors: [],
		};

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
		const state: RootState = {
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
			} ],
			limit: 0,
			useLimit: false,
			omitLabels: true,
			errors: [],
		};

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
		};
		const state: RootState = {
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
			} ],
			limit: 0,
			useLimit: false,
			omitLabels: true,
			errors: [],
		};

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
		};
		const state: RootState = {
			conditionRows: [ keptRow,
				{
					valueData: { value: 'potato', valueError: null },
					propertyData: {
						id: 'P666',
						label: 'Day of the beast',
						datatype: 'string',
						isPropertySet: true,
						propertyError: null,
					},
					propertyValueRelationData: { value: PropertyValueRelation.Regardless },
					conditionId: '3',
					subclasses: false,
				},
			],
			limit: 0,
			useLimit: false,
			omitLabels: true,
			errors: [],
		};

		mutations.removeCondition( state, 1 );

		expect( state.conditionRows.length ).toBe( 1 );
		expect( state.conditionRows[ 0 ] ).toStrictEqual( keptRow );

	} );

	it( 'setOmitLabels', () => {
		const state: RootState = {
			conditionRows: [
				{
					valueData: { value: 'potato', valueError: null },
					propertyData: {
						id: 'P666',
						label: 'Day of the beast',
						datatype: 'string',
						isPropertySet: true,
						propertyError: null,
					},
					propertyValueRelationData: { value: PropertyValueRelation.Regardless },
					conditionId: '3',
					subclasses: false,
				},
			],
			limit: 0,
			useLimit: false,
			omitLabels: true,
			errors: [],
		};

		const omitLabels = false;

		mutations.setOmitLabels( state, omitLabels );

		expect( state.omitLabels ).toBe( omitLabels );

	} );

	describe( 'clearFieldErrors', () => {
		it( 'clears the property error', () => {
			const state: RootState = {
				conditionRows: [ {
					valueData: { value: '', valueError: { message: 'message-key', type: 'error' } },
					propertyData: {
						id: '',
						label: '',
						datatype: null,
						isPropertySet: false,
						propertyError: { message: 'message-key', type: 'error' },
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
					subclasses: false,
				} ],
				limit: 0,
				useLimit: false,
				omitLabels: true,
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
					propertyData: {
						id: '',
						label: '',
						datatype: null,
						isPropertySet: false,
						propertyError: { message: 'message-key', type: 'error' },
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
					subclasses: false,
				} ],
				limit: 0,
				useLimit: false,
				omitLabels: true,
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
					propertyData: {
						id: '',
						label: '',
						datatype: null,
						isPropertySet: false,
						propertyError: { message: 'message-key', type: 'error' },
					},
					propertyValueRelationData: { value: PropertyValueRelation.Matching },
					conditionId: '0.123',
					subclasses: false,
				} ],
				limit: 0,
				useLimit: false,
				omitLabels: true,
				errors: [],
			};

			mutations.clearFieldErrors( state, { conditionIndex: 0, errorsToClear: 'both' } );
			expect( state.conditionRows[ 0 ].propertyData.propertyError ).toBe( null );
			expect( state.conditionRows[ 0 ].valueData.valueError ).toBe( null );
		} );
	} );
} );
