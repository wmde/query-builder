<template>
	<div id="app" :lang="lang" dir="textDirection">
		<QueryBuilder v-if="isi18nLoaded"/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import QueryBuilder from '@/components/QueryBuilder.vue';
import i18n from 'vue-banana-i18n';
import services from '@/ServicesFactory';

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
			this.textDirection = getComputedStyle( document.getElementById( 'app' ) as Element ).direction;
		};

		fetchi18n();
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
