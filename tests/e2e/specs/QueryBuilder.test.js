function encodeSparql( sparqlQuery ) {
	/**
	 * TODO: find a better way to do this
	 * The actual attribute value returned by nightwatch is neither the product
	 * of encodeURIComponent nor of (new URL()).hash, but something in between.
	 */

	let encodedQuery = encodeURIComponent( sparqlQuery );

	const revertEncoding = {
		'%28': '(',
		'%29': ')',
		'%2F': '/',
		'%3A': ':',
		'%3F': '?',
	};

	Object.entries( revertEncoding ).forEach( ( [ search, replace ] ) => {
		encodedQuery = encodedQuery.replace( new RegExp( search, 'g' ), replace );
	} );

	return encodedQuery;
}

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
		const encodedQuery = encodeSparql( sparqlQuery );

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
				`${process.env.DEPLOY_URL}/.netlify/functions/queryServiceEmbed#${encodedQuery}`,
			);
	},
};
