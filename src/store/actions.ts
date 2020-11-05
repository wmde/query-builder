import { ActionContext } from 'vuex';
import RootState from './RootState';
import Property from '@/data-model/Property';
import SearchEntityRepository from '@/data-access/SearchEntityRepository';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default ( _searchEntityRepository: SearchEntityRepository ) => ( {
	updateValue( context: ActionContext<RootState, RootState>, value: string ): void {
		context.commit( 'setValue', value );
	},
	updateProperty( context: ActionContext<RootState, RootState>, property: Property ): void {
		context.commit( 'setProperty', property );
	},
} );
