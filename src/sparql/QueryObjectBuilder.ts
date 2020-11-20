import rdfNamespaces from '@/sparql/rdfNamespaces';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import { Pattern, SelectQuery, Term } from 'sparqljs';
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
			case ( PropertyValueRelation.NotMatching ):
				tripleObject = {
					termType: 'Variable',
					value: 'instance',
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

		if ( queryRepresentation.condition.propertyValueRelation === PropertyValueRelation.NotMatching ) {
			const filterCondition = {
				type: 'filter',
				expression: {
					type: 'operation',
					operator: '!=',
					args: [
						{
							termType: 'Variable',
							value: 'instance',
						},
						{
							termType: 'Literal',
							value: queryRepresentation.condition.value,
						},
					],
				},
			};

			this.queryObject.where.push( filterCondition as Pattern );
		}

		return this.queryObject;
	}
}
