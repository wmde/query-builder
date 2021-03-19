import FetchFormatValueRepository from '@/data-access/FetchFormatValueRepository';
import TechnicalProblem from '@/data-access/errors/TechnicalProblem';
import ParseResult from '@/data-access/ParseResult';

const testLang = 'en';
const testEndpoint = 'https://example.com/w/api.php';
const propertyId = 'P577';
const valueData: ParseResult = {
	value: {
		time: '+1920-02-00T00:00:00Z',
		timezone: 0,
		before: 0,
		after: 0,
		precision: 10,
		calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
	},
	type: 'time',
};

describe( 'FetchFormatValueRepository', () => {

	it( 'format date from valueData returned from ParseValueRepository', async () => {
		const repo = new FetchFormatValueRepository(
			testLang,
			testEndpoint,
		);
		const expectedResult = 'foo';

		window.fetch = jest.fn().mockImplementation( () => Promise.resolve( {
			ok: true,
			json: async () => ( { result: expectedResult } ),
		} ) );

		const actualResult = await repo.formatValue( valueData, propertyId );

		const expectedParams = {
			action: 'wbformatvalue',
			generate: encodeURIComponent( 'text/plain' ),
			datavalue: encodeURIComponent( JSON.stringify( valueData ) ),
			property: propertyId,
			uselang: testLang,
			options: encodeURIComponent( JSON.stringify( { lang: testLang } ) ),
			format: 'json',
			formatversion: '2',
			errorformat: 'plaintext',
			origin: '*',
		};

		const expectedQuery = Object.entries( expectedParams ).map( ( entry ) => entry.join( '=' ) ).join( '&' );
		const expectedUrl = `${testEndpoint}?${expectedQuery}`;

		expect( window.fetch ).toHaveBeenCalledTimes( 1 );
		expect( window.fetch ).toHaveBeenCalledWith( expectedUrl );
		expect( actualResult ).toStrictEqual( expectedResult );
	} );

	it( 'throws an error if there is a server side problem parsing a value', () => {
		const repo = new FetchFormatValueRepository(
			testLang,
			testEndpoint,
		);
		window.fetch = jest.fn().mockImplementation( () => Promise.resolve( {
			ok: false,
			status: 500,
			statusText: 'Server Error',
		} ) );

		const expectedError = new TechnicalProblem( '500: Server Error' );

		expect( repo.formatValue( valueData, propertyId ) ).rejects.toThrow( expectedError );
	} );

} );
