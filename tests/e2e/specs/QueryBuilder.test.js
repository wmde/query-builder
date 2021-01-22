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
			.setCookie( { name: 'foo', value: 'bar' } )
			.setValue( '.query-condition__property-lookup input', 'post' )
			.waitForElementPresent( '.wikit-OptionsMenu__item' )
			.click( '.wikit-OptionsMenu__item' )
			.setValue( '.query-condition__value-input input', '123' )
			.click( '.querybuilder__run-query-button' )
			.waitForElementPresent( '.querybuilder__result__iframe' )
			.assert.attributeEquals(
				'.querybuilder__result__iframe',
				'src',
				process.env.DEPLOY_URL + '/.netlify/functions/queryServiceEmbed#SELECT%20?item%20WHERE%20%7B%20?item%20(p:P281/ps:P281)%20%22123%22.%20%7D',
			);
	},
};
