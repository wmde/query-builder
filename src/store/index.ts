import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import createActions from './actions';
import mutations from './mutations';
import getters from './getters';
import QueryBuilderServices from '@/QueryBuilderServices';
import RootState from '@/store/RootState';

Vue.use( Vuex );

export function createStore( services: QueryBuilderServices ): Store<RootState> {

	return new Store( {
		state: {
			conditionRow: {
				propertyData: {
					label: 'postal code',
					id: 'P281',
				},
				valueData: {
					value: '',
				},
			},
		},
		actions: createActions(
			services.get( 'searchEntityRepository' ),
		),
		mutations,
		getters,
		modules: {},
	} );

}
