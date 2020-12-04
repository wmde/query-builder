import createActions from '@/store/actions';
import services from '@/ServicesFactory';

describe( 'actions', () => {

	it( 'updateValue', () => {
		const context = { commit: jest.fn() };
		const value = 'whatever';
		const conditionIndex = 0;
		const actions = createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
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
		const conditionIndex = 0;
		const actions = createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		);

		actions.updateProperty( context as any, { property, conditionIndex } );

		expect( context.commit ).toHaveBeenCalledWith( 'setProperty', { property, conditionIndex } );
	} );

	describe( 'searchProperties', () => {
		it( 'calls the repo and resolves with the result', async () => {
			const expectedResult = [ { label: 'postal code', id: 'P123', datatype: 'string' } ];
			const searchProperties = jest.fn().mockResolvedValue(
				JSON.parse( JSON.stringify( expectedResult ) ),
			);
			const actions = createActions(
				{ searchProperties },
				services.get( 'metricsCollector' ),
			);
			const searchString = 'postal';

			const actualResult = await actions.searchProperties( {} as any, searchString );

			expect( searchProperties ).toHaveBeenCalledWith( searchString, 12 );
			expect( actualResult ).toStrictEqual( expectedResult );
		} );

		it( 'adds message to properties with limited support', async () => {
			const searchInput = [ { label: 'postal code', id: 'P123', datatype: 'wikibase-sense' } ];
			const expectedResult = [
				{
					...searchInput[ 0 ],
					tag: 'query-builder-property-lookup-limited-support-tag',
				},
			];
			const searchProperties = jest.fn().mockResolvedValue(
				JSON.parse( JSON.stringify( searchInput ) ),
			);
			const actions = createActions(
				{ searchProperties },
				services.get( 'metricsCollector' ),
			);

			const actualResult = await actions.searchProperties( {} as any, 'searchString' );

			expect( actualResult ).toStrictEqual( expectedResult );
		} );
	} );

	describe( 'incrementMetric', () => {
		it( 'increments metric', async () => {
			const increment = jest.fn();
			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				{ increment },
			);

			await actions.incrementMetric( {} as any, 'foo' );

			expect( increment ).toHaveBeenCalledWith( 'foo' );
		} );
	} );
} );
