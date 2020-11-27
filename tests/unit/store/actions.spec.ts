import createActions from '@/store/actions';
import services from '@/ServicesFactory';

describe( 'actions', () => {

	it( 'updateValue', () => {
		const context = { commit: jest.fn() };
		const value = 'whatever';
		const actions = createActions( services );

		actions.updateValue( context as any, value );

		expect( context.commit ).toHaveBeenCalledWith( 'setValue', value );
	} );

	it( 'updateProperty', () => {
		const context = { commit: jest.fn() };
		const property = {
			id: 'P666',
			label: 'Property label',
		};
		const actions = createActions( services );

		actions.updateProperty( context as any, property );

		expect( context.commit ).toHaveBeenCalledWith( 'setProperty', property );
	} );

	describe( 'searchProperties', () => {
		it( 'calls the repo and resolves with the result', async () => {
			const expectedResult = [ { label: 'postal code', id: 'P123' } ];
			const searchProperties = jest.fn().mockResolvedValue( expectedResult );
			services.set( 'searchEntityRepository', { searchProperties } );
			const actions = createActions( services );
			const searchString = 'postal';

			const actualResult = await actions.searchProperties( {} as any, searchString );

			expect( searchProperties ).toHaveBeenCalledWith( searchString, 12 );
			expect( actualResult ).toBe( expectedResult );
		} );
	} );

	describe( 'incrementMetric', () => {
		it( 'increments metric', async () => {
			const increment = jest.fn();
			services.set( 'metricsCollector', { increment } );
			const actions = createActions( services );

			await actions.incrementMetric( {} as any, 'foo' );

			expect( increment ).toHaveBeenCalledWith( 'foo' );
		} );
	} );
} );
