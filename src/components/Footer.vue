<template>
	<footer class="querybuilder-footer">
		<p>
			Made by the Wikimedia Deutschland Wikidata team.
			Licensed under <a href="https://github.com/wmde/query-builder/blob/master/LICENSE">BSD 3-Clause License</a>.
			<a href="https://github.com/wmde/query-builder">View Source</a>.
		</p>
		<p class="querybuilder-footer__build-info" v-if="buildTime && commitLink">
			Last build at {{ buildTime }} from <span v-html="commitLink" />.
		</p>
	</footer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'Footer',
	computed: {
		buildTime(): string | false {
			const buildDate = new Date();
			if ( !process.env.VUE_APP_BUILD_TIME ) {
				return false;
			}
			buildDate.setTime( parseInt( process.env.VUE_APP_BUILD_TIME ) );
			return buildDate.toUTCString();
		},
		commitLink(): string | false {
			const commitHash = process.env.VUE_APP_GIT_COMMIT;
			if ( !commitHash ) {
				return false;
			}
			return `<a href="https://github.com/wmde/query-builder/commit/${commitHash}">${commitHash}</a>`;
		},
	},
} );
</script>

<style lang="scss">
.querybuilder-footer {
	font-family: $font-family-style-description;
	font-weight: $font-weight-style-description;
	font-size: $font-size-style-description;
	line-height: $font-line-height-style-description;
	color: $font-color-base;
}
</style>
