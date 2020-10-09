import allNamespaces from '@/sparql/RdfNamespaces';

export default class QueryObjectBuilder {
	// TODO: Change the type once #27 is merged
	private queryObject: any;

	public constructor() {
		this.queryObject = {
			queryType: 'SELECT',
			variables: [],
			where: [],
			type: 'query',
			prefixes: allNamespaces
		};
	}

	public buildFromQueryRepresentation( queryRepresentation: any ) {
		this.queryObject.variables.push(
			{
				termType: 'Variable',
				value: 'item'
			}
		);
		this.queryObject.where.push(
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
							value: 'http://www.wikidata.org/prop/direct/' + queryRepresentation.property
						},
						object: {
							termType: 'Literal',
							value: queryRepresentation.value
						}
					}
				]
			}
		);

		return this.queryObject;
	}
}
