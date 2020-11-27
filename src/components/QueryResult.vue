<template>
	<div class="querybuilder__result">
		<div v-if="errors.length !== 0" class="querybuilder__result__errors">
			<Message
				v-for="(error, index) in errors" :type="error.type" :key="index">
				<span>{{$i18n(error.message)}}</span>
			</Message>
		</div>
		<div v-else-if="encodedQuery.length === 0" class="querybuilder__result__description">
			{{ $i18n('query-builder-result-placeholder')}}
		</div>
		<iframe
			v-else
			:src="queryServiceEmbedUrl + '#' + encodedQuery"
			:key="iframeRenderKey"
			class="querybuilder__result__iframe"
			referrerpolicy="origin"
			sandbox="allow-scripts allow-same-origin allow-popups">
		</iframe>
	</div>
</template>

<script lang="ts">
import { Message } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend( {
	name: 'QueryResult',
	data() {
		return {
			queryServiceEmbedUrl: process.env.VUE_APP_QUERY_SERVICE_EMBED_URL,
		};
	},
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
	components: {
		Message,
	},
} );
</script>

<style lang="scss">
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
