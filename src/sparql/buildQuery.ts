import QueryRepresentation from './QueryRepresentation';
import QueryBuilderSparqlGenerator from '@/sparql/QueryBuilderSparqlGenerator';
import rdfNamespaces from '@/sparql/rdfNamespaces';

// TODO add .d.ts file and import as a normal module
const sparqlJsGenerator = require( 'sparqljs' ).Generator();

export default function buildQuery( query: QueryRepresentation ): string {
	const queryObject = {
		queryType: 'SELECT',
		variables: [
			{
				termType: 'Variable',
				value: 'item'
			}
		],
		where: [
			{
				type: 'bgp',
				triples: [
					{
						subject: {
							termType: 'Variable',
							value: 'item'
						},
						predicate: {
							termType: 'NamedNode',
							value: rdfNamespaces.wdt + query.property.id
						},
						object: {
							termType: 'Literal',
							value: query.value
						}
					}
				]
			}
		],
		type: 'query',
		prefixes: rdfNamespaces
	};
	const queryBuilderSparqlGenerator = new QueryBuilderSparqlGenerator( sparqlJsGenerator );

	return queryBuilderSparqlGenerator.getString( queryObject );
}
