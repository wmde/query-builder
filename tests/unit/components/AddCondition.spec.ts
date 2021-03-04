import Vue from 'vue';
import AddCondition from '@/components/AddCondition.vue';
import { Button } from '@wmde/wikit-vue-components';
import { shallowMount } from '@vue/test-utils';
import i18n from 'vue-banana-i18n';

const messages = {};
Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

describe( 'AddCondition.vue', () => {
	it( 'emits an `add-condition` event when Add Condition button is clicked', async () => {
		const wrapper = shallowMount( AddCondition );

		await wrapper.findComponent( Button ).trigger( 'click' );

		expect( wrapper.emitted( 'add-condition' ) ).toBeTruthy();
	} );
} );
