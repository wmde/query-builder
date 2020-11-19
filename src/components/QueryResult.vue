<template>
	<div class="querybuilder__result">
		<div v-if="errors.length !== 0" class="querybuilder__result__errors">
			<div v-for="(error, index) in errors" :class="error.type" :key="index">
				{{ $i18n(error.message) }}
			</div>
		</div>
		<div v-else-if="encodedQuery.length === 0" class="querybuilder__result__description">
			{{ $i18n('query-builder-result-placeholder')}}
		</div>
		<!-- TODO use global config variables instead of hardcoding the url-->
		<iframe
			v-else
			:src="'https://query.wikidata.org/embed.html#' + encodedQuery"
			:key="iframeRenderKey"
			class="querybuilder__result__iframe"
			referrerpolicy="origin"
			sandbox="allow-scripts allow-same-origin allow-popups">
		</iframe>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend( {
	name: 'QueryResult',
	props: {
		encodedQuery: {
			type: String,
		},
		iframeRenderKey: {
			type: Number,
		},
	},
	methods: {
		updateInputTextValue( value: string ): void {
			this.$store.dispatch( 'updateValue', value );
		},
	},
	computed: {
		...mapState( {
			property: 'property',
			textInputValue: 'value',
			errors: 'errors',
		} ),
	},
} );
</script>

<style scoped lang="scss">
	.querybuilder__result {
		margin-block-start: $dimension-layout-small;
	}

	.querybuilder__result__description {
		padding-block: $dimension-spacing-xxlarge;
		font-size: $font-size-style-description;
		font-family: $font-family-style-description;
		color: $font-color-subtle;
		font-weight: $font-weight-style-description;
		line-height: $font-line-height-style-description;
		text-align: center;
	}

	.querybuilder__result__iframe {
		width: $dimension-width-full;
		border: none;
		height: 95vh;
	}
</style>
