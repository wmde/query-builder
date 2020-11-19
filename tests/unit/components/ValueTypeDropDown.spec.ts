import Vue from 'vue';
import ValueTypeDropDown from '@/components/ValueTypeDropDown.vue';
import { shallowMount } from '@vue/test-utils';

describe( 'ValueTypeDropDown.vue', () => {
	it( 'emits an `input` event containing the selected option item upon selection', async () => {
		const optionItems = [
			{ value: 'matching' },
			{ value: 'regardless of value' },
		];

		const wrapper = shallowMount( ValueTypeDropDown, { propsData: {
			value: null,
		} } );

		wrapper.setData( { optionItems } );

		await Vue.nextTick();

		const selectedItem = 1;
		wrapper.findAll( '.querybuilder__dropdown-option' ).at( selectedItem ).element.click();

		expect( wrapper.emitted( 'input' )![ 0 ] ).toEqual( [ optionItems[ selectedItem ].value ] );
	} );
} );
