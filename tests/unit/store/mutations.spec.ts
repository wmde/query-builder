import mutations from '@/store/mutations';
import RootState from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = {
			conditionRow: {
				valueData: { value: 'foo' },
				propertyData: { id: 'P123', label: 'abc' },
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
			},
			errors: [],
		};

		mutations.setValue( state, expectedValue );

		expect( state.conditionRow.valueData.value ).toBe( expectedValue );
	} );

	it( 'setProperty', () => {
		const expectedProperty = { id: 'P456', label: 'def' };
		const state: RootState = {
			conditionRow: {
				valueData: { value: 'foo' },
				propertyData: { id: 'P123', label: 'abc' },
				propertyValueRelationData: { value: PropertyValueRelation.Matching },
			},
			errors: [],
		};

		mutations.setProperty( state, expectedProperty );

		expect( state.conditionRow.propertyData ).toBe( expectedProperty );
	} );

} );
