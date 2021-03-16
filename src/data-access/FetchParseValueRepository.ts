import ParseValueRepository from '@/data-access/ParseValueRepository';
import ParseResult from '@/data-access/ParseResult';
import TechnicalProblem from '@/data-access/errors/TechnicalProblem';
import PrecisionError from '@/data-access/errors/PrecisionError';

export default class FetchParseValueRepository implements ParseValueRepository {
	private readonly endpoint: string;

	public constructor( endpoint: string ) {
		this.endpoint = endpoint;
	}

	private async parseValue( values: string, datatype: string ):
	Promise<ParseResult> {
		if ( !values ) {
			throw new Error( 'The parameter values must not be empty!' );
		}

		if ( !datatype ) {
			throw new Error( 'The parameter datatype must not be empty!' );
		}

		const params: { [key: string]: string } = {
			action: 'wbparsevalue',
			values: values,
			datatype: datatype,
			validate: 'true',
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

		if ( data.value.precision < 9 ) {
			throw new PrecisionError();
		}

		const parsedResult: ParseResult = {
			value: data.value,
			type: data.type,
		};

		return parsedResult;
	}

	public parseValues( values: string, datatype: string ): Promise<ParseResult> {
		return this.parseValue( values, datatype );
	}
}
