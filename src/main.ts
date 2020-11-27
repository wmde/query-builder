import Vue from 'vue';
import App from './App.vue';
import { createStore } from './store';
import services from '@/ServicesFactory';

Vue.config.productionTip = false;

new Vue( {
	store: createStore( services ),
	render: ( h ) => h( App ),
} ).$mount( '#app' );
