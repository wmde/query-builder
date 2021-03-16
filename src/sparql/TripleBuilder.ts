import { IriTerm, PropertyPath, Term, Triple } from 'sparqljs';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import rdfNamespaces from '@/sparql/rdfNamespaces';
import ReferenceRelation from '@/data-model/ReferenceRelation';
import UnitValue from '@/data-model/UnitValue';

export default class TripleBuilder {
	public buildTripleFromQueryCondition(
		propertyId: string,
		datatype: string,
		propertyValueRelation: PropertyValueRelation,
		value: string | UnitValue,
		subclasses: boolean,
		referenceRelation: ReferenceRelation,
		conditionIndex: number,
	): Triple {
		return {
			subject: {
				termType: 'Variable',
				value: referenceRelation === ReferenceRelation.Regardless ?
					'item' : 'statement' + conditionIndex,
			},
			predicate: {
				type: 'path',
				pathType: '/',
				items: this.buildTriplePredicateItems( propertyId, referenceRelation, subclasses ),
			},
			object: this.buildTripleForObjectItems( propertyId, datatype, propertyValueRelation, value ),
		};
	}

	private checkValueType( value: string | UnitValue ): string | number {
		if ( typeof value === 'string' ) {
			return value;
		}
		throw new Error( 'Unit Values not yet supported!!' );
	}

	private buildTripleForObjectItems(
		propertyId: string,
		datatype: string,
		propertyValueRelation: PropertyValueRelation,
		value: string | UnitValue,
	): Term {
		switch ( propertyValueRelation ) {
			case ( PropertyValueRelation.NotMatching ):
				return {
					termType: 'Variable',
					value: 'instance',
				};
			case ( PropertyValueRelation.Regardless ):
				return {
					termType: 'BlankNode',
					value: 'anyValue' + propertyId,
				};
			case ( PropertyValueRelation.Matching ):
				return this.buildTripleForExplicitValue( datatype, this.checkValueType( value ) );
			default:
				throw new Error( `unsupported relation: ${propertyValueRelation}` );
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

	public buildTripleForNotMatchingValue( propertyId: string, datatype: string, value: string | UnitValue ): Triple {
		return {
			subject: {
				termType: 'Variable',
				value: 'item',
			},
			predicate: {
				type: 'path',
				pathType: '/',
				items: [
					{
						termType: 'NamedNode',
						value: rdfNamespaces.p + propertyId,
					},
					{
						termType: 'NamedNode',
						value: rdfNamespaces.ps + propertyId,
					},
				],
			},
			object: this.buildTripleForExplicitValue( datatype, this.checkValueType( value ) ),
		};
	}

	private buildTriplePredicateItems(
		propertyId: string,
		referenceRelation: ReferenceRelation,
		subclasses: boolean,
	): ( PropertyPath | IriTerm )[] {
		const items: ( PropertyPath | IriTerm )[] = [
			{
				termType: 'NamedNode',
				value: rdfNamespaces.p + propertyId,
			},
			{
				termType: 'NamedNode',
				value: rdfNamespaces.ps + propertyId,
			},
		];

		if ( referenceRelation !== ReferenceRelation.Regardless ) {
			items.shift(); // for references we only need rdfNamespaces.ps
		}

		if ( subclasses ) {
			items.push(
				{
					type: 'path',
					pathType: '*',
					items: [ {
						termType: 'NamedNode',
						value: rdfNamespaces.wdt + this.getSubclassPropertyId( propertyId ),
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
