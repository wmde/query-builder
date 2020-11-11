import RootState from './RootState';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import Property from '@/data-model/Property';
import Error from '@/data-model/Error';

export default {
	query( rootState: RootState ): QueryRepresentation {
		return {
			condition: {
				propertyId: rootState.conditionRow.propertyData.id,
				value: rootState.conditionRow.valueData.value,
			},
		};
	},
	property( rootState: RootState ): Property | null {
		if ( !rootState.conditionRow.propertyData.id ) {
			return null;
		}
		return rootState.conditionRow.propertyData;
	},
	value( rootState: RootState ): string {
		return rootState.conditionRow.valueData.value;
	},
	getErrors( rootState: RootState ): Error[] {
		return rootState.errors;
	},
};
