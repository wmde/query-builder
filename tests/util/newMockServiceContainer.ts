import { Services } from '@/QueryBuilderServices';

export default function newMockServiceContainer( services: Partial<{
	[K in keyof Services]: any;
}> ): any {
	return {
		get( name: keyof Services ): any {
			if ( !services[ name ] ) {
				return {};
			}
			return services[ name ];
		},
	};
}
