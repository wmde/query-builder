import RootState from './RootState';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import Property from '@/data-model/Property';
import Error from '@/data-model/Error';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default {
	query( rootState: RootState ): QueryRepresentation {
		return {
			conditions: rootState.conditionRows.map( ( condition ) => {
				return {
					propertyId: condition.propertyData.id,
					value: condition.valueData.value,
					propertyValueRelation: condition.propertyValueRelationData.value,
				};
			} ),
		};
	},
	property( rootState: RootState ) {
		return ( conditionIndex: number ): ( Property | null ) => {
			if ( !rootState.conditionRows[ conditionIndex ].propertyData?.id ) {
				return null;
			}
			return rootState.conditionRows[ conditionIndex ].propertyData;
		};
	},
	value( rootState: RootState ) {
		return ( conditionIndex: number ): string => {
			return rootState.conditionRows[ conditionIndex ].valueData.value;
		};
	},
	propertyValueRelation( rootState: RootState ) {
		return ( conditionIndex: number ): PropertyValueRelation => {
			return rootState.conditionRows[ conditionIndex ].propertyValueRelationData.value;
		};
	},
	getErrors( rootState: RootState ): Error[] {
		return rootState.errors;
	},
};
