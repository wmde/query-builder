import * as fs from 'fs';

describe( 'banana tests', () => {
	it( 'messages keys start with query-builder', () => {
		const data = fs.readFileSync( 'public/i18n/en.json', 'utf8' );
		const messages: { [key: string]: { [key: string]: string} } = {
			en: JSON.parse( data ),
		};
		let messageKey = '';

		for ( messageKey in messages.en ) {
			expect( messageKey.startsWith( 'query-builder-' ) ).toBeTruthy();
		}
	} );

	it( 'messages keys of en.json and qqq.json should be the same', () => {
		const dataEn = fs.readFileSync( 'public/i18n/en.json', 'utf8' );
		const dataQqq = fs.readFileSync( 'public/i18n/qqq.json', 'utf8' );
		const messages: { [key: string]: { [key: string]: string} } = {
			en: JSON.parse( dataEn ),
			qqq: JSON.parse( dataQqq ),
		};
		let messageKey = '';

		for ( messageKey in messages.en ) {
			expect( messages.qqq[ messageKey ] ).toBeTruthy();
		}

		for ( messageKey in messages.qqq ) {
			if ( messageKey === '@metadata' ) {
				continue;
			}
			expect( messages.en[ messageKey ] ).toBeTruthy();
		}
	} );
} );
