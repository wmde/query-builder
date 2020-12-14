import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { TextInput } from '@wmde/wikit-vue-components';
import Vuex, { Store } from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import PropertyLookup from '@/components/PropertyLookup.vue';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';
import createActions from '@/store/actions';
import services from '@/ServicesFactory';
import QueryCondition from '@/components/QueryCondition.vue';
const messages = {};

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
			valueError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( null ) ),
			propertyError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( null ) ),
			limitedSupport: jest.fn().mockReturnValue( jest.fn().mockReturnValue( false ) ),
			propertyValueRelation: jest.fn().mockReturnValue(
				jest.fn().mockReturnValue( PropertyValueRelation.Matching ),
			),
			...getters,
		},
		actions: createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		),
	} );
}

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'QueryCondition.vue', () => {

	it( 'passes the selected property back to the PropertyLookup', async () => {
		const property = { label: 'postal code', id: 'P123' };
		const conditionIndex = 0;
		const propertyGetter = () => () => ( property );

		const wrapper = shallowMount( QueryCondition, { store: newStore( { property: propertyGetter } ), localVue } );

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
		const wrapper = shallowMount( QueryCondition, {
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
		const wrapper = shallowMount( QueryCondition, {
			store,
			localVue,
		} );
		const userInput = 'potato';

		const input = wrapper.findAllComponents( { ref: 'value' } ).at( conditionIndex );
		input.vm.$emit( 'input', userInput );

		expect( store.dispatch ).toHaveBeenCalledWith( 'updateValue', { value: userInput, conditionIndex } );
	} );

	it( 'shows field errors', () => {
		const wrapper = shallowMount( QueryCondition, {
			store: newStore( {
				propertyError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( {
					type: 'error',
					message: 'Property Error Message!',
				} ) ),
				valueError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( {
					type: 'warning',
					message: 'Value Warning Message!',
				} ) ),
			} ),
			localVue,
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
