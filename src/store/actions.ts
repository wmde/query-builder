import { ActionContext } from 'vuex';
import RootState from './RootState';
import SearchResult from '@/data-access/SearchResult';
import Error from '@/data-model/Error';
import Property from '@/data-model/Property';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import MetricsCollector from '@/data-access/MetricsCollector';
import SearchEntityRepository from '@/data-access/SearchEntityRepository';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default ( searchEntityRepository: SearchEntityRepository, metricsCollector: MetricsCollector ) => ( {
	async searchProperties( _context: ActionContext<RootState, RootState>, search: string ): Promise<SearchResult[]> {
		// check for empty
		return await searchEntityRepository.searchProperties( search, 12 );
	},
	updateValue( context: ActionContext<RootState, RootState>, value: string ): void {
		context.commit( 'setValue', value );
	},
	updateProperty( context: ActionContext<RootState, RootState>, property: Property ): void {
		context.commit( 'setProperty', property );
	},
	updatePropertyValueRelation( context: ActionContext<RootState, RootState>,
		propertyValueRelation: PropertyValueRelation ): void {
		context.commit( 'setPropertyValueRelation', propertyValueRelation );
	},
	setErrors( context: ActionContext<RootState, RootState>, errors: Error[] ): void {
		context.commit( 'setErrors', errors );
	},
	incrementMetric( context: ActionContext<RootState, RootState>, metric: string ): void {
		metricsCollector.increment( metric );
	},
} );
