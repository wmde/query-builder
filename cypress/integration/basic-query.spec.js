function wikibaseApiRequest( query ) {
	return {
		url: 'https://www.wikidata.org/w/api.php',
		query,
	};
}

describe( 'Basic Query', () => {
	it( 'can create a query with a single condition', () => {
		cy.visit( '/' );

		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'has pet' } ),
			{ fixture: 'wbsearchentities-has-pet.json' },
		).as( 'hasPetRequest' );
		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'house cat' } ),
			{ fixture: 'wbsearchentities-house-cat.json' },
		).as( 'houseCatRequest' );
		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities' } ),
			{ fixture: 'wbsearchentities-empty.json' },
		);

		cy.get( 'h1' ).should( 'contain', 'Query Builder' );

		cy.get( '.query-condition__property-lookup .wikit-Input' )
			.type( 'has pet' )
			.wait( '@hasPetRequest' );

		cy.get( '.query-condition__property-lookup .wikit-OptionsMenu__item' ).click();

		cy.get( '.query-condition__value-input .wikit-Input' )
			.type( 'house cat' )
			.wait( '@houseCatRequest' );

		cy.get( '.query-condition__value-input .wikit-OptionsMenu__item' )
			.first()
			.click();

		cy.get( '.querybuilder__run .wikit-Button' ).click();

		cy.get( '.querybuilder__result__iframe' ).then( element => {
			const url = element.attr( 'src' );
			const query = url.split( '#' )[ 1 ];

			const expected = `SELECT DISTINCT ?item ?itemLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
  {
    SELECT DISTINCT ?item WHERE { ?item (p:P1429/ps:P1429/(wdt:P279*)) wd:Q146. }
    LIMIT 100
  }
}`;

			expect( query ).to.equal( encodeURI( expected ) );
		} )
	} );
} )
