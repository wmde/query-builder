import rdfNamespaces from '@/sparql/rdfNamespaces';
import QueryRepresentation, { Condition } from '@/sparql/QueryRepresentation';
import { IriTerm, Pattern, PropertyPath, SelectQuery, Term } from 'sparqljs';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default class QueryObjectBuilder {
	private queryObject: SelectQuery;

	public constructor() {
		this.queryObject = {
			queryType: 'SELECT',
			distinct: true,
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
						triples: [
							{
								subject: {
									termType: 'Variable',
									value: 'item',
								},
								predicate: {
									termType: 'NamedNode',
									value: rdfNamespaces.wikibase + 'sitelinks',
								},
								object: {
									termType: 'BlankNode',
									value: 'anyValue',
								},
							},
						],
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

	private buildTripleObject( condition: Condition ): Term {
		// TODO: Consider extracting this into a new class when adding less than / more than
		switch ( condition.propertyValueRelation ) {
			case ( PropertyValueRelation.NotMatching ):
				return {
					termType: 'Variable',
					value: 'instance',
				};
			case ( PropertyValueRelation.Regardless ):
				return {
					termType: 'BlankNode',
					value: 'anyValue' + condition.propertyId,
				};
			case ( PropertyValueRelation.Matching ):
				return this.buildTripleObjectForExplicitValue( condition.datatype, condition.value );
			default:
				throw new Error( `unsupported relation: ${condition.propertyValueRelation}` );
		}
	}

	private buildTripleObjectForExplicitValue( datatype: string, value: string ): Term {
		// TODO: Consider extracting this into a new class when adding unit type
		switch ( datatype ) {
			case 'string':
			case 'external-id':
				return {
					termType: 'Literal',
					value: value,
				};
			case 'wikibase-item':
				return {
					termType: 'NamedNode', // this.mapDatatypeToTermType( condition.datatype ),
					value: `${rdfNamespaces.wd}${value}`,
				};
			default:
				throw new Error( `unsupported datatype: ${datatype}` );
		}
	}

	private buildTriplePredicateItems( condition: Condition ): ( PropertyPath|IriTerm )[] {
		const items: ( PropertyPath|IriTerm )[] = [ {
			termType: 'NamedNode',
			value: rdfNamespaces.p + condition.propertyId,
		},
		{
			termType: 'NamedNode',
			value: rdfNamespaces.ps + condition.propertyId,
		} ];

		if ( condition.subclasses ) {
			items.push(
				{
					type: 'path',
					pathType: '*',
					items: [ {
						termType: 'NamedNode',
						value: rdfNamespaces.wdt + process.env.VUE_APP_SUBCLASS_PROPERTY,
					},
					],
				},
			);
		}

		return items;
	}

	private buildFromQueryCondition( condition: Condition ): void {
		const tripleObject: Term = this.buildTripleObject( condition );
		const negate: boolean = condition.negate || false;
		const bgp: Pattern = {
			type: 'bgp',
			triples: [
				{
					subject: {
						termType: 'Variable',
						value: 'item',
					},
					predicate: { type: 'path',
						pathType: '/',
						items: this.buildTriplePredicateItems( condition ) },
					object: tripleObject,
				},
			],
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
								} ] },
							object: this.buildTripleObjectForExplicitValue( condition.datatype, condition.value ),
						},
					],
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
							triples: [ {
								subject: {
									termType: 'NamedNode',
									value: rdfNamespaces.bd + 'serviceParam',
								},
								predicate: {
									termType: 'NamedNode',
									value: rdfNamespaces.wikibase + 'language',
								},
								object: {
									termType: 'Literal',
									value: '[AUTO_LANGUAGE]',
								},
							} ],
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
