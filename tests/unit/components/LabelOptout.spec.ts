import Vue from 'vue';
import LabelOptout from '@/components/LabelOptout.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
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
		const omitLabelsGetter = () => () => ( omitLabels );
		const store = new Vuex.Store( { getters: { omitLabelsGetter } } );

		const wrapper = shallowMount( LabelOptout, {
			store,
			localVue,
			propsData: {
				'condition-index': 0,
			},
		} );

		store.dispatch = jest.fn();

		await wrapper.find( '.querybuilder__label-optout-checkbox' ).setChecked();

		expect( store.dispatch ).toHaveBeenCalledWith( 'setOmitLabels', omitLabels );

	} );
} );
