import Vue from 'vue';
import SubclassCheckbox from '@/components/SubclassCheckbox.vue';
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

describe( 'SubclassCheckbox.vue', () => {
	it( 'updates the store when user checks include subclasses checkbox', async () => {
		const subclasses = true;
		const subclassesGetter = () => () => ( subclasses );
		const store = new Vuex.Store( { getters: { subclassesGetter } } );

		const wrapper = shallowMount( SubclassCheckbox, {
			store,
			localVue,
			propsData: {
				'condition-index': 0,
			},
		} );

		store.dispatch = jest.fn();

		await wrapper.find( '.querybuilder__include-subclasses-checkbox' ).setChecked();

		await Vue.nextTick();

		expect( wrapper.emitted( 'subclass-check' ) ).toBeTruthy();

	} );
} );
