import SearchEntityRepository from '@/data-access/SearchEntityRepository';

export interface Services {
	searchEntityRepository: SearchEntityRepository;
}

export default class QueryBuilderServices {
	private readonly services: Partial<Services>;

	public constructor() {
		this.services = {};
	}

	public set<K extends keyof Services>( key: K, service: Services[ K ] ): void {
		this.services[ key ] = service;
	}

	public get<K extends keyof Services>( key: K ): Services[ K ] {
		if ( this.services[ key ] === undefined ) {
			throw new Error( `${key} is undefined` );
		}

		return this.services[ key ] as Services[ K ];
	}
}
