import allNamespaces from '@/sparql/rdfNamespaces';
import QueryObjectBuilder from '@/sparql/QueryObjectBuilder';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

describe( 'QueryObjectBuilder', () => {
	it( 'simple', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
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
									value: 'http://www.wikidata.org/prop/P281',
								},
								{
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/statement/P281',
								},
								] },
							object: {
								termType: 'Literal',
								value: 'XXXX',
							},
						},
					],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			condition: {
				propertyId: 'P281',
				value: 'XXXX',
				propertyValueRelation: PropertyValueRelation.Matching,
			},
		} );

		expect( actual ).toStrictEqual( expected );
	} );
} );
