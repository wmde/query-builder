import Vuex, { Store } from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import QueryBuilder from '@/components/QueryBuilder.vue';
import TextInput from '@wmde/wikit-vue-components/src/components/TextInput.vue';

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

describe( 'QueryBuilder.vue', () => {

	it( 'has a heading', () => {
		const wrapper = shallowMount( QueryBuilder, { store: newStore(), localVue } );
		expect( wrapper.find( 'h1' ).text() ).toBe( 'Simple Query Builder' );
	} );

	it( 'renders the Property label in the property textfield', () => {
		const propertyLabel = 'postal code';
		const wrapper = shallowMount( QueryBuilder, {
			store: newStore( { property: { label: propertyLabel } } ),
			localVue
		} );

		expect( wrapper.findComponent( TextInput ).props( 'value' ) ).toBe( propertyLabel );
	} );

	it( 'updates the store value when the user fills in the value textfield', () => {
		const store = newStore();
		store.dispatch = jest.fn();
		const wrapper = shallowMount( QueryBuilder, {
			store,
			localVue
		} );
		const userInput = 'potato';

		const input = wrapper.findComponent( { ref: 'value' } );
		input.vm.$emit( 'input', userInput );

		expect( store.dispatch ).toHaveBeenCalledWith( 'updateValue', userInput );
	} );
} );
