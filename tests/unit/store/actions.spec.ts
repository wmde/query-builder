import actions from '@/store/actions';

describe( 'actions', () => {

	it( 'updateValue', () => {
		const context = { commit: jest.fn() };
		const value = 'whatever';

		actions.updateValue( context as any, value );

		expect( context.commit ).toHaveBeenCalledWith( 'setValue', value );
	} );

} );
