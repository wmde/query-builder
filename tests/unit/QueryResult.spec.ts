import Vuex, { Store } from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import QueryResult from '@/components/QueryResult.vue';

function newStore( state = {} ): Store<any> {
	return new Vuex.Store( {
		state: {
			property: 'potato',
			...state
		}
	} );
}

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'QueryResult.vue', () => {
	it( 'Show an empty page without input', () => {
		const wrapper = shallowMount( QueryResult, {
			store: newStore(),
			localVue,
			propsData: {
				encodedQuery: '',
				iframeRenderKey: 0
			}
		} );
		expect( wrapper.find( 'div' ).text() ).toBe( 'Results will be displayed here' );
		expect( wrapper.findAll( 'iframe' ) ).toHaveLength( 0 );
	} );
} );
