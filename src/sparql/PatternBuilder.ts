import UnitValue from '@/data-model/UnitValue';
import TripleBuilder from '@/sparql/TripleBuilder';
import rdfNamespaces from '@/sparql/rdfNamespaces';
import { Condition } from '@/sparql/QueryRepresentation';
import { FilterPattern, GroupPattern, Pattern, Triple } from 'sparqljs';
import ReferenceRelation from '@/data-model/ReferenceRelation';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default class PatternBuilder {
	private tripleBuilder: TripleBuilder;

	public constructor() {
		this.tripleBuilder = new TripleBuilder();
	}

	public buildValuePatternFromCondition( condition: Condition, conditionIndex: number ): Pattern[] {
		const {
			propertyId,
			referenceRelation,
			propertyValueRelation,
			datatype,
			subclasses,
			value,
			negate,
		} = condition;

		const patterns: Pattern[] = [];

		let pattern: Pattern;

		if ( referenceRelation !== ReferenceRelation.Regardless ) {
			pattern = this.buildReferencesGroupPattern(
				propertyId,
				datatype,
				propertyValueRelation,
				value,
				subclasses,
				referenceRelation,
				conditionIndex,
			);
		} else {
			const statementSubjectName = 'statement' + conditionIndex;
			const entityToStatementTriple: Triple = {
				subject: {
					termType: 'Variable',
					value: 'item',
				},
				predicate: {
					termType: 'NamedNode',
					value: rdfNamespaces.p + propertyId,
				},
				object: {
					termType: 'Variable',
					value: statementSubjectName,
				},
			};
			const statementToValueTriple = this.tripleBuilder.buildTripleFromQueryCondition(
				propertyId,
				datatype,
				propertyValueRelation,
				value,
				subclasses,
				statementSubjectName,
			);
			pattern = {
				type: 'bgp',
				triples: [
					entityToStatementTriple,
					statementToValueTriple,
				],
			};
		}

		if ( negate ) {
			pattern = {
				type: 'minus',
				patterns: [ pattern ],
			};
		}

		patterns.push( pattern );

		if ( propertyValueRelation === PropertyValueRelation.NotMatching ) {
			const filterCondition = {
				type: 'minus',
				patterns: [ {
					type: 'bgp',
					triples: [ this.tripleBuilder.buildTripleForNotMatchingValue( propertyId, datatype, value ) ],
				} ],
			};

			patterns.push( filterCondition as Pattern );
		}

		return patterns;
	}

	public buildLabelServicePattern(): Pattern {
		return {
			type: 'bgp',
			triples: [ this.tripleBuilder.buildLabelServiceTriple() ],
		};
	}

	public buildAnyValuePattern(): Pattern {
		return {
			type: 'bgp',
			triples: [ this.tripleBuilder.buildAnyValueTripe() ],
		};
	}

	private buildReferencesGroupPattern(
		propertyId: string,
		datatype: string,
		propertyValueRelation: PropertyValueRelation,
		value: string | UnitValue,
		subclasses: boolean,
		referenceRelation: ReferenceRelation,
		conditionIndex: number,
	): GroupPattern {
		const statementSubjectName = 'statement' + conditionIndex;
		const referenceTriple: Triple = {
			subject: {
				termType: 'Variable',
				value: 'item',
			},
			predicate: {
				termType: 'NamedNode',
				value: rdfNamespaces.p + propertyId,
			},
			object: {
				termType: 'Variable',
				value: statementSubjectName,
			},
		};

		const bgpReference: Pattern = {
			type: 'bgp',
			triples: [ referenceTriple ],
		};

		const bgp: Pattern = {
			type: 'bgp',
			triples: [ this.tripleBuilder.buildTripleFromQueryCondition(
				propertyId,
				datatype,
				propertyValueRelation,
				value,
				subclasses,
				statementSubjectName,
			) ],
		};

		let referenceExistsOrNot = '';

		if ( referenceRelation === ReferenceRelation.With ) {
			referenceExistsOrNot = 'exists';
		} else if ( referenceRelation === ReferenceRelation.Without ) {
			referenceExistsOrNot = 'notexists';
		}

		const referenceFilter: FilterPattern = {
			type: 'filter',
			expression: {
				type: 'operation',
				operator: referenceExistsOrNot,
				args: [
					{
						type: 'bgp',
						triples: [
							this.tripleBuilder.buildReferenceFilterTriple( statementSubjectName ),
						],
					},
				],
			},
		};

		return {
			type: 'group',
			patterns: [ bgpReference, bgp, referenceFilter ],
		};
	}
}
