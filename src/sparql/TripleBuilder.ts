import { Condition } from '@/sparql/QueryRepresentation';
import { IriTerm, PropertyPath, Term, Triple } from 'sparqljs';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import rdfNamespaces from '@/sparql/rdfNamespaces';
import ReferenceRelation from '@/data-model/ReferenceRelation';
import UnitValue from '@/data-model/UnitValue';

export default class TripleBuilder {
	public buildTripleFromQueryCondition( condition: Condition, conditionIndex: number ): Triple {
		return {
			subject: {
				termType: 'Variable',
				value: condition.referenceRelation === ReferenceRelation.Regardless ?
					'item' : 'statement' + conditionIndex,
			},
			predicate: { type: 'path',
				pathType: '/',
				items: this.buildTriplePredicateItems( condition ) },
			object: this.buildTripleForObjectItems( condition ),
		};
	}

	private checkValueType( value: string | UnitValue ): string | number {
		if ( typeof value === 'string' ) {
			return value;
		}
		throw new Error( 'Unit Values not yet supported!!' );
	}

	private buildTripleForObjectItems( condition: Condition ): Term {
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
				return this.buildTripleForExplicitValue( condition.datatype, this.checkValueType( condition.value ) );
			default:
				throw new Error( `unsupported relation: ${condition.propertyValueRelation}` );
		}
	}

	private buildTripleForExplicitValue( datatype: string, value: string | number ): Term {
		switch ( datatype ) {
			case 'string':
			case 'external-id':
				return {
					termType: 'Literal',
					value: String( value ),
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

	public buildTripleForNotMatchingValue( condition: Condition ): Triple {
		return {
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
			object: this.buildTripleForExplicitValue( condition.datatype, this.checkValueType( condition.value ) ),
		};
	}

	private buildTriplePredicateItems( condition: Condition ): ( PropertyPath | IriTerm )[] {
		const items: ( PropertyPath|IriTerm )[] = [ {
			termType: 'NamedNode',
			value: rdfNamespaces.p + condition.propertyId,
		},
		{
			termType: 'NamedNode',
			value: rdfNamespaces.ps + condition.propertyId,
		} ];

		if ( condition.referenceRelation !== ReferenceRelation.Regardless ) {
			items.shift(); // for references we only need rdfNamespaces.ps
		}

		if ( condition.subclasses ) {
			items.push(
				{
					type: 'path',
					pathType: '*',
					items: [ {
						termType: 'NamedNode',
						value: rdfNamespaces.wdt + this.getSubclassPropertyId( condition.propertyId ),
					},
					],
				},
			);
		}

		return items;
	}

	private getSubclassPropertyId( propertyId: string ): string {
		if ( !process.env.VUE_APP_SUBCLASS_PROPERTY_MAP ) {
			return 'P279';
		}
		const propertyMap = JSON.parse( process.env.VUE_APP_SUBCLASS_PROPERTY_MAP );
		if ( !propertyMap[ propertyId ] ) {
			return propertyMap.default;
		}
		return propertyMap[ propertyId ];

	}

	public buildReferenceFilterTriple( conditionIndex: number ): Triple {
		return {
			subject: {
				termType: 'Variable',
				value: 'statement' + conditionIndex,
			},
			predicate: {
				termType: 'NamedNode',
				value: rdfNamespaces.prov + 'wasDerivedFrom',
			},
			object: {
				termType: 'Variable',
				value: 'reference',
			},
		};
	}

	public buildAnyValueTripe(): Triple {
		return {
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
		};
	}

	public buildLabelServiceTriple(): Triple {
		return {
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
		};
	}

}
