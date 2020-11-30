module.exports = {
	'QueryBuilder Component is rendered': ( client ) => {
		client
			.init()
			.waitForElementPresent( 'body' )
			.assert.visible( '.querybuilder' )
			.assert.containsText( '.querybuilder__heading', 'Simple Query Builder' );
	},
	'can select property and execute query': ( client ) => {
		/* eslint-disable max-len */
		client
			.init()
			.waitForElementPresent( 'body' )
			.assert.visible( '.querybuilder' )
			.setValue( '.wikit-Lookup input', 'post' ) // FIXME: better class
			.waitForElementPresent( '.wikit-LookupMenu__item' ) // FIXME: better class
			.click( '.wikit-LookupMenu__item' ) // FIXME: better class
			.setValue( '.querybuilder__rule__value input', '123' )
			.click( '.querybuilder__run-query-button' )
			.waitForElementPresent( '.querybuilder__result__iframe' )
			.assert.attributeEquals(
				'.querybuilder__result__iframe',
				'src',
				'http://localhost:3000/embed.html#SELECT%20?item%20WHERE%20%7B%20?item%20(p:P281/ps:P281)%20%22123%22.%20%7D',
			);
	},
};
