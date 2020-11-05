import QueryBuilderServices, { Services } from '@/QueryBuilderServices';

describe( 'QueryBuilderServices', () => {
	describe.each( [
		[ 'searchEntityRepository' ],
	] as const )( '%s', ( name: keyof Services ) => {
		it( 'throws an error if it is not set', () => {
			expect( () => ( new QueryBuilderServices() ).get( name ) ).toThrow();
		} );

		it( 'can set and get it', () => {
			const services = new QueryBuilderServices();
			const mockService: any = {};
			services.set( name, mockService );
			expect( services.get( name ) ).toBe( mockService );
		} );
	} );
} );
