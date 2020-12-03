import Vue from 'vue';
import AddCondition from '@/components/AddCondition.vue';
import { Button } from '@wmde/wikit-vue-components';
import { shallowMount } from '@vue/test-utils';

describe( 'AddCondition.vue', () => {
	it( 'emits an `add-condition` event when Add Condition button is clicked', async () => {
		const wrapper = shallowMount( AddCondition );

		wrapper.findComponent( Button ).trigger( 'click' );

		await Vue.nextTick();

		expect( wrapper.emitted( 'add-condition' ) ).toBeTruthy();
	} );
} );
