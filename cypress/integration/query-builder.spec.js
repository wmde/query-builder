describe( 'QueryBuilder Component is rendered', () => {
    it( 'loads the app', () => {
        cy.visit( '/' );
        cy.get( '.querybuilder' ).should( 'be.visible' );
        cy.get( '.querybuilder__heading' ).should( 'contain', 'Simple Query Builder' )
      })
} )
