import { Dropdown } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import ReferenceRelationDropDown from '@/components/ReferenceRelationDropDown.vue';
import ReferenceRelation from '@/data-model/ReferenceRelation';
import { mount } from '@vue/test-utils';
import i18n from 'vue-banana-i18n';

const messages = {};

Vue.use( i18n, {
	locale: 'en',
	messages,
	wikilinks: true,
} );

describe( 'ReferenceRelationDropDown.vue', () => {
	it( 'emits an `input` event containing the selected option item upon selection', async () => {
		const optionItems = ReferenceRelation;
		const wrapper = mount( ReferenceRelationDropDown, {
			propsData: {
				value: ReferenceRelation.With,
			},
		} );

		await wrapper.findComponent( Dropdown ).vm.$emit( 'input', { value: optionItems.Without } );

		expect( wrapper.emitted( 'input' )![ 0 ][ 0 ] ).toEqual( optionItems.Without );
	} );

	it( 'passes the disabled prop down to the Dropdown', () => {
		const wrapper = mount( ReferenceRelationDropDown, {
			propsData: {
				value: ReferenceRelation.With,
				disabled: true,
			},
		} );

		expect( wrapper.findComponent( Dropdown ).props( 'disabled' ) ).toBe( true );
	} );
} );
