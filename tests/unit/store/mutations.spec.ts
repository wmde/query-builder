import mutations from '@/store/mutations';
import RootState from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = {
			conditionRows: [ {
				valueData: { value: 'foo' },
				propertyData: { id: 'P123', label: 'abc' },
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
			} ],
			errors: [],
		};

		mutations.setValue( state, { value: expectedValue, conditionIndex: 0 } );

		expect( state.conditionRows[ 0 ].valueData.value ).toBe( expectedValue );
	} );

	it( 'setProperty', () => {
		const conditionIndex = 0;
		const expectedProperty = { id: 'P456', label: 'def' };
		const state: RootState = {
			conditionRows: [ {
				valueData: { value: 'foo' },
				propertyData: { id: 'P123', label: 'abc' },
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
			} ],
			errors: [],
		};

		mutations.setProperty( state, { property: expectedProperty, conditionIndex } );

		expect( state.conditionRows[ conditionIndex ].propertyData ).toBe( expectedProperty );
	} );

	it( 'addCondition', () => {
		const expectedNewConditionRow = {
			valueData: { value: '' },
			propertyData: { id: '', label: '' },
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
		};
		const state: RootState = {
			conditionRows: [ {
				valueData: { value: 'foo' },
				propertyData: { id: 'P123', label: 'abc' },
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
			} ],
			errors: [],
		};

		mutations.addCondition( state );

		expect( state.conditionRows.length ).toBe( 2 );
		expect( state.conditionRows[ 1 ] ).toStrictEqual( expectedNewConditionRow );
	} );

} );
