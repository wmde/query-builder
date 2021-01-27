import ConditionRelationToggle from '@/components/ConditionRelationToggle.vue';
import { shallowMount } from '@vue/test-utils';
import { ToggleButton, ToggleButtonGroup } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import i18n from 'vue-banana-i18n';

const messages = {};
Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

describe( 'ConditionRelationToggle', () => {
	it( 'passes the value down to the ToggleButtonGroup', () => {
		const value = 'or';
		const wrapper = shallowMount( ConditionRelationToggle, {
			propsData: {
				value,
			},
		} );

		expect( wrapper.findComponent( ToggleButtonGroup ).props() ).toStrictEqual( { value } );
	} );

	it( 'creates a ToggleButton for each option', () => {
		const wrapper = shallowMount( ConditionRelationToggle );

		const toggleButtons = wrapper.findAllComponents( ToggleButton );
		expect( toggleButtons.length ).toBe( 2 );
		expect( toggleButtons.at( 0 ).props( 'value' ) ).toBe( 'and' );
		expect( toggleButtons.at( 1 ).props( 'value' ) ).toBe( 'or' );
	} );

	it( 'bubbles up the input event from the ToggleButtonGroup', () => {
		const wrapper = shallowMount( ConditionRelationToggle );

		wrapper.findComponent( ToggleButtonGroup ).vm.$emit( 'input', 'and' );

		expect( wrapper.emitted( 'set-relation-toggle' ) ).toStrictEqual( [ [ 'and' ] ] );
	} );
} );
