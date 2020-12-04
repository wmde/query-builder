import rdfNamespaces from '@/sparql/rdfNamespaces';
import QueryRepresentation, { Condition } from '@/sparql/QueryRepresentation';
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

		for ( let i = 0; i < queryRepresentation.conditions.length; i++ ) {
			this.buildFromQueryCondition( queryRepresentation.conditions[ i ] );
		}

		return this.queryObject;
	}

	private buildFromQueryCondition( condition: Condition ): void {
		let tripleObject = {} as Term;

		switch ( condition.propertyValueRelation ) {
			case ( PropertyValueRelation.Matching ):
				tripleObject = {
					termType: 'Literal',
					value: condition.value,
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
					value: condition.value,
				};
		}

		if ( !this.queryObject.where ) {
			this.queryObject.where = [];
		}

		this.queryObject.where.push(
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
								value: rdfNamespaces.p + condition.propertyId,
							},
							{
								termType: 'NamedNode',
								value: rdfNamespaces.ps + condition.propertyId,
							},
							] },
						object: tripleObject,
					},
				],
			},
		);

		if ( condition.propertyValueRelation === PropertyValueRelation.NotMatching ) {
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
							value: condition.value,
						},
					],
				},
			};

			this.queryObject.where.push( filterCondition as Pattern );
		}
	}
}
