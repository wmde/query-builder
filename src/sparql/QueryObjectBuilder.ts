import rdfNamespaces from '@/sparql/rdfNamespaces';
import QueryRepresentation, { Condition } from '@/sparql/QueryRepresentation';
import { FilterPattern, Pattern, SelectQuery, Variable } from 'sparqljs';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import TripleBuilder from '@/sparql/TripleBuilder';
import ConditionRelation from '@/data-model/ConditionRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';

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

		// findUnions
		let currentUnion: Condition[] | null = null;
		const conditions: ( Condition | Condition[] )[] = [];
		for ( let i = 0; i < queryRepresentation.conditions.length; i++ ) {
			if ( queryRepresentation.conditions[ i ].conditionRelation === ConditionRelation.Or ) {
				if ( currentUnion === null ) {
					const previousCondition = conditions.pop();
					if ( !previousCondition ) {
						throw new Error( 'Logic error: empty conditions array when starting union' );
					}
					if ( Array.isArray( previousCondition ) ) {
						throw new Error( 'Logic error: condition array contains union when starting new union' );
					}
					currentUnion = [];
					currentUnion.push( previousCondition );
				}
				currentUnion.push( queryRepresentation.conditions[ i ] );
			} else {
				if ( currentUnion !== null ) {
					conditions.push( currentUnion );
				}
				currentUnion = null;
				conditions.push( queryRepresentation.conditions[ i ] );
			}
		}
		if ( currentUnion !== null ) {
			conditions.push( currentUnion );
		}

		for ( let i = 0; i < conditions.length; i++ ) {
			const conditionOrUnion = conditions[ i ];
			if ( Array.isArray( conditionOrUnion ) ) {
				this.buildUnion( conditionOrUnion );
				continue;
			}
			this.buildFromQueryCondition( conditionOrUnion, i );
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

	private buildUnion( conditions: Condition[] ): void {
		const unionConditions = [];
		for ( let i = 0; i < conditions.length; i++ ) {
			unionConditions.push( ...this.buildIndividualCondition( conditions[ i ], i ) );
		}
		const union: Pattern = {
			type: 'union',
			patterns: unionConditions,
		};
		if ( !this.queryObject.where ) {
			this.queryObject.where = [];
		}
		this.queryObject.where.push( union );
	}

	private buildIndividualCondition( condition: Condition, conditionIndex: number ): Pattern[] {
		const negate: boolean = condition.negate || false;
		const bgp: Pattern = {
			type: 'bgp',
			triples: [ this.tripleBuilder.buildTripleFromQueryCondition( condition, conditionIndex ) ],
		};

		const existsReferenceFilter: FilterPattern = {
			type: 'filter',
			expression: {
				type: 'operation',
				operator: 'exists',
				args: [
					{
						type: 'bgp',
						triples: [
							this.tripleBuilder.buildReferenceTriple( condition, conditionIndex ),
						],
					},
				],
			},
		};

		const patterns: Pattern[] = [];

		if ( negate === true ) {
			patterns.push( {
				type: 'minus',
				patterns: [ bgp ],
			} );
		} else {
			patterns.push( bgp );
			if ( condition.referenceRelation === ReferenceRelation.With ) {
				patterns.push( existsReferenceFilter );
				( this.queryObject.variables as Variable[] ).push(
					{
						termType: 'Variable',
						value: 'statement' + conditionIndex,
					},
				);
			}
		}

		if ( condition.propertyValueRelation === PropertyValueRelation.NotMatching ) {
			const filterCondition = {
				type: 'minus',
				patterns: [ {
					type: 'bgp',
					triples: [ this.tripleBuilder.buildTripleForNotMatchingValue( condition ) ],
				} ],
			};

			patterns.push( filterCondition as Pattern );
		}

		return patterns;
	}

	private buildFromQueryCondition( condition: Condition, conditionIndex: number ): void {
		if ( !this.queryObject.where ) {
			this.queryObject.where = [];
		}
		this.queryObject.where.push( ...this.buildIndividualCondition( condition, conditionIndex ) );
		return;
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
