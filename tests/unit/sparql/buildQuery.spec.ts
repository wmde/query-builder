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
				propertyValueRelation,
			},
		] } ) ).toEqual( `SELECT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) "${value}". }` );
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
				propertyValueRelation,
			},
		] } );

		expect( receivedQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );

	it( 'builds a query from a property with "any value" selected', () => {
		const propertyId = 'P666';
		const propertyValueRelation = PropertyValueRelation.Regardless;

		expect( buildQuery( { conditions: [
			{
				propertyId,
				value: '',
				propertyValueRelation,
			},
		] } ) ).toEqual( `SELECT ?item WHERE { ?item (p:${propertyId}/ps:${propertyId}) _:anyValue. }` );
	} );

	it( 'builds a query from multiple conditions', () => {
		const expectedQuery =
			`SELECT ?item WHERE {
			?item (p:P666/ps:P666) "blah".
			?item (p:P66/ps:P66) _:anyValue.
			}`;
		const actualQuery = buildQuery( { conditions: [
			{
				propertyId: 'P666',
				value: 'blah',
				propertyValueRelation: PropertyValueRelation.Matching,
			},
			{
				propertyId: 'P66',
				value: '',
				propertyValueRelation: PropertyValueRelation.Regardless,
			},
		] } );

		expect( actualQuery.replace( /\s+/g, ' ' ) ).toEqual( expectedQuery.replace( /\s+/g, ' ' ) );
	} );
} );
