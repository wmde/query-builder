import { RootState } from './RootState';
import Property from '@/data-model/Property';

export default {
	setValue( state: RootState, value: string ): void {
		state.value = value;
	},
	setProperty( state: RootState, property: Property ): void {
		state.property = property;
	}
};
