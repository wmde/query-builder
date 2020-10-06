import { ActionContext } from 'vuex';
import { RootState } from './RootState';

export default {
	updateValue( context: ActionContext<RootState, RootState>, value: string ): void {
		context.commit( 'setValue', value );
	}
};
