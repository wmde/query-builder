import SearchEntityRepository from '@/data-access/SearchEntityRepository';
import SearchResult from '@/data-access/SearchResult';
import TechnicalProblem from '@/data-access/errors/TechnicalProblem';

export default class FetchSearchEntityRepository implements SearchEntityRepository {
	private readonly forLanguageCode: string;
	private readonly endpoint: string;

	public constructor( languageCode: string, endpoint: string ) {
		this.forLanguageCode = languageCode;
		this.endpoint = endpoint;
	}

	public async searchProperties( searchString: string, limit?: number, offset?: number ):
	Promise<SearchResult[]> {
		const params: { [key: string]: string } = {
			action: 'wbsearchentities',
			search: searchString,
			language: this.forLanguageCode,
			type: 'property',
			format: 'json',
			formatversion: '2',
			errorformat: 'plaintext',
			origin: '*',
		};
		if ( limit ) {
			params.limit = `${limit}`;
		}
		if ( offset ) {
			params.offset = `${offset}`;
		}

		const url = new URL( this.endpoint );
		for ( const key in params ) {
			url.searchParams.set( key, params[ key ] );
		}
		let response: Response;
		try {
			response = await fetch( url.toString() );
		} catch ( e ) {
			throw new TechnicalProblem( 'Network error' );
		}

		if ( !response.ok ) {
			throw new TechnicalProblem( `${response.status}: ${response.statusText}` );
		}

		const data = await response.json();

		// Inject data types
		if ( data.search ) {
			const datatypeMapping = await this.getDataTypes( data.search );
			for ( let i = 0; i < data.search.length; i++ ) {
				const searchResult = data.search[ i ];
				if ( searchResult.id in datatypeMapping ) {
					searchResult.datatype = datatypeMapping[ searchResult.id ].datatype;
				}
			}
		}

		return data.search;
	}

	private async getDataTypes( searchResults: SearchResult[] ): Promise<{ [key: string]: {datatype: string} }> {
		const params: { [key: string]: string } = {
			action: 'wbgetentities',
			props: 'datatype',
			ids: searchResults.map( ( s: SearchResult, _: number ) => ( s.id ) ).join( '|' ),
			format: 'json',
			formatversion: '2',
			errorformat: 'plaintext',
			origin: '*',
		};

		const url = new URL( this.endpoint );
		for ( const key in params ) {
			url.searchParams.set( key, params[ key ] );
		}
		let response: Response;
		try {
			response = await fetch( url.toString() );
		} catch ( e ) {
			throw new TechnicalProblem( 'Network error' );
		}

		if ( !response.ok ) {
			throw new TechnicalProblem( `${response.status}: ${response.statusText}` );
		}

		const data = await response.json();

		return data.entities || {};
	}
}
