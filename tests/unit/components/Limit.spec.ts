import Vue from 'vue';
import Limit from '@/components/Limit.vue';
import { Checkbox, TextInput } from '@wmde/wikit-vue-components';
import Vuex from 'vuex';
import { shallowMount, createLocalVue, mount } from '@vue/test-utils';
import i18n from 'vue-banana-i18n';
import { newStore } from '../../util/store';

const messages = {};
Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'Limit.vue', () => {
	it( 'updates the store when user checks useLimit checkbox', async () => {
		const useLimit = true;
		const useLimitGetter = (): boolean => false;
		const store = newStore( { useLimit: useLimitGetter, limit: () => 100 } );

		const wrapper = mount( Limit, {
			store,
			localVue,
		} );

		store.dispatch = jest.fn();

		wrapper.findComponent( Checkbox ).vm.$emit( 'update:checked', useLimit );

		expect( store.dispatch ).toHaveBeenCalledWith( 'setUseLimit', useLimit );

	} );

	it( 'updates the store when user changed value in limit field', async () => {
		const limit = 20;
		const limitGetter = (): number => 10;
		const store = newStore( { useLimit: () => true, limit: limitGetter } );

		const wrapper = shallowMount( Limit, {
			store,
			localVue,
		} );

		store.dispatch = jest.fn();

		wrapper.findComponent( TextInput ).vm.$emit( 'input', limit.toString() );
		// TODO: update when we have a number component

		expect( store.dispatch ).toHaveBeenCalledWith( 'setLimit', limit );

	} );
} );
