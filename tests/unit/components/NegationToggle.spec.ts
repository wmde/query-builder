import NegationToggle from '@/components/NegationToggle.vue';
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

describe( 'NegationToggle', () => {
	it( 'passes the value down to the ToggleButtonGroup', () => {
		const value = 'without';
		const wrapper = shallowMount( NegationToggle, {
			propsData: {
				value,
			},
		} );

		expect( wrapper.findComponent( ToggleButtonGroup ).props() ).toStrictEqual( { value } );
	} );

	it( 'creates a ToggleButton for each option', () => {
		const wrapper = shallowMount( NegationToggle );

		const toggleButtons = wrapper.findAllComponents( ToggleButton );
		expect( toggleButtons.length ).toBe( 2 );
		expect( toggleButtons.at( 0 ).props( 'value' ) ).toBe( 'with' );
		expect( toggleButtons.at( 1 ).props( 'value' ) ).toBe( 'without' );
	} );

	it( 'bubbles up the input event from the ToggleButtonGroup', () => {
		const wrapper = shallowMount( NegationToggle );

		wrapper.findComponent( ToggleButtonGroup ).vm.$emit( 'input', 'without' );

		expect( wrapper.emitted( 'input' ) ).toStrictEqual( [ [ 'without' ] ] );
	} );
} );
