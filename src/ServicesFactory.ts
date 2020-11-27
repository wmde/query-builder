import QueryBuilderServices from '@/QueryBuilderServices';
import FetchSearchEntityRepository from '@/data-access/FetchSearchEntityRepository';
import StatsvMetricsCollector from '@/data-access/StatsvMetricsCollector';

const services = new QueryBuilderServices();
services.set( 'searchEntityRepository', new FetchSearchEntityRepository(
	'en', // TODO: this should somehow depend on the browser via T263553
	process.env.VUE_APP_WIKIBASE_API_URL || '',
) );

services.set( 'metricsCollector', new StatsvMetricsCollector(
	'Wikidata.query-builder',
	process.env.VUE_APP_STATSV_ENDPOINT || null,
) );

export default services;
