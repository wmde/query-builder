import buildQuery from '@/sparql/buildQuery';

describe( 'buildQuery', () => {

	it( 'builds a query from a property and a string value', () => {
		const property = { label: 'potato', id: 'P666' };
		const value = 'blah';
		expect( buildQuery( {
			property,
			value
		} ) ).toEqual( `SELECT ?item WHERE { ?item wdt:${property.id} "${value}". }` );
	} );

} );
