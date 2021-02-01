<template>
	<div id="app" :lang="lang" :dir="textDirection">
		<QueryBuilder v-if="isi18nLoaded"/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import QueryBuilder from '@/components/QueryBuilder.vue';
import i18n from 'vue-banana-i18n';
import services from '@/ServicesFactory';
import QueryDeserializer from '@/serialization/QueryDeserializer';

Vue.config.errorHandler = function () {
	services.get( 'metricsCollector' ).increment( 'errors' );
};

const languageService = services.get( 'languageService' );

export default Vue.extend( {
	data() {
		return {
			isi18nLoaded: false as boolean,
			lang: languageService.getAppLanguageCode(),
			textDirection: '',
		};
	},
	created(): void {
		const fetchi18n = async (): Promise<void> => {
			const messages: { [key: string]: { [key: string]: string} } = {
				en: await languageService.getMessagesForLangCode( 'en' ),
			};

			if ( this.lang !== 'en' ) {
				messages[ this.lang ] = await languageService.getMessagesForLangCode( this.lang );
			}

			Vue.use( i18n, {
				locale: this.lang,
				messages,
				wikilinks: true,
			} );
			this.isi18nLoaded = true;

			const urlParams = new URLSearchParams( window.location.search );
			if ( !urlParams.has( 'query' ) ) {
				return;
			}
			const deserializer = new QueryDeserializer();
			this.$store.dispatch( 'setState', deserializer.deserialize( urlParams.get( 'query' ) as string ) );
		};

		fetchi18n();
	},
	updated() {
		this.textDirection = getComputedStyle( document.getElementById( 'directionSample' ) as Element ).direction;
	},
	name: 'App',
	components: {
		QueryBuilder,
	},
} );
</script>

<style lang="scss">
@import '~ress';
@import '~@wmde/wikit-vue-components/dist/wikit-vue-components.css';
</style>
