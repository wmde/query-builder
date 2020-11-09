import { TextInput } from '@wmde/wikit-vue-components';
import Vuex, { Store } from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';
import PropertyLookup from '@/components/PropertyLookup.vue';

function newStore( getters = {} ): Store<any> {
	return new Vuex.Store( {
		getters: {
			property: jest.fn().mockReturnValue( {
				label: 'potato',
			} ),
			...getters,
		},
	} );
}

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'QueryBuilder.vue', () => {

	it( 'has a heading', () => {
		const wrapper = shallowMount( QueryBuilder, { store: newStore(), localVue } );
		expect( wrapper.find( 'h1' ).text() ).toBe( 'Simple Query Builder' );
	} );

	it( 'passes the selected property back to the PropertyLookup', async () => {
		const property = { label: 'postal code', id: 'P123' };
		const wrapper = shallowMount( QueryBuilder, {
			store: newStore( {
				property: jest.fn().mockReturnValue( property ),
			} ),
			localVue,
		} );

		expect( wrapper.findComponent( PropertyLookup ).props( 'value' ) ).toBe( property );
	} );

	it( 'updates the store property when the user changes it in the lookup', async () => {
		const property = { label: 'postal code', id: 'P123' };
		const store = newStore();
		store.dispatch = jest.fn();
		const wrapper = shallowMount( QueryBuilder, {
			store,
			localVue,
		} );

		wrapper.findComponent( PropertyLookup ).vm.$emit( 'input', property );

		expect( store.dispatch ).toHaveBeenCalledWith( 'updateProperty', property );
	} );

	it( 'updates the store value when the user fills in the value textfield', () => {
		const store = newStore();
		store.dispatch = jest.fn();
		const wrapper = shallowMount( QueryBuilder, {
			store,
			localVue,
		} );
		const userInput = 'potato';

		const input = wrapper.findComponent( { ref: 'value' } );
		input.vm.$emit( 'input', userInput );

		expect( store.dispatch ).toHaveBeenCalledWith( 'updateValue', userInput );
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
