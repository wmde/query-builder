import { RootState } from './RootState';

export default {
	setValue( state: RootState, value: string ): void {
		state.value = value;
	}
};
