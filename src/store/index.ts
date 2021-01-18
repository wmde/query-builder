import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import createActions from './actions';
import mutations from './mutations';
import getters from './getters';
import QueryBuilderServices from '@/QueryBuilderServices';
import RootState, { PropertyData, ConditionRow } from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';

Vue.use( Vuex );

export function newEmptyPropertyData( propertyError: Error|null = null ): PropertyData {
	return {
		label: '',
		id: '',
		datatype: null,
		isPropertySet: false,
		propertyError,
	};
}

export function getFreshConditionRow(): ConditionRow {
	return {
		propertyData: newEmptyPropertyData(),
		valueData: {
			value: null,
			valueError: null,
		},
		propertyValueRelationData: {
			value: PropertyValueRelation.Matching,
		},
		subclasses: false,
		negate: false,
		conditionId: `condition-id-${Math.random()}`,
	};
}

export function createStore( services: QueryBuilderServices ): Store<RootState> {

	return new Store( {
		state: {
			conditionRows: [ getFreshConditionRow() ],
			errors: [],
			limit: 100,
			useLimit: true,
			omitLabels: false,
		},
		actions: createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		),
		mutations,
		getters,
		modules: {},
	} );

}
