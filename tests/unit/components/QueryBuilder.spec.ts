import AddCondition from '@/components/AddCondition.vue';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { newStore } from '../../util/store';
const messages = {
	en: {
		'query-builder-heading': 'Very fancy query builder title',
		'query-builder-condition-placeholder': 'Placeholder text for testing',
	},
};

Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

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

	it( 'shows the placeholder when there is no condition', () => {
		const wrapper = shallowMount( QueryBuilder, { store: newStore(), localVue } );
		expect( wrapper.find( '.querybuilder__condition-placeholder' ).text() ).toBe(
			'Placeholder text for testing',
		);
	} );

	it( 'does not show the placeholder when there is a condition', () => {
		const condition = {
			propertyId: 'P1',
			value: 'foo',
			datatype: 'string',
			propertyValueRelation: PropertyValueRelation.Matching,
			subclasses: false,
			negate: false,
		};
		const store = newStore(
			{
				conditionRows: jest.fn().mockReturnValue( [ condition ] ),
			},
		);
		const wrapper = shallowMount( QueryBuilder, { store, localVue } );
		expect( wrapper.find( '.querybuilder__condition-placeholder' ).exists() ).toBeFalsy();
	} );
} );
