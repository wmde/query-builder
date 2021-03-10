import InfoTooltip from '@/components/InfoTooltip.vue';
import { mount } from '@vue/test-utils';
import { Button } from '@wmde/wikit-vue-components';

describe( 'InfoTooltip component', () => {
	// There's not much we can test here
	it( 'shows the icon and shows the text on hover', () => {
		const props = {
			message: 'The popover text.',
			position: 'top',
		};
		const wrapper = mount( InfoTooltip, {
			propsData: props,
		} );
		expect( wrapper.findAllComponents( Button ) ).toHaveLength( 1 );
		expect( wrapper.vm.$props ).toStrictEqual( props );
	} );
} );
