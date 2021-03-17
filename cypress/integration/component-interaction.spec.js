// for some reason Cypress keeps quotes around env vars coming from docker through `.env`
const API_URL = Cypress.env( 'API_URL' ).replace( /(^')|('$)/g, '' );

function wikibaseApiRequest( query ) {
	return {
		url: API_URL,
		query,
	};
}

describe( 'Component interaction test', () => {
	it( 'Tests whether components behave as they should when values change', () => {
		cy.visit( '/' );

		/**
		 * The intercepts basically mock an API request, as we type into the lookup component
		 * with different search strings. see the .json files in the /fixtures directory
		 */
		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'has pet' } ),
			{ fixture: 'wbsearchentities-has-pet.json' },
		).as( 'hasPetRequest' );
		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'house cat' } ),
			{ fixture: 'wbsearchentities-house-cat.json' },
		).as( 'houseCatRequest' );

		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'instance of' } ),
			{ fixture: 'wbsearchentities-instance-of.json' },
		).as( 'hasInstanceRequest' );

		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'IMDb ID' } ),
			{ fixture: 'wbsearchentities-external-id.json' },
		).as( 'hasImdbRequest' );

		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities', search: 'installed capacity' } ),
			{ fixture: 'wbsearchentities-limited-support.json' },
		).as( 'hasLimitedSupportedRequest' );

		cy.intercept(
			wikibaseApiRequest( { action: 'wbsearchentities' } ),
			{ fixture: 'wbsearchentities-empty.json' },
		);

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

		// clear out values from specified input components
		cy.get( '.query-condition__property-lookup .wikit-Input' ).clear();
		cy.get( '.query-condition__value-input .wikit-Input' ).clear();

		// set value to 'not matching' from dropdown. NotMatching => 'without',
		cy.get( '.querybuilder__dropdown-select.wikit.wikit-Dropdown' ).first().click();
		cy.get( '.wikit-OptionsMenu__item.wikit-OptionsMenu__item' ).contains( 'without' ).click();

		cy.get( '.query-condition__property-lookup .wikit-Input' )
			.type( 'instance of' )
			.wait( '@hasInstanceRequest' );

		cy.get( '.query-condition__property-lookup .wikit-OptionsMenu__item' ).first().click();

		cy.get( '.query-condition__value-input .wikit-Input' )
			.type( 'house cat' )
			.wait( '@houseCatRequest' );

		cy.get( '.query-condition__value-input .wikit-OptionsMenu__item' )
			.first()
			.click();

		// negate relation
		cy.get( '.wikit.wikit-ToggleButton' ).not( '.wikit-ToggleButton--isActive' ).click();

		// click 'Add condition' button and expand to a second block
		cy.get( '.querybuilder__add-condition button' ).click();

		cy.get( '.query-condition__property-lookup .wikit-Input' )
			.eq( 1 )
			.type( 'IMDb ID' )
			.wait( '@hasImdbRequest' );
		cy.get( '.query-condition__property-lookup:nth(1) .wikit-OptionsMenu__item' ).click();

		// set value to 'regardless of value on the second query_condition block'.
		cy.get( '.querybuilder__dropdown-select.wikit.wikit-Dropdown' )
			.eq( 1 )
			.first()
			.click();
		cy.get( '.querybuilder__dropdown-select.wikit.wikit-Dropdown:nth(1) .wikit-OptionsMenu__item' )
			.contains( 'regardless of value' )
			.click();

		// connect the two relations with OR
		cy.get( '.wikit.wikit-ToggleButtonGroup.conditionRelationToggle.querybuilder__condition-relation-toggle' )
			.find( 'button' )
			.contains( 'or' )
			.click();

		cy.get( '.query-condition__property-lookup .wikit-Input' ).eq( 1 ).clear();

		cy.get( '.query-condition__property-lookup .wikit-Input' )
			.eq( 1 )
			.type( 'installed capacity' )
			.wait( '@hasLimitedSupportedRequest' );
		cy.get( '.query-condition__property-lookup:nth(1) .wikit-OptionsMenu__item' ).click();

		// Assert input value component is disabled when user selects 'regardless of value'
		cy.get( '.query-condition__value-input:nth(1) .wikit-Input' ).should( 'be.disabled' );

		// run query
		cy.get( '.querybuilder__run .wikit-Button--progressive' ).click();

		// assert the reslulting sparql query
		cy.get( '.querybuilder__result__iframe' ).then( ( element ) => {
			const url = element.attr( 'src' );
			const query = url.split( '#' )[ 1 ];

			const expected = `SELECT DISTINCT ?item ?itemLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
  {
    SELECT DISTINCT ?item WHERE {
      {
        MINUS {
          ?item p:P31 ?statement0.
          ?statement0 (ps:P31/(wdt:P279*)) ?instance.
        }
      }
      UNION
      { MINUS { ?item (p:P31/ps:P31) wd:Q146. } }
      UNION
      {
        ?item p:P2109 ?statement1.
        ?statement1 (ps:P2109) _:anyValueP2109.
      }
    }
    LIMIT 100
  }
}`;
			expect( decodeURI( query ) ).to.equal( expected );
		} );
	} );
} );
