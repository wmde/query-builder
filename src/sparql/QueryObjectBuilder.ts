import rdfNamespaces from '@/sparql/rdfNamespaces';
import QueryRepresentation, { Condition } from '@/sparql/QueryRepresentation';
import { Pattern, SelectQuery } from 'sparqljs';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import TripleBuilder from '@/sparql/TripleBuilder';

export default class QueryObjectBuilder {
	private queryObject: SelectQuery;
	private tripleBuilder: TripleBuilder;

	public constructor() {
		this.queryObject = {
			queryType: 'SELECT',
			distinct: true,
			variables: [],
			where: [],
			type: 'query',
			prefixes: rdfNamespaces,
		};
		this.tripleBuilder = new TripleBuilder();
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

		if ( this.queryObject.where ) {
			// If it's a negate query only, we need to add "any item" to it otherwise it returns empty result.
			let isOnlyNegateQuery = true;
			for ( let i = 0; i < this.queryObject.where?.length; i++ ) {
				const type = this.queryObject.where[ i ].type;
				if ( type !== 'minus' ) {
					isOnlyNegateQuery = false;
					break;
				}
			}

			if ( isOnlyNegateQuery ) {
				this.queryObject.where.unshift(
					{
						type: 'bgp',
						triples: [ this.tripleBuilder.buildAnyValueTripe() ],
					},
				);
			}
		}

		if ( queryRepresentation.limit ) {
			this.queryObject.limit = queryRepresentation.limit;
		}

		if ( !queryRepresentation.omitLabels ) {
			return this.wrapQueryWithLabel();
		}

		return this.queryObject;
	}

	private buildFromQueryCondition( condition: Condition ): void {
		const negate: boolean = condition.negate || false;
		const bgp: Pattern = {
			type: 'bgp',
			triples: [ this.tripleBuilder.buildTripleFromQueryCondition( condition ) ],
		};

		if ( !this.queryObject.where ) {
			this.queryObject.where = [];
		}

		if ( negate === true ) {
			this.queryObject.where.push( {
				type: 'minus',
				patterns: [ bgp ],
			} );
		} else {
			this.queryObject.where.push( bgp );
		}

		if ( condition.propertyValueRelation === PropertyValueRelation.NotMatching ) {
			const filterCondition = {
				type: 'minus',
				patterns: [ {
					type: 'bgp',
					triples: [ this.tripleBuilder.buildTripleForNotMatchingValue( condition ) ],
				} ],
			};

			this.queryObject.where.push( filterCondition as Pattern );
		}
	}

	private wrapQueryWithLabel(): SelectQuery {
		const wrapperQuery: SelectQuery = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
				{
					termType: 'Variable',
					value: 'itemLabel',
				},
			],
			where: [
				{
					type: 'service',
					patterns: [
						{
							type: 'bgp',
							triples: [ this.tripleBuilder.buildLabelServiceTriple() ],
						},
					],
					name: {
						termType: 'NamedNode',
						value: rdfNamespaces.wikibase + 'label',
					},
					silent: false,
				},
			],
			type: 'query',
			prefixes: rdfNamespaces,
		};

		if ( !wrapperQuery.where ) {
			wrapperQuery.where = [];
		}
		this.queryObject.prefixes = {};
		wrapperQuery.where.push( {
			type: 'group',
			patterns: [ this.queryObject ],
		} );

		return wrapperQuery;
	}
}
