module.exports = {
	'QueryBuilder Component is rendered': ( client ) => {
		client
			.init()
			.waitForElementPresent( 'body' )
			.assert.visible( '.querybuilder' )
			.assert.containsText( '.querybuilder__heading', 'Simple Query Builder' );
	},
};
