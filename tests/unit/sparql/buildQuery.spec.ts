import buildQuery from '@/sparql/buildQuery';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'buildQuery', () => {

	it( 'builds a query from a property and a string value', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const propertyValueRelation = PropertyValueRelation.Matching;
		expect( buildQuery( { conditions: [
			{
				propertyId,
				value,
				datatype: 'string',
				propertyValueRelation,
			},
		],
		omitLabels: true,
		} ) ).toEqual( `SELECT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) "${value}". }` );
	} );

	it( 'builds a query from a property and a string value with not matching selected', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const propertyValueRelation = PropertyValueRelation.NotMatching;

		const expectedQuery =
			`SELECT ?item WHERE {
			?item (p:${propertyId}/ps:${propertyId}) ?instance.
			FILTER(?instance != "${value}")
			}`;

		const receivedQuery = buildQuery( { conditions: [
			{
				propertyId,
				value,
				datatype: 'string',
				propertyValueRelation,
			},
		], omitLabels: true } );

		expect( receivedQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from a property with "any value" selected', () => {
		const propertyId = 'P666';
		const propertyValueRelation = PropertyValueRelation.Regardless;

		expect( buildQuery( { conditions: [
			{
				propertyId,
				value: '',
				datatype: 'string',
				propertyValueRelation,
			},
		],
		omitLabels: true,
		} ) ).toEqual( `SELECT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) _:anyValue${propertyId}. }` );
	} );

	it( 'builds a query from multiple conditions, one matching and one regardless', () => {
		const expectedQuery =
			`SELECT ?item WHERE {
			?item (p:P666/ps:P666) "blah".
			?item (p:P66/ps:P66) _:anyValueP66.
			}`;
		const actualQuery = buildQuery( { conditions: [
			{
				propertyId: 'P666',
				value: 'blah',
				datatype: 'string',
				propertyValueRelation: PropertyValueRelation.Matching,
			},
			{
				propertyId: 'P66',
				value: '',
				datatype: 'string',
				propertyValueRelation: PropertyValueRelation.Regardless,
			},
		], omitLabels: true } );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from multiple conditions, one matching and one non-matching', () => {
		const expectedQuery =
			`SELECT ?item WHERE {
			?item (p:P666/ps:P666) "blah".
			?item (p:P66/ps:P66) ?instance.
			FILTER(?instance != "foo")
			}`;
		const actualQuery = buildQuery( { conditions: [
			{
				propertyId: 'P666',
				value: 'blah',
				datatype: 'string',
				propertyValueRelation: PropertyValueRelation.Matching,
			},
			{
				propertyId: 'P66',
				value: 'foo',
				datatype: 'string',
				propertyValueRelation: PropertyValueRelation.NotMatching,
			},
		], omitLabels: true } );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from multiple conditions, one non-matching and one matching', () => {
		const expectedQuery =
			`SELECT ?item WHERE {
			?item (p:P666/ps:P666) ?instance.
			FILTER(?instance != "blah")
			?item (p:P66/ps:P66) "foo".
			}`;
		const actualQuery = buildQuery( { conditions: [
			{
				propertyId: 'P666',
				value: 'blah',
				datatype: 'string',
				propertyValueRelation: PropertyValueRelation.NotMatching,
			},
			{
				propertyId: 'P66',
				value: 'foo',
				datatype: 'string',
				propertyValueRelation: PropertyValueRelation.Matching,
			},
		], omitLabels: true } );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from a property and an wikibase-item value', () => {
		const propertyId = 'P31';
		const value = 'Q146';
		const propertyValueRelation = PropertyValueRelation.Matching;
		const datatype = 'wikibase-item';
		expect( buildQuery( { conditions: [
			{
				propertyId,
				value,
				propertyValueRelation,
				datatype,
			},
		], omitLabels: true,
		} ) ).toEqual( `SELECT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) wd:${value}. }` );
	} );

	it( 'builds a query from a property and a string value with omitLabels set to false (shows labels)', () => {
		const propertyId = 'P666';
		const value = 'blah';
		const propertyValueRelation = PropertyValueRelation.Matching;
		const expectedQuery =
			`SELECT ?item ?itemLabel WHERE {
			SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
			?item (p:P666/ps:P666) "blah". }`;
		const actualQuery = buildQuery( { conditions: [
			{
				propertyId,
				value,
				datatype: 'string',
				propertyValueRelation,
			},
		],
		omitLabels: false,
		} );
		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );
} );
