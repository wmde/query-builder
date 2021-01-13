import allowedDatatypes from '@/allowedDataTypes';
import FormValues from '@/form/FormValues';
import Validator from '@/form/Validator';
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import { ActionContext } from 'vuex';
import RootState, { ConditionRow } from './RootState';
import SearchResult from '@/data-access/SearchResult';
import Error from '@/data-model/Error';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import MetricsCollector from '@/data-access/MetricsCollector';
import SearchEntityRepository from '@/data-access/SearchEntityRepository';
import SearchOptions from '@/data-access/SearchOptions';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default ( searchEntityRepository: SearchEntityRepository, metricsCollector: MetricsCollector ) => ( {
	async searchProperties(
		_context: ActionContext<RootState, RootState>,
		options: SearchOptions ): Promise<SearchResult[]> {
		const searchResults = await searchEntityRepository.searchProperties(
			options.search,
			options.limit,
			options.offset,
		);
		return searchResults.map( ( searchResult: MenuItem & SearchResult ) => {
			if ( !allowedDatatypes.includes( searchResult.datatype ) ) {
				searchResult.tag = 'query-builder-property-lookup-limited-support-tag';
			}
			return searchResult;
		} );
	},
	async searchItemValues(
		_context: ActionContext<RootState, RootState>,
		options: SearchOptions ): Promise<SearchResult[]> {
		// check for empty
		return await searchEntityRepository.searchItemValues(
			options.search,
			options.limit,
			options.offset,
		);
	},
	updateValue(
		context: ActionContext<RootState, RootState>,
		payload: { value: string; conditionIndex: number } ): void {
		context.commit( 'setValue', payload );
	},
	unsetProperty( context: ActionContext<RootState, RootState>, conditionIndex: number ): void {
		context.commit( 'unsetProperty', conditionIndex );
		context.commit(
			'clearFieldErrors',
			{
				conditionIndex,
				errorsToClear: 'property',
			},
		);
	},
	updateProperty( context: ActionContext<RootState, RootState>,
		payload: { property: { label: string; id: string; datatype: string }; conditionIndex: number } ): void {

		const oldDatatype = context.getters.datatype( payload.conditionIndex );
		if ( oldDatatype && oldDatatype !== payload.property.datatype ) {
			context.commit( 'clearValue', payload.conditionIndex );
		}

		context.commit( 'setProperty', payload );
		if ( !allowedDatatypes.includes( payload.property.datatype ) ) {
			context.dispatch( 'setConditionAsLimitedSupport', payload.conditionIndex );
		} else {
			context.commit(
				'clearFieldErrors',
				{
					conditionIndex: payload.conditionIndex,
					errorsToClear: 'property',
				},
			);
		}
	},
	updatePropertyValueRelation( context: ActionContext<RootState, RootState>,
		payload: { propertyValueRelation: PropertyValueRelation; conditionIndex: number } ): void {
		context.commit( 'setPropertyValueRelation', payload );
	},
	setLimit( context: ActionContext<RootState, RootState>, limit: number ): void {
		context.commit( 'setLimit', limit );
	},
	setUseLimit( context: ActionContext<RootState, RootState>, useLimit: boolean ): void {
		context.commit( 'setUseLimit', useLimit );
	},
	setOmitLabels( context: ActionContext<RootState, RootState>, omitLabels: boolean ): void {
		context.commit( 'setOmitLabels', omitLabels );
	},
	setSubclasses( context: ActionContext<RootState, RootState>,
		payload: { subclasses: boolean; conditionIndex: number } ): void {
		context.commit( 'setSubclasses', payload );
	},
	setErrors( context: ActionContext<RootState, RootState>, errors: Error[] ): void {
		context.commit( 'setErrors', errors );
	},
	incrementMetric( context: ActionContext<RootState, RootState>, metric: string ): void {
		metricsCollector.increment( metric );
	},
	addCondition( context: ActionContext<RootState, RootState> ): void {
		context.commit( 'addCondition' );
	},
	removeCondition( context: ActionContext<RootState, RootState>, conditionIndex: number ): void {
		context.commit( 'removeCondition', conditionIndex );
	},
	setConditionAsLimitedSupport( context: ActionContext<RootState, RootState>, conditionIndex: number ): void {
		context.dispatch(
			'updatePropertyValueRelation',
			{ propertyValueRelation: PropertyValueRelation.Regardless, conditionIndex },
		);
		context.dispatch( 'updateValue', { value: '', conditionIndex } );
		context.commit(
			'setFieldErrors',
			{
				index: conditionIndex,
				errors: {
					propertyError: {
						type: 'warning',
						message: 'query-builder-property-lookup-limited-support-note',
					},
				},
			},
		);
	},
	validateForm( context: ActionContext<RootState, RootState> ): void {

		const validator = new Validator(
			context.rootState.conditionRows.map( ( condition: ConditionRow ): FormValues => {
				// TODO: refactor FormValues to match ConditionRow and remove this mapping
				return {
					property: condition.propertyData.isPropertySet ? condition.propertyData : null,
					value: condition.valueData.value,
					propertyValueRelation: condition.propertyValueRelationData.value,
				};
			} ),
		);
		const validationResult = validator.validate();
		context.commit( 'setErrors', validationResult.formErrors );

		// set field errors for each row
		validationResult.fieldErrors.forEach( ( errors, conditionIndex ) => {
			context.commit(
				'setFieldErrors',
				{
					index: conditionIndex,
					errors: {
						propertyError: errors.property,
						valueError: errors.value,
					},
				},
			);
		} );

		// re-set limited support warning again where applicable
		context.rootState.conditionRows.forEach( ( conditionRow, index ) => {
			const datatype = conditionRow.propertyData?.datatype;
			if ( datatype && !allowedDatatypes.includes( datatype ) ) {
				context.dispatch( 'setConditionAsLimitedSupport', index );
			}
		} );
	},
} );
