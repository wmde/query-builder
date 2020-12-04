import { Dropdown } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import ValueTypeDropDown from '@/components/ValueTypeDropDown.vue';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { mount } from '@vue/test-utils';

describe( 'ValueTypeDropDown.vue', () => {
	it( 'emits an `input` event containing the selected option item upon selection', async () => {
		const optionItems = PropertyValueRelation;
		const wrapper = mount( ValueTypeDropDown, {
			propsData: {
				value: PropertyValueRelation.Matching,
			},
		} );

		wrapper.findComponent( Dropdown ).vm.$emit( 'input', { value: optionItems.Regardless } );
		await Vue.nextTick();

		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toEqual( optionItems.Regardless );
	} );
} );
