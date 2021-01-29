import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import RootState from '@/store/RootState';
import Vuex, { Store } from 'vuex';

export function getFreshRootState(): RootState {
	return {
		conditionRows: [ {
			valueData: { value: 'foo', valueError: null },
			propertyData: {
				id: 'P123',
				label: 'abc',
				datatype: 'string',
				isPropertySet: true,
				propertyError: null,
			},
			propertyValueRelationData: { value: PropertyValueRelation.Matching },
			conditionId: '0.123',
			subclasses: false,
			negate: false,
		} ],
		limit: 0,
		useLimit: false,
		omitLabels: true,
		errors: [],
	};
}

export function newStore( getters: Record<string, Function> = {} ): Store<any> {
	return new Vuex.Store( {
		getters: {
			conditionRows: jest.fn().mockReturnValue( jest.fn().mockReturnValue( [] ) ),
			property: jest.fn().mockReturnValue( jest.fn() ),
			propertyError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( null ) ),
			datatype: jest.fn().mockReturnValue( jest.fn() ),
			value: jest.fn().mockReturnValue( jest.fn() ),
			valueError: jest.fn().mockReturnValue( jest.fn().mockReturnValue( null ) ),
			negate: jest.fn().mockReturnValue( jest.fn() ),
			limitedSupport: jest.fn().mockReturnValue( jest.fn().mockReturnValue( false ) ),
			subclasses: jest.fn().mockReturnValue( jest.fn().mockReturnValue( false ) ),
			propertyValueRelation: jest.fn().mockReturnValue(
				jest.fn().mockReturnValue( PropertyValueRelation.Matching ),
			),
			limit: jest.fn().mockReturnValue( 100 ),
			useLimit: jest.fn().mockReturnValue( true ),
			omitLabels: jest.fn().mockReturnValue( false ),
			getErrors: jest.fn().mockReturnValue( [] ),
			...getters,
		},
		actions: {
			incrementMetric: jest.fn(),
		},
	} );
}
