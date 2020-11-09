import { ActionContext } from 'vuex';
import RootState from './RootState';
import SearchEntityRepository from '@/data-access/SearchEntityRepository';
import SearchResult from '@/data-access/SearchResult';
import Error from '@/data-model/Error';
import Property from '@/data-model/Property';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default ( searchEntityRepository: SearchEntityRepository ) => ( {
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
	setErrors( context: ActionContext<RootState, RootState>, errors: Error[] ): void {
		context.commit( 'setErrors', errors );
	},
} );
