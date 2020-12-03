import { TextInput } from '@wmde/wikit-vue-components';
import Vuex, { Store } from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';
import PropertyLookup from '@/components/PropertyLookup.vue';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';
const messages = {
	en: {
		'query-builder-heading': 'Very fancy query builder title',
	},
};

Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

function newStore( getters = {} ): Store<any> {
	return new Vuex.Store( {
		getters: {
			property: jest.fn().mockReturnValue( jest.fn() ),
			value: jest.fn().mockReturnValue( jest.fn() ),
			propertyValueRelation: jest.fn().mockReturnValue( jest.fn() ),
			...getters,
		},
	} );
}

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'QueryBuilder.vue', () => {

	it( 'has a heading', () => {
		const wrapper = shallowMount( QueryBuilder, { store: newStore(), localVue } );
		expect( wrapper.find( 'h1' ).text() ).toBe( 'Very fancy query builder title' );
	} );

	it( 'passes the selected property back to the PropertyLookup', async () => {
		const property = { label: 'postal code', id: 'P123' };
		const conditionIndex = 0;
		const propertyGetter = () => () => ( property );

		const wrapper = shallowMount( QueryBuilder, { store: newStore( { property: propertyGetter } ), localVue } );

		expect(
			wrapper.findAllComponents( PropertyLookup )
				.at( conditionIndex )
				.props( 'value' ),
		).toStrictEqual( property );
	} );

	it( 'updates the store property when the user changes it in the lookup', async () => {
		const property = { label: 'postal code', id: 'P123' };
		const propertyGetter = () => () => ( property );
		const store = newStore( propertyGetter );
		const conditionIndex = 0;
		store.dispatch = jest.fn();
		const wrapper = shallowMount( QueryBuilder, {
			store,
			localVue,
		} );

		wrapper.findAllComponents( PropertyLookup ).at( conditionIndex ).vm.$emit( 'input', property );

		expect( store.dispatch ).toHaveBeenCalledWith( 'updateProperty', { property, conditionIndex } );
	} );

	it( 'updates the store value when the user fills in the value textfield', () => {
		const store = newStore();
		const conditionIndex = 0;
		store.dispatch = jest.fn();
		const wrapper = shallowMount( QueryBuilder, {
			store,
			localVue,
		} );
		const userInput = 'potato';

		const input = wrapper.findAllComponents( { ref: 'value' } ).at( conditionIndex );
		input.vm.$emit( 'input', userInput );

		expect( store.dispatch ).toHaveBeenCalledWith( 'updateValue', { value: userInput, conditionIndex } );
	} );

	it( 'Get field errors', () => {
		const wrapper = shallowMount( QueryBuilder, {
			store: newStore(),
			localVue,
			data() {
				return {
					encodedQuery: '',
					iframeRenderKey: 0,
					fieldErrors: {
						property: {
							type: 'error',
							message: 'Property Error Message!',
						},
						value: {
							type: 'warning',
							message: 'Value Warning Message!',
						},
					},
				};
			},
		} );

		expect( wrapper.findComponent( PropertyLookup ).props( 'error' ) ).toStrictEqual( {
			type: 'error',
			message: 'Property Error Message!',
		} );
		expect( wrapper.findComponent( TextInput ).props( 'error' ) ).toStrictEqual( {
			type: 'warning',
			message: 'Value Warning Message!',
		} );

	} );
} );
