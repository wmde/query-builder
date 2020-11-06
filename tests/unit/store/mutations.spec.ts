import mutations from '@/store/mutations';
import RootState from '@/store/RootState';

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = {
			conditionRow: {
				valueData: { value: 'foo' },
				propertyData: { id: 'P123', label: 'abc' },
			},
		};

		mutations.setValue( state, expectedValue );

		expect( state.conditionRow.valueData.value ).toBe( expectedValue );
	} );

	it( 'setProperty', () => {
		const expectedProperty = { id: 'P123', label: 'abc' };
		const state: RootState = {
			conditionRow: {
				valueData: { value: 'foo' },
				propertyData: { id: 'P123', label: 'abc' },
			},
		};

		mutations.setProperty( state, expectedProperty );

		expect( state.conditionRow.propertyData ).toBe( expectedProperty );
	} );

} );
