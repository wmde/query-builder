import allowedDatatypes from '@/allowedDataTypes';
import RootState, { ConditionRow } from './RootState';
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
			...rootState.limit && { limit: rootState.limit },
		};
	},
	conditionRows( rootState: RootState ): ConditionRow[] {
		return rootState.conditionRows;
	},
	property( rootState: RootState ) {
		return ( conditionIndex: number ): ( Property | null ) => {
			if ( !rootState.conditionRows[ conditionIndex ].propertyData?.id ) {
				return null;
			}
			return rootState.conditionRows[ conditionIndex ].propertyData;
		};
	},
	propertyError( rootState: RootState ) {
		return ( conditionIndex: number ): ( Error | null ) => {
			return rootState.conditionRows[ conditionIndex ].propertyData.propertyError;
		};
	},
	limitedSupport( rootState: RootState ) {
		return ( conditionIndex: number ): boolean => {
			const datatype = rootState.conditionRows[ conditionIndex ].propertyData.datatype;
			return datatype !== null && !allowedDatatypes.includes( datatype );
		};
	},
	value( rootState: RootState ) {
		return ( conditionIndex: number ): string => {
			return rootState.conditionRows[ conditionIndex ].valueData.value;
		};
	},
	valueError( rootState: RootState ) {
		return ( conditionIndex: number ): ( Error | null ) => {
			return rootState.conditionRows[ conditionIndex ].valueData.valueError;
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
