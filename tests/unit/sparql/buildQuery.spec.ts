import buildQuery from '@/sparql/buildQuery';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { Condition } from '@/sparql/QueryRepresentation';
import ReferenceRelation from '@/data-model/ReferenceRelation';

describe( 'buildQuery', () => {

	function getSimpleCondition( propertyId: string, value: string ): Condition {
		const propertyValueRelation = PropertyValueRelation.Matching;
		const simpleCondition: Condition = {
			propertyId,
			value,
			datatype: 'string',
			propertyValueRelation,
			referenceRelation: ReferenceRelation.Regardless,
			subclasses: false,
			negate: false,
		};

		return simpleCondition;
	}

	it( 'builds a query from a property and a string value', () => {
		const propertyId = 'P666';
		const value = 'blah';
		expect( buildQuery( {
			conditions: [
				getSimpleCondition( propertyId, value ),
			],
			omitLabels: true,
		} ) ).toEqual( `SELECT DISTINCT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) "${value}". }` );
	} );

	it( 'builds a query from a property and a string value with not matching selected', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const condition = getSimpleCondition( propertyId, value );
		condition.propertyValueRelation = PropertyValueRelation.NotMatching;

		const expectedQuery =
			`SELECT DISTINCT ?item WHERE {
			?item (p:${propertyId}/ps:${propertyId}) ?instance.
			MINUS { ?item (p:P666/ps:P666) "${value}". }
			}`;

		const receivedQuery = buildQuery( {
			conditions: [ condition ],
			omitLabels: true,
		} );

		expect( receivedQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from a property with "any value" selected', () => {
		const propertyId = 'P666';
		const condition = getSimpleCondition( propertyId, '' );
		condition.propertyValueRelation = PropertyValueRelation.Regardless;
		const expectedQuery =
			`SELECT DISTINCT ?item WHERE {
			?item (p:${propertyId}/ps:${propertyId}) _:anyValue${propertyId}.
			}`;
		const actualQuery = buildQuery( {
			conditions: [ condition ],
			omitLabels: true,
		} );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from multiple conditions, one matching and one regardless', () => {
		const expectedQuery =
			`SELECT DISTINCT ?item WHERE {
			?item (p:P666/ps:P666) "blah".
			?item (p:P66/ps:P66) _:anyValueP66.
			}`;
		const secondCondition = getSimpleCondition( 'P66', '' );
		secondCondition.propertyValueRelation = PropertyValueRelation.Regardless;
		const actualQuery = buildQuery( {
			conditions: [
				getSimpleCondition( 'P666', 'blah' ),
				secondCondition,
			],
			omitLabels: true,
		} );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from multiple conditions, one matching and one non-matching', () => {
		const expectedQuery =
			`SELECT DISTINCT ?item WHERE {
			?item (p:P666/ps:P666) "blah".
			?item (p:P66/ps:P66) ?instance.
			MINUS { ?item (p:P66/ps:P66) "foo". }
			}`;
		const secondCondition = getSimpleCondition( 'P66', 'foo' );
		secondCondition.propertyValueRelation = PropertyValueRelation.NotMatching;
		const actualQuery = buildQuery( {
			conditions: [
				getSimpleCondition( 'P666', 'blah' ),
				secondCondition,
			],
			omitLabels: true,
		} );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from multiple conditions, one non-matching and one matching', () => {
		const expectedQuery =
			`SELECT DISTINCT ?item WHERE {
			?item (p:P666/ps:P666) ?instance.
			MINUS { ?item (p:P666/ps:P666) "blah". }
			?item (p:P66/ps:P66) "foo".
			}`;
		const firstCondition = getSimpleCondition( 'P666', 'blah' );
		firstCondition.propertyValueRelation = PropertyValueRelation.NotMatching;
		const actualQuery = buildQuery( {
			conditions: [
				firstCondition,
				getSimpleCondition( 'P66', 'foo' ),
			],
			omitLabels: true,
		} );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from a property and an wikibase-item value', () => {
		const propertyId = 'P31';
		const value = 'Q146';
		const condition = getSimpleCondition( propertyId, value );
		condition.datatype = 'wikibase-item';
		expect( buildQuery( {
			conditions: [ condition ],
			omitLabels: true,
		} ) ).toEqual( `SELECT DISTINCT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) wd:${value}. }` );
	} );

	it( 'builds a query from a property and a string value with omitLabels set to false (shows labels)', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const expectedQuery =
			`SELECT DISTINCT ?item ?itemLabel WHERE {
			SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
			{ SELECT DISTINCT ?item WHERE { ?item (p:P666/ps:P666) "blah". } } }`;
		const actualQuery = buildQuery( {
			conditions: [ getSimpleCondition( propertyId, value ) ],
			omitLabels: false,
		} );
		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from a property and a string value with subclasses', async () => {
		const propertyId = 'P666';
		const value = 'blah';
		const subclassesId = process.env.VUE_APP_SUBCLASS_PROPERTY;
		const expectedQuery =
		`SELECT DISTINCT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}/(wdt:${subclassesId}*)) "${value}". }`;
		const condition = getSimpleCondition( propertyId, value );
		condition.subclasses = true;

		const actualQuery = buildQuery( {
			conditions: [ condition ],
			omitLabels: true,
		} );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from a property and a string value but with negate', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const expectedQuery =
			`SELECT DISTINCT ?item WHERE {
			?item wikibase:sitelinks _:anyValue.
			MINUS { ?item (p:${propertyId}/ps:${propertyId}) "${value}". }
			}`;
		const condition = getSimpleCondition( propertyId, value );
		condition.negate = true;
		const actualQuery = buildQuery( {
			conditions: [ condition ],
			omitLabels: true,
		} );
		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );
} );
