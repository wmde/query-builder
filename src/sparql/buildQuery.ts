import QueryRepresentation from './QueryRepresentation';
import QueryBuilderSparqlGenerator from '@/sparql/QueryBuilderSparqlGenerator';
import rdfNamespaces from '@/sparql/rdfNamespaces';
import { Generator as SparqlGenerator, SelectQuery } from 'sparqljs';

export default function buildQuery( query: QueryRepresentation ): string {
	const queryObject: SelectQuery = {
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
	const queryBuilderSparqlGenerator = new QueryBuilderSparqlGenerator( new SparqlGenerator() );

	return queryBuilderSparqlGenerator.getString( queryObject );
}
