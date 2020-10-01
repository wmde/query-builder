import { shallowMount } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';

describe( 'QueryBuilder.vue', () => {
	it( 'has a heading', () => {
		const wrapper = shallowMount( QueryBuilder, {} );
		expect( wrapper.find( 'h1' ).text() ).toBe( 'Simple Query Builder' );
	} );
} );
