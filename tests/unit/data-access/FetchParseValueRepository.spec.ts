import FetchParseValueRepository from '@/data-access/FetchParseValueRepository';
import TechnicalProblem from '@/data-access/errors/TechnicalProblem';

describe( 'FetchParseValueRepository', () => {

	it( 'parses values with time datatype', async () => {
		const testEndpoint = 'https://example.com/w/api.php';
		const repo = new FetchParseValueRepository(
			testEndpoint,
		);
		const value = '1994-02-08';
		const datatype = 'time';
		const expectedResult = {
			value: {
				time: '+1994-02-08T00:00:00Z',
				timezone: 0,
				before: 0,
				after: 0,
				precision: 11,
				calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
			},
			type: 'time',
		};

		window.fetch = jest.fn().mockImplementation( () => Promise.resolve( {
			ok: true,
			json: async () => ( expectedResult ),
		} ) );

		const actualResult = await repo.parseValues( value, datatype );

		const expectedParams = {
			action: 'wbparsevalue',
			values: value,
			datatype: datatype,
			validate: 'true',
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

	it( 'throws an error if there is a server side problem fetching a property', () => {
		const repo = new FetchParseValueRepository(
			'https://example.com/w/api.php',
		);
		window.fetch = jest.fn().mockImplementation( () => Promise.resolve( {
			ok: false,
			status: 500,
			statusText: 'Server Error',
		} ) );

		const expectedError = new TechnicalProblem( '500: Server Error' );

		expect( repo.parseValues( 'foo', 'time' ) ).rejects.toThrow( expectedError );
	} );

} );
