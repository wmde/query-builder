import mutations from '@/store/mutations';
import { RootState } from '@/store/RootState';

describe( 'mutations', () => {

	it( 'setValue', () => {
		const expectedValue = 'whatever';
		const state: RootState = { value: 'foo', property: { id: 'P123', label: 'abc' } };

		mutations.setValue( state, expectedValue );

		expect( state.value ).toBe( expectedValue );
	} );

} );
