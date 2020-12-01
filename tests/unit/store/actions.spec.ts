import createActions from '@/store/actions';

describe( 'actions', () => {

	it( 'updateValue', () => {
		const context = { commit: jest.fn() };
		const value = 'whatever';
		const conditionIndex = 0;
		const actions = createActions(
			{ searchProperties: jest.fn() },
		);

		actions.updateValue( context as any, { value, conditionIndex } );

		expect( context.commit ).toHaveBeenCalledWith( 'setValue', { value, conditionIndex } );
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

	describe( 'searchProperties', () => {
		it( 'calls the repo and resolves with the result', async () => {
			const expectedResult = [ { label: 'postal code', id: 'P123' } ];
			const searchProperties = jest.fn().mockResolvedValue( expectedResult );
			const actions = createActions(
				{ searchProperties },
			);
			const searchString = 'postal';

			const actualResult = await actions.searchProperties( {} as any, searchString );

			expect( searchProperties ).toHaveBeenCalledWith( searchString, 12 );
			expect( actualResult ).toBe( expectedResult );
		} );
	} );

} );
