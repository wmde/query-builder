import FetchLanguageService from '@/data-access/FetchLanguageService';
import QueryBuilderServices from '@/QueryBuilderServices';
import FetchSearchEntityRepository from '@/data-access/FetchSearchEntityRepository';
import StatsvMetricsCollector from '@/data-access/StatsvMetricsCollector';

const services = new QueryBuilderServices();
const languageService = new FetchLanguageService();
services.set( 'languageService', languageService );
services.set( 'searchEntityRepository', new FetchSearchEntityRepository(
	languageService.getAppLanguageCode(),
	process.env.VUE_APP_WIKIBASE_API_URL || '',
) );

services.set( 'metricsCollector', new StatsvMetricsCollector(
	'Wikidata.query-builder',
	process.env.VUE_APP_STATSV_ENDPOINT || null,
) );

export default services;
