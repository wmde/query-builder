import QuantityValueInput from '@/components/QuantityValueInput.vue';
import { QuantityInput } from '@wmde/wikit-vue-components';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';
import SearchOptions from '@/data-access/SearchOptions';

jest.mock( 'lodash/debounce', () => jest.fn( ( fn ) => fn ) );

const localVue = createLocalVue();
const messages = {};
localVue.use( Vuex );

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

describe( 'QuantityValueInput.vue', () => {
	it( 'bubbles input events from the QuantityInput up', () => {
		const wrapper = shallowMount( QuantityValueInput, {
			propsData: {
				value: 10,
			} } );
		const someEventContent = {};

		wrapper.findComponent( QuantityInput ).vm.$emit( 'input', someEventContent );

		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toBe( someEventContent );
	} );

	it( 'pass value prop down to QuantityInput', () => {
		const numberValue = 10;

		const wrapper = shallowMount( QuantityValueInput, {
			propsData: {
				value: numberValue,
			},
		} );

		expect( wrapper.findComponent( QuantityInput ).props( 'numberInputValue' ) ).toBe( numberValue.toString() );
	} );

	it( 'passes error prop down to QuantityInput', () => {
		const error = {
			type: 'error',
			message: 'some description',
		};

		const wrapper = shallowMount( QuantityValueInput, {
			propsData: {
				error,
				value: 10,
			},
		} );

		expect( wrapper.findComponent( QuantityInput ).props( 'error' ) ).toStrictEqual( error );
	} );

	it( 'unit input: unitLookupSearchInput prop for unit item changes on update search string', async () => {
		const wrapper = shallowMount( QuantityValueInput, {
			localVue,
			propsData: {
				...defaultProps,
				value: 10,
			},
		} );

		const searchOptions: SearchOptions = { search: 'meters', limit: 12 };

		await wrapper.findComponent( QuantityInput ).vm.$emit( 'update:unitLookupSearchInput', searchOptions.search );

		expect( wrapper.findComponent( QuantityInput ).props( 'unitLookupSearchInput' ) ).toBe( searchOptions.search );

	} );

	it( 'unit input: clears the search results on the search string being emptied', async () => {
		const wrapper = shallowMount( QuantityValueInput, {
			localVue,
			propsData: {
				...defaultProps,
				value: 10,
			},
			data() {
				return {
					searchResults: [
						{ label: 'abc', description: 'def', id: 'P123' },
						{ label: 'ghi', description: 'def', id: 'P1234' },
						{ label: 'jkl', description: 'def', id: 'P12345' },
					],
					search: 'def',
				};
			},
		} );

		await wrapper.findComponent( QuantityInput ).vm.$emit( 'update:unitLookupSearchInput', '' );
		expect( wrapper.findComponent( QuantityInput ).props( 'unitLookupSearchInput' ) ).toBe( '' );
		expect( wrapper.findComponent( QuantityInput ).props( 'unitLookupMenuItems' ) ).toStrictEqual( [] );
	} );

} );
