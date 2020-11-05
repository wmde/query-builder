import RootState from './RootState';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import Property from '@/data-model/Property';

export default {
	query( rootState: RootState ): QueryRepresentation {
		return {
			condition: {
				propertyId: rootState.conditionRow.propertyData.id,
				value: rootState.conditionRow.valueData.value,
			},
		};
	},
	property( rootState: RootState ): Property {
		return rootState.conditionRow.propertyData;
	},
	value( rootState: RootState ): string {
		return rootState.conditionRow.valueData.value;
	},
};
