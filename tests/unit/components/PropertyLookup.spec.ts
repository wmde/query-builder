import PropertyLookup from '@/components/PropertyLookup.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { Lookup } from '@wmde/wikit-vue-components';
import Vuex from 'vuex';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';

const localVue = createLocalVue();
const messages = {};
localVue.use( Vuex );

Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

describe( 'PropertyLookup.vue', () => {
	it( 'bubbles input events from the Lookup up', () => {
		const wrapper = shallowMount( PropertyLookup );
		const someEventContent = {};

		wrapper.findComponent( Lookup ).vm.$emit( 'input', someEventContent );

		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toBe( someEventContent );
	} );

	it( 'pass value prop down to Lookup', () => {
		const property = {
			label: 'some label',
			description: 'some description',
		};

		const wrapper = shallowMount( PropertyLookup, {
			propsData: {
				value: property,
			},
		} );

		expect( wrapper.findComponent( Lookup ).props( 'value' ) ).toBe( property );
	} );

	it( 'dispatches action to search for Properties on new search string', async () => {
		const store = new Vuex.Store( {} );
		const searchRsults = [ { label: 'abc', description: 'def', id: 'P123' } ];
		store.dispatch = jest.fn().mockResolvedValue( searchRsults );
		const wrapper = shallowMount( PropertyLookup, { store, localVue } );

		const searchString = 'postal';
		wrapper.findComponent( Lookup ).vm.$emit( 'update:search-input', searchString );
		await localVue.nextTick();

		expect( store.dispatch ).toHaveBeenCalledWith( 'searchProperties', searchString );
		expect( wrapper.findComponent( Lookup ).props( 'searchInput' ) ).toBe( searchString );

		// it really needs two ticks ¯\_(ツ)_/¯
		await localVue.nextTick();
		await localVue.nextTick();
		expect( wrapper.findComponent( Lookup ).props( 'menuItems' ) ).toStrictEqual( searchRsults );
	} );

	it( 'passes error prop down to Lookup', () => {
		const error = {
			type: 'error',
			message: 'some description',
		};

		const wrapper = shallowMount( PropertyLookup, {
			propsData: {
				error,
			},
		} );

		expect( wrapper.findComponent( Lookup ).props( 'error' ) ).toStrictEqual( error );
	} );
} );
