import actions from '@/store/actions';

describe( 'actions', () => {

	it( 'updateValue', () => {
		const context = { commit: jest.fn() };
		const value = 'whatever';

		actions.updateValue( context as any, value );

		expect( context.commit ).toHaveBeenCalledWith( 'setValue', value );
	} );

	it( 'updateProperty', () => {
		const context = { commit: jest.fn() };
		const property = {
			id: 'P666',
			label: 'Property label'
		};

		actions.updateProperty( context as any, property );

		expect( context.commit ).toHaveBeenCalledWith( 'setProperty', property );
	} );

} );
