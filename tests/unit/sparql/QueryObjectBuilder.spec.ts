import allNamespaces from '@/sparql/RdfNamespaces';
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
			property: 'P281',
			value: 'XXXX'
		} );

		expect( actual ).toStrictEqual( expected );
	} );
} );
