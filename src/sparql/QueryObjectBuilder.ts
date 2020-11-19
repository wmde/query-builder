import rdfNamespaces from '@/sparql/rdfNamespaces';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import { SelectQuery, Term } from 'sparqljs';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default class QueryObjectBuilder {
	private queryObject: SelectQuery;

	public constructor() {
		this.queryObject = {
			queryType: 'SELECT',
			variables: [],
			where: [],
			type: 'query',
			prefixes: rdfNamespaces,
		};
	}

	public buildFromQueryRepresentation( queryRepresentation: QueryRepresentation ): SelectQuery {

		this.queryObject.variables = [
			{
				termType: 'Variable',
				value: 'item',
			},
		];

		let tripleObject = {} as Term;

		switch ( queryRepresentation.condition.propertyValueRelation ) {
			case ( PropertyValueRelation.Matching ):
				tripleObject = {
					termType: 'Literal',
					value: queryRepresentation.condition.value,
				};
				break;
			case ( PropertyValueRelation.Regardless ):
				tripleObject = {
					termType: 'BlankNode',
					value: 'anyValue',
				};
				break;
			default:
				tripleObject = {
					termType: 'Literal',
					value: queryRepresentation.condition.value,
				};
		}

		this.queryObject.where = [
			{
				type: 'bgp',
				triples: [
					{
						subject: {
							termType: 'Variable',
							value: 'item',
						},
						predicate: { type: 'path',
							pathType: '/',
							items: [ {
								termType: 'NamedNode',
								value: rdfNamespaces.p + queryRepresentation.condition.propertyId,
							},
							{
								termType: 'NamedNode',
								value: rdfNamespaces.ps + queryRepresentation.condition.propertyId,
							},
							] },
						object: tripleObject,
					},
				],
			},
		];

		return this.queryObject;
	}
}
