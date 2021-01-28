const { createYield } = require( 'typescript' );

function wikibaseApiRequest( query ) {
	return {
		url: 'https://www.wikidata.org/w/api.php',
		query,
	};
}

describe( 'Basic Query', () => {
	it( 'can create a query with a single condition', () => {
		cy.visit( '/' );

		cy.get( 'h1' ).should( 'contain', 'Query Builder' );

		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'has pet' } )
		).as( 'hasPetRequest' );

		// Gets the first input match
		cy.get( '.query-condition__property-lookup .wikit-Input' )
			.type( 'has pet' ).wait( '@hasPetRequest' );

		cy.get( '.query-condition__property-lookup .wikit-OptionsMenu__item' ).click();

		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'house cat' } )
		).as( 'houseCatRequest' );

		cy.get( '.query-condition__value-input .wikit-Input' )
			.type( 'house cat' );

		cy.wait( '@houseCatRequest' );

		cy.get( '.query-condition__value-input .wikit-OptionsMenu__item' )
			.first()
			.click();

		cy.get( '.querybuilder__run .wikit-Button' ).click();

		const iframe = cy.get( '.querybuilder__result__iframe' );
		iframe.then( element => {
			const url = element.attr( 'src' );
			const query = url.split( '#' )[ 1 ];

			const expected = `SELECT DISTINCT ?item ?itemLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
  {
    SELECT DISTINCT ?item WHERE { ?item (p:P1429/ps:P1429/(wdt:undefined*)) wd:Q146. }
    LIMIT 100
  }
}`;

			expect( query ).to.equal( encodeURI( expected ) );
		} )
	} );
} )
