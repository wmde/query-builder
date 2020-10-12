import allNamespaces from '@/sparql/rdfNamespaces';
import QueryObjectBuilder from '@/sparql/QueryObjectBuilder';

describe( 'QueryObjectBuilder', () => {
	it( 'einfach', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			variables: [
				{
					termType: 'Variable',
					value: 'item'
				}
			],
			where: [
				{
					type: 'bgp',
					triples: [
						{
							subject: {
								termType: 'Variable',
								value: 'item'
							},
							predicate: {
								termType: 'NamedNode',
								value: 'http://www.wikidata.org/prop/direct/P281'
							},
							object: {
								termType: 'Literal',
								value: 'XXXX'
							}
						}
					]
				}
			],
			type: 'query',
			prefixes: prefixes
		};

		const actual = builder.buildFromQueryRepresentation( {
			property: {
				id: 'P281',
				label: 'Postal Code'
			},
			value: 'XXXX'
		} );

		expect( actual ).toStrictEqual( expected );
	} );
} );
