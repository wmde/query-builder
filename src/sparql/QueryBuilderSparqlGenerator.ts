import allNamespaces from '@/sparql/rdfNamespaces';
import {
	SelectQuery,
	SparqlGenerator,
} from 'sparqljs';

class QueryBuilderSparqlGenerator {
	private sparqlGenerator: SparqlGenerator;

	public constructor( sparqlGenerator: SparqlGenerator ) {
		this.sparqlGenerator = sparqlGenerator;
	}

	public getString( query: SelectQuery ): string {
		let queryString: string = this.sparqlGenerator.stringify( query );
		for ( const [ prefix, iri ] of Object.entries( allNamespaces ) ) {
			queryString = queryString.replace( `PREFIX ${prefix}: <${iri}>\n`, '' );
		}

		return queryString;
	}
}

export default QueryBuilderSparqlGenerator;
