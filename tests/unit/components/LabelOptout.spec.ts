import { Checkbox } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import LabelOptout from '@/components/LabelOptout.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import i18n from 'vue-banana-i18n';
import Vuex from 'vuex';

const messages = {};
Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'LabelOptout.vue', () => {
	it( 'updates the store when user checks label optout checkbox', async () => {
		const omitLabels = true;
		const omitLabelsGetter = (): boolean => false;
		const store = new Vuex.Store( {
			getters: { omitLabels: omitLabelsGetter },
		} );

		const wrapper = shallowMount( LabelOptout, {
			store,
			localVue,
		} );
		store.dispatch = jest.fn();

		wrapper.findComponent( Checkbox ).vm.$emit( 'update:checked', omitLabels );

		expect( store.dispatch ).toHaveBeenCalledWith( 'setOmitLabels', omitLabels );

	} );
} );
