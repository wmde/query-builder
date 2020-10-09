// Interface that encapsulates behavior of SparqlGenerator in sparqljs
import SparqlGenerator from '@/sparql/SparqlGenerator';
import allNamespaces from '@/sparql/rdfNamespaces';
import Sparqljs from '@/sparql/Sparqljs';


class QueryBuilderSparqlGenerator {
	private sparqlGenerator: SparqlGenerator;

	public constructor( sparqlGenerator: SparqlGenerator ) {
		this.sparqlGenerator = sparqlGenerator;
	}

	public getString( query: Sparqljs.SelectQuery | {} ): string {
		let queryString: string = this.sparqlGenerator.stringify( query );
		for ( const [ prefix, iri ] of Object.entries( allNamespaces ) ) {
			queryString = queryString.replace( `PREFIX ${prefix}: <${iri}>\n`, '' );
		}

		return queryString;
	}
}

export default QueryBuilderSparqlGenerator;
