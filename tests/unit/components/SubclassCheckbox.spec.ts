import { Checkbox } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import SubclassCheckbox from '@/components/SubclassCheckbox.vue';
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
				isChecked: false,
			},
		} );

		store.dispatch = jest.fn();

		wrapper.findComponent( Checkbox ).vm.$emit( 'update:checked', true );

		expect( wrapper.emitted( 'subclass-check' ) ).toBeTruthy();
		expect( wrapper.emitted( 'subclass-check' ) ).toStrictEqual( [ [ true ] ] );
	} );
} );
