<template>
	<div id="app" :lang="lang" dir="auto">
		<QueryBuilder v-if="isi18nLoaded"/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import QueryBuilder from '@/components/QueryBuilder.vue';
import i18n from 'vue-banana-i18n';

export default Vue.extend( {
	data() {
		return {
			isi18nLoaded: false as boolean,
			lang: 'en' as string,
		};
	},
	created(): void {
		const fetchi18n = async (): Promise<void> => {
			const urlParams = new URLSearchParams( window.location.search );
			if ( urlParams.has( 'uselang' ) ) {
				this.lang = urlParams.get( 'uselang' ) as string;
			}

			const responseEn = await fetch( 'i18n/en.json' );
			const messages: { [key: string]: { [key: string]: string} } = {
				en: await responseEn.json(),
			};

			if ( this.lang !== 'en' ) {
				const responseLang = await fetch( 'i18n/' + this.lang + '.json' ).catch(
					() => {
						// TODO: Show a user-facing notification instead
						console.warn( 'The language requested could not be retrieved, falling back to English' );
						messages[ this.lang ] = {};
					},
				) as Response;
				if ( responseLang.ok ) {
					try {
						messages[ this.lang ] = await responseLang.json();
					} catch ( e ) {
						console.warn( 'The language requested does not exist, falling back to English' );
					}
				}
			}

			Vue.use( i18n, {
				locale: this.lang,
				messages,
				wikilinks: true,
			} );
			this.isi18nLoaded = true;
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
