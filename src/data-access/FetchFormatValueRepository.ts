import FormatValueRepository from '@/data-access/FormatValueRepository';
import ParseResult from '@/data-access/ParseResult';
import TechnicalProblem from '@/data-access/errors/TechnicalProblem';

export default class FetchFormatValueRepository implements FormatValueRepository {
	private readonly forLanguageCode: string;
	private readonly endpoint: string;

	public constructor( languageCode: string, endpoint: string ) {
		this.forLanguageCode = languageCode;
		this.endpoint = endpoint;
	}

	public async formatValue( dataValue: ParseResult, propertyId: string ):
	Promise<string> {
		const params: { [key: string]: string } = {
			action: 'wbformatvalue',
			generate: 'text/plain',
			datavalue: JSON.stringify( dataValue ),
			property: propertyId,
			uselang: this.forLanguageCode,
			options: JSON.stringify( { lang: this.forLanguageCode } ),
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

		if ( data.error ) {
			throw new TechnicalProblem( `${data.error.code}: ${data.error.info}` );
		}

		return data.result;
	}
}
