import EntityLookup from '@/components/EntityLookup.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { Lookup } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';
import SearchOptions from '@/data-access/SearchOptions';

const localVue = createLocalVue();
const messages = { en: {
	'some-error-message-key': 'some-error-copy',
} };

Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

const defaultProps = {
	label: 'some label copy',
	noMatchFoundMessage: 'some error copy',
	searchForMenuItems: jest.fn(),
};

describe( 'EntityLookup.vue', () => {
	it( 'bubbles input events from the Lookup up', () => {
		const wrapper = shallowMount( EntityLookup, {
			propsData: defaultProps,
		} );
		const someEventContent = {};

		wrapper.findComponent( Lookup ).vm.$emit( 'input', someEventContent );

		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toBe( someEventContent );
	} );

	it( 'pass value prop down to Lookup', () => {
		const property = {
			label: 'some label',
			description: 'some description',
		};

		const searchForMenuItems = jest.fn().mockResolvedValue( [] );
		const wrapper = shallowMount( EntityLookup, {
			propsData: {
				...defaultProps,
				value: property,
				searchForMenuItems,
			},
		} );

		expect( wrapper.findComponent( Lookup ).props( 'value' ) ).toBe( property );
	} );

	it( 'uses prop method to search for Entities on new search string', async () => {
		const searchResults = [ { label: 'abc', description: 'def', id: 'P123' } ];
		const searchForMenuItems = jest.fn().mockResolvedValue( searchResults );
		const wrapper = shallowMount( EntityLookup, {
			localVue,
			propsData: {
				...defaultProps,
				searchForMenuItems,
			},
		} );

		const searchOptions: SearchOptions = { search: 'postal', limit: 12 };

		wrapper.findComponent( Lookup ).vm.$emit( 'update:search-input', searchOptions.search );
		await localVue.nextTick();

		expect( searchForMenuItems ).toHaveBeenCalledWith( searchOptions );
		expect( wrapper.findComponent( Lookup ).props( 'searchInput' ) ).toBe( searchOptions.search );

		// it really needs two ticks ¯\_(ツ)_/¯
		await localVue.nextTick();
		await localVue.nextTick();
		expect( wrapper.findComponent( Lookup ).props( 'menuItems' ) ).toStrictEqual( searchResults );
	} );

	it( 'passes error prop down to Lookup', () => {
		const error = {
			type: 'error',
			message: 'some-error-message-key',
		};

		const wrapper = shallowMount( EntityLookup, {
			propsData: {
				...defaultProps,
				error,
			},
		} );

		expect( wrapper.findComponent( Lookup ).props( 'error' ) ).toStrictEqual( {
			type: 'error',
			message: 'some-error-copy',
		} );
	} );
} );
