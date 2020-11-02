import { RootState } from './RootState';
import QueryRepresentation from '@/sparql/QueryRepresentation';
import Property from '@/data-model/Property';

export default {
	query( { property, value }: RootState ): QueryRepresentation {
		return { property, value };
	},
	getProperty( rootState: RootState ): Property {
		return rootState.property;
	}
};
