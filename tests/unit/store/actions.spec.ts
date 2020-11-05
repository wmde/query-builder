import createActions from '@/store/actions';

describe( 'actions', () => {

	it( 'updateValue', () => {
		const context = { commit: jest.fn() };
		const value = 'whatever';
		const actions = createActions(
			{ searchProperties: jest.fn() },
		);

		actions.updateValue( context as any, value );

		expect( context.commit ).toHaveBeenCalledWith( 'setValue', value );
	} );

	it( 'updateProperty', () => {
		const context = { commit: jest.fn() };
		const property = {
			id: 'P666',
			label: 'Property label',
		};
		const actions = createActions(
			{ searchProperties: jest.fn() },
		);

		actions.updateProperty( context as any, property );

		expect( context.commit ).toHaveBeenCalledWith( 'setProperty', property );
	} );

} );
