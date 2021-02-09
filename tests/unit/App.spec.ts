import App from '@/App.vue';
import LanguageService from '@/data-access/LanguageService';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

jest.mock( '@/ServicesFactory', () => {
	return {
		get: jest.fn().mockImplementation( ( name ): LanguageService | undefined => {
			if ( name === 'languageService' ) {
				return {
					getAppLanguageCode: jest.fn(),
					getMessagesForLangCode: jest.fn().mockReturnValue( {} ),
				};
			}
		} ),
	};
} );

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'App.vue', () => {
	const location = global.window.location;

	afterEach( () => {
		Object.defineProperty( global.window, 'location', {
			value: location,
			writable: true,
		} );
	} );

	it( 'reconstructs QB state if URL has a query parameter', async () => {
		const store = new Vuex.Store( {} );
		store.dispatch = jest.fn();

		const unencodedQuery = JSON.stringify( {
			foo: 'bar',
		} );

		Object.defineProperty( global.window, 'location', {
			value: {
				search: `?query=${encodeURIComponent( unencodedQuery )}`,
			},
			writable: true,
		} );

		shallowMount( App, { store, localVue } );
		expect( store.dispatch ).toHaveBeenCalledWith( 'parseState', unencodedQuery );
	} );

	it( 'doesn\'t try to reconstruct state if there is no query parameter', () => {
		const store = new Vuex.Store( {} );
		store.dispatch = jest.fn();

		shallowMount( App, { store, localVue } );

		expect( store.dispatch ).not.toHaveBeenCalled();
	} );
} );
