import Footer from '@/components/Footer.vue';
import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';

Vue.use( i18n, {
	locale: 'en',
	messages: {},
	wikilinks: true,
} );

describe( 'Footer component', () => {
	it( 'shows build time and link to commit', () => {
		process.env = Object.assign( process.env, {
			VUE_APP_BUILD_TIME: '1612189962937',
			VUE_APP_GIT_COMMIT: 'c6bc093',
		} );
		const wrapper = shallowMount( Footer );
		expect( wrapper.find( '.querybuilder-footer__build-info' ).text() ).toBe(
			'Last build at Mon, 01 Feb 2021 14:32:42 GMT from c6bc093.',
		);
	} );

	it( 'shows no build info if no built time is available', () => {
		process.env = Object.assign( process.env, {
			VUE_APP_BUILD_TIME: '',
			VUE_APP_GIT_COMMIT: 'c6bc093',
		} );
		const wrapper = shallowMount( Footer );
		expect( wrapper.find( '.querybuilder-footer__build-info' ).exists() ).toBe( false );
	} );

	it( 'shows no build info if commit is available', () => {
		process.env = Object.assign( process.env, {
			VUE_APP_BUILD_TIME: '1612189962937',
			VUE_APP_GIT_COMMIT: '',
		} );
		const wrapper = shallowMount( Footer );
		expect( wrapper.find( '.querybuilder-footer__build-info' ).exists() ).toBe( false );
	} );
} );
