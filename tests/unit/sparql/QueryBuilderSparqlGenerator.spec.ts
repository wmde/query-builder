import QueryBuilderSparqlGenerator from '@/sparql/QueryBuilderSparqlGenerator';
import SparqlGenerator from '@/sparql/SparqlGenerator';
import {SelectQuery} from "sparqljs";

describe( 'QueryBuilderSparqlGenerator', () => {

	it( 'generates empty string', () => {
		const sparqlGenerator: SparqlGenerator = require( 'sparqljs' ).Generator();
		const queryBuilderSparqlGenerator = new QueryBuilderSparqlGenerator(
			sparqlGenerator
		);
		const queryObject = {};

		expect( queryBuilderSparqlGenerator.getString( queryObject ) ).toBe( '' );
	} );

	it( 'generates simple query', () => {
		const prefixes = {
			wdt: 'http://www.wikidata.org/prop/direct/'
		};
		const sparqlGenerator: SparqlGenerator = require( 'sparqljs' ).Generator( prefixes );
		const queryBuilderSparqlGenerator = new QueryBuilderSparqlGenerator(
			sparqlGenerator
		);
		const queryString = 'select ?city where {\n' +
            '  ?city wdt:P281 "XXXX" .\n' +
            '}';
		const SparqlParser = require( 'sparqljs' ).Parser;
		const parser = new SparqlParser( {
			prefixes: prefixes
		} );
		const queryObject = parser.parse( queryString );

		expect( queryBuilderSparqlGenerator.getString( queryObject ) ).toBe( 'SELECT ?city WHERE { ?city wdt:P281 "XXXX". }' );
	} );

	it( 'generates simple query from object', () => {
		const prefixes = {
			wdt: 'http://www.wikidata.org/prop/direct/'
		};
		const queryObject: SelectQuery = {
			queryType: 'SELECT',
			variables: [
				{
					termType: 'Variable',
					value: 'city'
				}
			],
			where: [
				{
					type: 'bgp',
					triples: [
						{
							subject: {
								termType: 'Variable',
								value: 'city'
							},
							predicate: {
								termType: 'NamedNode',
								value: 'http://www.wikidata.org/prop/direct/P281'
							},
							object: {
								termType: 'Literal',
								value: 'XXXX'
							}
						}
					]
				}
			],
			type: 'query',
			prefixes: prefixes
		};
		const sparqlGenerator: SparqlGenerator = require( 'sparqljs' ).Generator( prefixes );
		const queryBuilderSparqlGenerator = new QueryBuilderSparqlGenerator(
			sparqlGenerator
		);

		expect( queryBuilderSparqlGenerator.getString( queryObject ) ).toBe( 'SELECT ?city WHERE { ?city wdt:P281 "XXXX". }' );
	} );

} );
