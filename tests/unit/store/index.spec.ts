import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';
import { createStore } from '@/store';
import RootState from '@/store/RootState';
import newMockServiceContainer from '../../util/newMockServiceContainer';

describe( 'createStore', () => {
	it( 'creates the initial state', () => {
		const store = createStore( newMockServiceContainer( {} ) );

		const expectedInitialState: RootState = {
			conditionRows: [ {
				negate: false,
				propertyData: {
					id: '',
					label: '',
					datatype: null,
					propertyError: null,
					isPropertySet: false,
				},
				valueData: {
					value: null,
					valueError: null,
				},
				propertyValueRelationData: {
					value: PropertyValueRelation.Matching,
				},
				referenceRelation: ReferenceRelation.Regardless,
				conditionRelation: null,
				subclasses: false,
				conditionId: store.state.conditionRows[ 0 ].conditionId, // this is auto-generated and random
			} ],
			errors: [],
			limit: 100,
			omitLabels: false,
			useLimit: true,
		};
		expect( store ).toBeDefined();
		expect( store.state ).toStrictEqual( expectedInitialState );
	} );
} );
