import Vue from 'vue';
import ValueTypeDropDown from '@/components/ValueTypeDropDown.vue';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { shallowMount } from '@vue/test-utils';

describe( 'ValueTypeDropDown.vue', () => {
	it( 'emits an `input` event containing the selected option item upon selection', async () => {
		const optionItems = PropertyValueRelation;
		const wrapper = shallowMount( ValueTypeDropDown );

		wrapper.setData( {
			selected: optionItems.Matching,
			optionItems: optionItems,
		} );

		wrapper.findComponent( ValueTypeDropDown ).vm.$emit( 'input', optionItems.Matching );

		await Vue.nextTick();

		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toEqual( optionItems.Matching );
	} );
} );
