import FetchSearchEntityRepository from '@/data-access/FetchSearchEntityRepository';
import TechnicalProblem from '@/data-access/errors/TechnicalProblem';

describe( 'FetchSearchEntityRepository', () => {

	it( 'searches for properties with default values', async () => {
		const testLang = 'eo';
		const testEndpoint = 'https://example.com/w/api.php';
		const repo = new FetchSearchEntityRepository(
			testLang,
			testEndpoint,
		);
		const testSearchTerm = '"><script>alert(\'XXS!\');</script>';
		const expectedResult = [ { foo: 'bar' } ];

		window.fetch = jest.fn().mockImplementation( () => Promise.resolve( {
			ok: true,
			json: async () => ( { search: expectedResult } ),
		} ) );

		const actualResult = await repo.searchProperties( testSearchTerm );

		const escapedSearch = '%22%3E%3Cscript%3Ealert%28%27XXS%21%27%29%3B%3C%2Fscript%3E';
		const expectedParams = {
			action: 'wbsearchentities',
			search: escapedSearch,
			language: testLang,
			type: 'property',
			format: 'json',
			formatversion: 2,
			errorformat: 'plaintext',
			origin: '*',
		};
		const expectedQuery = Object.entries( expectedParams ).map( ( entry ) => entry.join( '=' ) ).join( '&' );
		const expectedUrl = `${testEndpoint}?${expectedQuery}`;
		expect( window.fetch ).toHaveBeenCalledTimes( 2 );
		expect( window.fetch ).toHaveBeenCalledWith( expectedUrl );
		expect( actualResult ).toBe( expectedResult );
	} );

	it( 'searches for properties with provided limit and offset', async () => {
		const testLang = 'eo';
		const testEndpoint = 'https://example.com/w/api.php';
		const repo = new FetchSearchEntityRepository(
			testLang,
			testEndpoint,
		);
		const testSearch = 'instance';
		window.fetch = jest.fn().mockImplementation( ( url ) => {
			if ( url.search( 'wbsearchentities' ) ) {
				return Promise.resolve( {
					ok: true,
					json: async () => ( { search:
							[ { id: 'P1', label: 'P1 label', description: 'P1 description' } ],
					} ),
				} );
			} else {
				return Promise.resolve( {
					ok: true,
					json: async () => ( { entities: { P1: { datatype: 'string' } } } ),
				} );
			}
		} );
		const limit = 12;
		const offset = 24;

		await repo.searchProperties( testSearch, limit, offset );

		const expectedParams = {
			action: 'wbsearchentities',
			search: testSearch,
			language: testLang,
			type: 'property',
			format: 'json',
			formatversion: 2,
			errorformat: 'plaintext',
			origin: '*',
			limit,
			offset,
		};
		const expectedQuery = Object.entries( expectedParams ).map( ( entry ) => entry.join( '=' ) ).join( '&' );
		const expectedUrl = `${testEndpoint}?${expectedQuery}`;
		expect( window.fetch ).toHaveBeenCalledTimes( 2 );
		expect( window.fetch ).toHaveBeenCalledWith( expectedUrl );
	} );

	it( 'throws an error if there is a server side problem', () => {
		const repo = new FetchSearchEntityRepository(
			'eo',
			'https://example.com/w/api.php',
		);
		window.fetch = jest.fn().mockImplementation( () => Promise.resolve( {
			ok: false,
			status: 500,
			statusText: 'Server Error',
		} ) );

		const expectedError = new TechnicalProblem( '500: Server Error' );

		expect( repo.searchProperties( 'instance' ) ).rejects.toThrow( expectedError );
	} );

	it( 'throws an error if there is a network problem', () => {
		const repo = new FetchSearchEntityRepository(
			'eo',
			'https://example.com/w/api.php',
		);
		window.fetch = jest.fn().mockImplementation( () => Promise.reject() );

		const expectedError = new TechnicalProblem( 'Network error' );

		expect( repo.searchProperties( 'instance' ) ).rejects.toThrow( expectedError );
	} );

} );
