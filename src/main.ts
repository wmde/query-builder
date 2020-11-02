import Vue from 'vue';
import App from './App.vue';
import { createStore } from './store';
import QueryBuilderServices from '@/QueryBuilderServices';
import FetchSearchEntityRepository from '@/data-access/FetchSearchEntityRepository';

Vue.config.productionTip = false;

const services = new QueryBuilderServices();
services.set( 'searchEntityRepository', new FetchSearchEntityRepository(
	'en', // TODO: this should somehow depend on the browser via T263553
	'https://www.wikidata.org/w/api.php' // TODO: this should somehow be configured at build time
) );

new Vue( {
	store: createStore( services ),
	render: ( h ) => h( App )
} ).$mount( '#app' );
