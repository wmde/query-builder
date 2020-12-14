import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { createLocalVue, mount } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';
import { axe, toHaveNoViolations } from 'jest-axe';
import Vuex from 'vuex';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';

const localVue = createLocalVue();
localVue.use( Vuex );

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

describe( 'QueryBuilder.vue', () => {
	it( 'should not have obvious accessibility issues', async () => {
		const wrapper = mount( QueryBuilder, {
			store: new Vuex.Store( {
				state: {
					errors: [],
				},
				getters: {
					value: jest.fn().mockReturnValue( jest.fn().mockReturnValue( '' ) ),
					valueError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( null ) ),
					property: jest.fn().mockReturnValue( jest.fn().mockReturnValue(
						{ label: 'postal code', id: 'P123' },
					) ),
					propertyError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( null ) ),
					limitedSupport: jest.fn().mockReturnValue( jest.fn().mockReturnValue( false ) ),
					propertyValueRelation: jest.fn().mockReturnValue(
						jest.fn().mockReturnValue( PropertyValueRelation.Matching ),
					),
				},
				actions: {
					incrementMetric: jest.fn(),
				},
			} ),
			localVue,
			propsData: {
				encodedQuery: '',
				iframeRenderKey: 0,
				fieldErrors: {
					property: null,
					value: null,
				},
			},
		} );
		const results = await axe( wrapper.element );

		expect.extend( toHaveNoViolations );
		expect( results ).toHaveNoViolations();
	} );
} );
