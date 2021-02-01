import allNamespaces from '@/sparql/rdfNamespaces';
import QueryObjectBuilder from '@/sparql/QueryObjectBuilder';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';

describe( 'QueryObjectBuilder', () => {
	it( 'simple', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
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
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					negate: false,
				},
			],
			omitLabels: true,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with limit', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
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
			limit: 20,
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					datatype: 'string',
					subclasses: false,
					negate: false,
				},
			],
			omitLabels: true,
			limit: 20,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with labels (omitLabels = false)', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const internalExpectedQuery = {
			queryType: 'SELECT',
			distinct: true,
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
		};

		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
				{
					termType: 'Variable',
					value: 'itemLabel',
				},
			],
			where: [
				{
					type: 'service',
					patterns: [
						{
							type: 'bgp',
							triples: [ {
								subject: {
									termType: 'NamedNode',
									value: 'http://www.bigdata.com/rdf#serviceParam',
								},
								predicate: {
									termType: 'NamedNode',
									value: 'http://wikiba.se/ontology#language',
								},
								object: {
									termType: 'Literal',
									value: '[AUTO_LANGUAGE]',
								},
							} ],
						},
					],
					name: {
						termType: 'NamedNode',
						value: 'http://wikiba.se/ontology#label',
					},
					silent: false,
				},
				{
					type: 'group',
					patterns: [
						internalExpectedQuery,
					],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					negate: false,
				},
			],
			omitLabels: false,
		} );

		expect( actual ).toMatchObject( expected );
	} );

	it( 'with subclasses', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
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
								{
									type: 'path',
									pathType: '*',
									items: [ {
										termType: 'NamedNode',
										value: 'http://www.wikidata.org/prop/direct/P279',
									},
									],
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
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: true,
					negate: false,
				},
			],
			omitLabels: true,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with negate', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					triples: [
						{
							object: {
								termType: 'BlankNode',
								value: 'anyValue',
							},
							predicate: {
								termType: 'NamedNode',
								value: 'http://wikiba.se/ontology#sitelinks',
							},
							subject: {
								termType: 'Variable',
								value: 'item',
							},
						},
					],
					type: 'bgp',
				},
				{
					type: 'minus',
					patterns: [
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
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					negate: true,
				},
			],
			omitLabels: true,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with negate but labels enabled', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const internalExpectedQuery = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					triples: [
						{
							object: {
								termType: 'BlankNode',
								value: 'anyValue',
							},
							predicate: {
								termType: 'NamedNode',
								value: 'http://wikiba.se/ontology#sitelinks',
							},
							subject: {
								termType: 'Variable',
								value: 'item',
							},
						},
					],
					type: 'bgp',
				},
				{
					type: 'minus',
					patterns: [
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
				},
			],
			type: 'query',
			prefixes: {},
		};
		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
				{
					termType: 'Variable',
					value: 'itemLabel',
				},
			],
			where: [
				{
					type: 'service',
					patterns: [
						{
							type: 'bgp',
							triples: [ {
								subject: {
									termType: 'NamedNode',
									value: 'http://www.bigdata.com/rdf#serviceParam',
								},
								predicate: {
									termType: 'NamedNode',
									value: 'http://wikiba.se/ontology#language',
								},
								object: {
									termType: 'Literal',
									value: '[AUTO_LANGUAGE]',
								},
							} ],
						},
					],
					name: {
						termType: 'NamedNode',
						value: 'http://wikiba.se/ontology#label',
					},
					silent: false,
				},
				{
					type: 'group',
					patterns: [ internalExpectedQuery ],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					negate: true,
				},
			],
			omitLabels: false,
		} );

		expect( actual ).toStrictEqual( expected );
	} );
} );
