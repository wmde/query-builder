import QueryRepresentation from './QueryRepresentation';
import QueryBuilderSparqlGenerator from '@/sparql/QueryBuilderSparqlGenerator';
import { Generator as SparqlGenerator, SelectQuery } from 'sparqljs';
import QueryObjectBuilder from '@/sparql/QueryObjectBuilder';

export default function buildQuery( query: QueryRepresentation ): string {
	const queryObjectBuilder = new QueryObjectBuilder();
	const queryObject: SelectQuery = queryObjectBuilder.buildFromQueryRepresentation( query );
	const queryBuilderSparqlGenerator = new QueryBuilderSparqlGenerator( new SparqlGenerator() );

	return queryBuilderSparqlGenerator.getString( queryObject );
}
