import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';
import buildQuery from '@/sparql/buildQuery';
import QueryRepresentation, { Condition } from '@/sparql/QueryRepresentation';

describe( 'buildQuery', () => {

	function splitByNegateOption( condition: Partial<Condition> ): Partial<Condition>[] {
		return [ true, false ].map( ( option ) => {
			return {
				negate: option,
				...condition,
			};
		} );
	}

	function splitByReferenceOption( condition: Partial<Condition> ): Partial<Condition>[] {
		return Object.values( ReferenceRelation ).map( ( option ) => {
			return {
				referenceRelation: option,
				...condition,
			};
		} );
	}

	function splitByPropertyValueRelations( condition: Partial<Condition> ): Partial<Condition>[] {
		return Object.values( PropertyValueRelation ).map( ( option ) => {
			return {
				propertyValueRelation: option,
				...condition,
			};
		} );
	}

	function createConditions( conditionOverrides: Partial<Condition> ): Condition[] {
		let conditions: Record<string, unknown>[] = [ {
			propertyId: 'P123',
			conditionRelation: null,
			subclasses: false,
			...conditionOverrides,
		} ];

		conditions = conditions.map( splitByNegateOption ).flat();
		conditions = conditions.map( splitByReferenceOption ).flat();
		conditions = conditions.map( splitByPropertyValueRelations ).flat();

		return conditions as Condition[];
	}

	function createCases( caseOverrides: Partial<Condition>[] ): Condition[][] {
		return caseOverrides
			.map( createConditions )
			.flat()
			.map( ( condition: Condition ) => {
				return [ condition ];
			} );
	}

	const caseOverrides: Partial<Condition>[] = [
		{
			value: 'a string value',
			datatype: 'string',
		},
		{
			value: 'Q123',
			datatype: 'wikibase-item',
		},
		{
			value: 'Q123',
			datatype: 'wikibase-item',
			subclasses: true,
		},
	];

	it.each(
		createCases( caseOverrides ),
	)( 'builds a query from a single condition QueryRepresentation: %p', ( condition: Condition ) => {
		const simpleQueryCondition: QueryRepresentation = {
			conditions: [ condition ],
			omitLabels: true,
		};
		expect( buildQuery( simpleQueryCondition ) ).toMatchSnapshot();
	} );
} );
