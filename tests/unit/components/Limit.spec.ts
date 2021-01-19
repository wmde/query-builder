import Vue from 'vue';
import Limit from '@/components/Limit.vue';
import { TextInput } from '@wmde/wikit-vue-components';
import Vuex, { Store } from 'vuex';
import createActions from '@/store/actions';
import services from '@/ServicesFactory';
import { shallowMount, createLocalVue, mount } from '@vue/test-utils';
import i18n from 'vue-banana-i18n';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

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

describe( 'Limit.vue', () => {
	it( 'updates the store when user checks useLimit checkbox', async () => {
		const useLimit = true;
		const useLimitGetter = () => () => ( useLimit );
		const store = newStore( useLimitGetter );

		const wrapper = mount( Limit, {
			store,
			localVue,
		} );

		store.dispatch = jest.fn();

		await wrapper.find( 'input[type="checkbox"]' ).setChecked();

		expect( store.dispatch ).toHaveBeenCalledWith( 'setUseLimit', useLimit );

	} );

	it( 'updates the store when user changed value in limit field', async () => {
		const limit = 20;
		const limitGetter = () => () => ( limit );
		const store = newStore( limitGetter );

		const wrapper = shallowMount( Limit, {
			store,
			localVue,
		} );

		store.dispatch = jest.fn();

		await wrapper.findComponent( TextInput ).vm.$emit( 'input', limit.toString() );
		// TODO: update when we have a number component

		expect( store.dispatch ).toHaveBeenCalledWith( 'setLimit', limit );

	} );
} );
