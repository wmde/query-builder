import Vuex, { Store } from 'vuex';
import { shallowMount, createLocalVue, mount } from '@vue/test-utils';
import QueryResult from '@/components/QueryResult.vue';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';

function newStore( state = {} ): Store<any> {
	return new Vuex.Store( {
		state: {
			property: 'potato',
			errors: [],
			...state,
		},
	} );
}

const localVue = createLocalVue();
const messages = {
	en: {
		'query-builder-result-placeholder': 'Result placeholder',
	},
};

Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );
localVue.use( Vuex );

describe( 'QueryResult.vue', () => {
	it( 'Show an empty page without input', () => {
		const wrapper = shallowMount( QueryResult, {
			store: newStore(),
			localVue,
			propsData: {
				encodedQuery: '',
				iframeRenderKey: 0,
				errors: [],
			},
		} );
		expect( wrapper.find( 'div' ).text() ).toBe( 'Result placeholder' );
		expect( wrapper.findAll( 'iframe' ) ).toHaveLength( 0 );
	} );

	it( 'Show errors', () => {
		const store = newStore(
			{
				errors: [
					{
						message: 'Something happened',
						type: 'notice',
					},
				],
			},
		);
		const wrapper = mount( QueryResult, {
			store: store,
			localVue,
			propsData: {
				encodedQuery: '',
				iframeRenderKey: 0,
			},
		} );
		expect( wrapper.find( 'div div' ).text() ).toBe( 'Something happened' );
		expect( wrapper.findAll( 'iframe' ) ).toHaveLength( 0 );
	} );
} );
