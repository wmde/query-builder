const { createYield } = require("typescript");

describe('Basic Query', () => {
    it('can create a query with a single condition', () => {
        cy.visit( '/' );

        cy.get( 'h1' ).should( 'contain', 'Query Builder' );

        // Gets the first input match
       cy.get( '.query-condition__property-lookup .wikit-Input' )
            .type( 'has pet' );

        cy.wait( 4000 );

        cy.get( '.query-condition__property-lookup .wikit-OptionsMenu__item' ).click();

        cy.get( '.query-condition__value-input .wikit-Input' )
          .type( 'house cat' );

        cy.wait( 4000 );

        cy.get( '.query-condition__value-input .wikit-OptionsMenu__item' )
          .first()
          .click();

        cy.get( '.querybuilder__run .wikit-Button' ).click();

        cy.get( '.querybuilder__result__iframe').should('be.visible' );
    });
})
