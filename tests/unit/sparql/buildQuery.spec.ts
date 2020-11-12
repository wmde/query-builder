import buildQuery from '@/sparql/buildQuery';

describe( 'buildQuery', () => {

	it( 'builds a query from a property and a string value', () => {
		const propertyId = 'P666';
		const value = 'blah';
		expect( buildQuery( { condition: {
			propertyId,
			value,
		} } ) ).toEqual( `SELECT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) "${value}". }` );
	} );

} );
