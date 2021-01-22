module.exports = {
	'QueryBuilder Component is rendered': ( client ) => {
		client
			.init()
			.waitForElementPresent( 'body' )
			.assert.visible( '.querybuilder' )
			.assert.containsText( '.querybuilder__heading', 'Simple Query Builder' );
	},
	'can select property and execute query': ( client ) => {
		const sparqlQuery = `SELECT ?item ?itemLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
  ?item (p:P281/ps:P281) "123".
}
LIMIT 100`;
		const queryHash = ( new URL( sparqlQuery, 'https://example.com' ) ).hash;

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
				`${process.env.DEPLOY_URL}/.netlify/functions/queryServiceEmbed${queryHash}`,
			);
	},
};
