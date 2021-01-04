import createActions from '@/store/actions';
import services from '@/ServicesFactory';
import SearchOptions from '@/data-access/SearchOptions';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { ConditionRow } from '@/store/RootState';

describe( 'actions', () => {

	it( 'updateValue', () => {
		const context = { commit: jest.fn() };
		const value = 'whatever';
		const conditionIndex = 0;
		const actions = createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		);

		actions.updateValue( context as any, { value, conditionIndex } );

		expect( context.commit ).toHaveBeenCalledWith( 'setValue', { value, conditionIndex } );
	} );

	it( 'setConditionAsLimitedSupport', () => {
		const context = {
			commit: jest.fn(),
			dispatch: jest.fn(),
		};
		const actions = createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		);
		const conditionIndex = 0;

		actions.setConditionAsLimitedSupport( context as any, conditionIndex );

		expect( context.commit ).toHaveBeenCalledWith( 'setFieldErrors', {
			index: conditionIndex,
			errors: {
				propertyError: {
					message: 'query-builder-property-lookup-limited-support-note',
					type: 'warning',
				},
			},
		} );
	} );

	describe( 'updateProperty', () => {
		it( 'commits the property to the store', () => {
			const context = {
				commit: jest.fn(),
				dispatch: jest.fn(),
			};
			const property = {
				id: 'P666',
				label: 'Property label',
				datatype: 'string',
			};
			const conditionIndex = 0;
			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				services.get( 'metricsCollector' ),
			);

			actions.updateProperty( context as any, { property, conditionIndex } );

			expect( context.commit ).toHaveBeenCalledTimes( 2 );
			expect( context.commit ).toHaveBeenCalledWith( 'setProperty', { property, conditionIndex } );
			expect( context.commit ).toHaveBeenCalledWith( 'clearFieldErrors', {
				conditionIndex: 0,
				errorsToClear: 'property',
			} );
		} );

		it( 'handles datatypes with limited support', () => {
			const context = {
				commit: jest.fn(),
				dispatch: jest.fn(),
			};
			const property = {
				id: 'P666',
				label: 'Property label',
				datatype: 'some unsupported data type',
			};
			const conditionIndex = 0;
			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				services.get( 'metricsCollector' ),
			);

			actions.updateProperty( context as any, { property, conditionIndex } );

			expect( context.commit ).toHaveBeenCalledTimes( 1 );
			expect( context.commit ).toHaveBeenCalledWith( 'setProperty', { property, conditionIndex } );
			expect( context.dispatch ).toHaveBeenCalledWith( 'setConditionAsLimitedSupport', 0 );
		} );
	} );

	describe( 'searchProperties', () => {
		it( 'calls the repo and resolves with the result', async () => {
			const expectedResult = [ { label: 'postal code', id: 'P123', datatype: 'string' } ];
			const searchProperties = jest.fn().mockResolvedValue(
				JSON.parse( JSON.stringify( expectedResult ) ),
			);
			const actions = createActions(
				{ searchProperties, searchItemValues: jest.fn() },
				services.get( 'metricsCollector' ),
			);

			const searchOptions: SearchOptions = { search: 'postal', limit: 12 };
			const actualResult = await actions.searchProperties( {} as any, searchOptions );

			expect( searchProperties ).toHaveBeenCalledWith(
				searchOptions.search,
				searchOptions.limit,
				searchOptions.offset,
			);
			expect( actualResult ).toStrictEqual( expectedResult );
		} );

		it( 'adds message to properties with limited support', async () => {
			const searchInput = [ { label: 'postal code', id: 'P123', datatype: 'wikibase-sense' } ];
			const expectedResult = [
				{
					...searchInput[ 0 ],
					tag: 'query-builder-property-lookup-limited-support-tag',
				},
			];
			const searchProperties = jest.fn().mockResolvedValue(
				JSON.parse( JSON.stringify( expectedResult ) ),
			);
			const actions = createActions(
				{ searchProperties, searchItemValues: jest.fn() },
				services.get( 'metricsCollector' ),
			);

			const searchOptions: SearchOptions = { search: 'postal', limit: 12 };
			const actualResult = await actions.searchProperties( {} as any, searchOptions );

			expect( actualResult ).toStrictEqual( expectedResult );
		} );
	} );

	describe( 'searchItemValues', () => {
		it( 'calls the repo and resolves with the result', async () => {
			const expectedResult = [ { label: 'potato', id: 'Q666', datatype: 'string' } ];
			const searchItemValues = jest.fn().mockResolvedValue(
				JSON.parse( JSON.stringify( expectedResult ) ),
			);
			const actions = createActions(
				{ searchProperties: jest.fn(), searchItemValues },
				services.get( 'metricsCollector' ),
			);

			const searchOptions: SearchOptions = { search: 'potato', limit: 12 };
			const actualResult = await actions.searchItemValues( {} as any, searchOptions );

			expect( searchItemValues ).toHaveBeenCalledWith(
				searchOptions.search,
				searchOptions.limit,
				searchOptions.offset,
			);
			expect( actualResult ).toStrictEqual( expectedResult );
		} );
	} );

	describe( 'incrementMetric', () => {
		it( 'increments metric', async () => {
			const increment = jest.fn();
			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				{ increment },
			);

			await actions.incrementMetric( {} as any, 'foo' );

			expect( increment ).toHaveBeenCalledWith( 'foo' );
		} );
	} );

	it( 'addCondition', () => {
		const context = { commit: jest.fn() };

		const actions = createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		);

		actions.addCondition( context as any );

		expect( context.commit ).toHaveBeenCalledWith( 'addCondition' );
	} );

	it( 'removeCondition', () => {
		const context = { commit: jest.fn() };

		const actions = createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		);

		actions.removeCondition( context as any, 0 );

		expect( context.commit ).toHaveBeenCalledWith( 'removeCondition', 0 );
	} );

	describe( 'validateForm', () => {
		it( 'adds only a notice for a single empty line', () => {
			const context = {
				rootState: {
					conditionRows: [
						{
							propertyData: {
								id: '',
								label: '',
								datatype: null,
								propertyError: null,
							},
							valueData: {
								value: '',
								valueError: null,
							},
							propertyValueRelationData: {
								value: PropertyValueRelation.Matching,
							},
						} as ConditionRow,
					],
				},
				commit: jest.fn(),
			};

			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				services.get( 'metricsCollector' ),
			);

			actions.validateForm( context as any );

			expect( context.commit ).toHaveBeenCalledWith( 'setErrors', [ {
				message: 'query-builder-result-error-empty-form',
				type: 'notice',
			} ] );
			expect( context.commit ).toHaveBeenCalledWith( 'setFieldErrors', {
				errors: {
					propertyError: null,
					valueError: null,
				},
				index: 0,
			} );
		} );

		it( 'adds errors if the form is incomplete', () => {
			const context = {
				rootState: {
					conditionRows: [
						{
							propertyData: {
								id: 'P123',
								label: 'some string',
								datatype: 'string',
								propertyError: null,
							},
							valueData: {
								value: '',
								valueError: null,
							},
							propertyValueRelationData: {
								value: PropertyValueRelation.Matching,
							},
						} as ConditionRow,
					],
				},
				commit: jest.fn(),
			};

			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				services.get( 'metricsCollector' ),
			);

			actions.validateForm( context as any );

			expect( context.commit ).toHaveBeenCalledWith( 'setErrors', [ {
				message: 'query-builder-result-error-incomplete-form',
				type: 'error',
			} ] );
			expect( context.commit ).toHaveBeenCalledWith( 'setFieldErrors', {
				errors: {
					propertyError: null,
					valueError: {
						message: 'query-builder-result-error-missing-value',
						type: 'error',
					},
				},
				index: 0,
			} );
		} );

		it( 'removes existing errors', () => {
			const context = {
				rootState: {
					conditionRows: [
						{
							propertyData: {
								id: 'P123',
								label: 'some string',
								datatype: 'string',
								propertyError: null,
							},
							valueData: {
								value: 'some text that was added',
								valueError: {
									message: 'some-error-message-key',
									type: 'error',
								},
							},
							propertyValueRelationData: {
								value: PropertyValueRelation.Matching,
							},
						} as ConditionRow,
					],
					errors: [ {
						message: 'query-builder-result-error-incomplete-form',
						type: 'error',
					} ],
				},
				commit: jest.fn(),
			};
			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				services.get( 'metricsCollector' ),
			);

			actions.validateForm( context as any );

			expect( context.commit ).toHaveBeenCalledWith( 'setErrors', [] );
			expect( context.commit ).toHaveBeenCalledWith( 'setFieldErrors', {
				errors: {
					propertyError: null,
					valueError: null,
				},
				index: 0,
			} );

		} );

		it( 'keeps limited support messages', () => {
			const context = {
				rootState: {
					conditionRows: [
						{
							propertyData: {
								id: 'P123',
								label: 'some string',
								datatype: 'some unsupported data type',
								propertyError: null,
							},
							valueData: {
								value: 'Lorem Ipsum',
								valueError: null,
							},
							propertyValueRelationData: {
								value: PropertyValueRelation.Matching,
							},
						} as ConditionRow,
					],
					errors: [ {
						message: 'query-builder-result-error-incomplete-form',
						type: 'error',
					} ],
				},
				commit: jest.fn(),
				dispatch: jest.fn(),
			};
			const actions = createActions(
				services.get( 'searchEntityRepository' ),
				services.get( 'metricsCollector' ),
			);

			actions.validateForm( context as any );

			expect( context.commit ).toHaveBeenCalledWith( 'setErrors', [] );
			expect( context.commit ).toHaveBeenCalledWith( 'setFieldErrors', {
				errors: {
					propertyError: null,
					valueError: null,
				},
				index: 0,
			} );
			expect( context.dispatch ).toHaveBeenCalledWith( 'setConditionAsLimitedSupport', 0 );
		} );

	} );

} );
