<template>
	<div id="app">
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
		};
	},
	beforeCreate(): void {
		const fetchi18n = async (): Promise<void> => {
			const response = await fetch( 'i18n/en.json' );
			const messages = {
				en: await response.json(),
			};
			Vue.use( i18n, {
				locale: 'en',
				messages,
				wikilinks: true,
			} );
			// TODO: Fix the typing warning
			( this as any ).isi18nLoaded = true;
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
