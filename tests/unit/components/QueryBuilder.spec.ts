import AddCondition from '@/components/AddCondition.vue';
import Vuex, { Store } from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';
import createActions from '@/store/actions';
import services from '@/ServicesFactory';
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
		getters,
		actions: createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		),
	} );
}

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'QueryBuilder.vue', () => {

	it( 'has a heading', () => {
		const wrapper = shallowMount( QueryBuilder, { store: newStore(), localVue } );
		expect( wrapper.find( 'h1' ).text() ).toBe( 'Very fancy query builder title' );
	} );

	it( 'adds a new condition when clicking the Add condition button', () => {
		const wrapper = shallowMount( QueryBuilder, { store: newStore(), localVue } );
		wrapper.findComponent( AddCondition ).trigger( 'add-condition' );
	} );
} );
