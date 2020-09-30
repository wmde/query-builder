import { shallowMount } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';

describe( 'QueryBuilder.vue', () => {
	it( 'renders props.msg when passed', () => {
		const wrapper = shallowMount( QueryBuilder, {} );
		expect( wrapper.text() ).toMatch( '' );
	} );
} );
