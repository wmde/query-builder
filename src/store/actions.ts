import { ActionContext } from 'vuex';
import { RootState } from './RootState';
import Property from '@/data-model/Property';

export default {
	updateValue( context: ActionContext<RootState, RootState>, value: string ): void {
		context.commit( 'setValue', value );
	},
	updateProperty( context: ActionContext<RootState, RootState>, property: Property ): void {
		context.commit( 'setProperty', property );
	}
};
