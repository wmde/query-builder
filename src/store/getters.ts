import { RootState } from './RootState';
import QueryRepresentation from '@/sparql/QueryRepresentation';

export default {
	query( { property, value }: RootState ): QueryRepresentation {
		return { property, value };
	}
};
