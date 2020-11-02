<template>
	<div class="querybuilder" role="main">
		<h1 class="querybuilder__heading">Simple Query Builder</h1>
		<p class="querybuilder__description">
			Welcome to the test system of the Simple Query Builder. Please note that this is a work in progress,
			not all features are included, and it can sometimes be broken.
			<a href="https://www.wikidata.org/wiki/Wikidata_talk:Improve_the_workflows_for_queries_and_lists/Simple_query_Builder">Feedback is welcome here.</a>
		</p>
		<div role="form">
			<h2 class="querybuilder__find-title">Find all items...</h2>
			<div class="querybuilder__rule">
				<TextInput
						class="querybuilder__rule__property"
						label="Property"
						:value="property.label"
						placeholder="Enter a property" />
				<TextInput
						class="querybuilder__rule__value"
						label="Value"
						ref="value"
						:value="textInputValue"
						@input="updateInputTextValue"
						placeholder="Enter a value" />
			</div>
			<div class="querybuilder__run">
				<Button @click.native="runQuery" type="primaryProgressive">Run query</Button>
			</div>
		</div>
		<QueryResult
				:encodedQuery="encodedQuery"
				:iframeRenderKey="iframeRenderKey"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import TextInput from '@wmde/wikit-vue-components/src/components/TextInput.vue';
import Button from '@wmde/wikit-vue-components/src/components/Button.vue';
import { mapState } from 'vuex';
import QueryResult from '@/components/QueryResult.vue';
import buildQuery from '@/sparql/buildQuery';

export default Vue.extend( {
	name: 'QueryBuilder',
	data() {
		return {
			encodedQuery: '',
			iframeRenderKey: 0
		};
	},
	methods: {
		updateInputTextValue( value: string ): void {
			this.$store.dispatch( 'updateValue', value );
		},
		runQuery(): void {
			this.encodedQuery = encodeURI( buildQuery( this.$store.getters.query ) );

			// force the iframe to rerender https://stackoverflow.com/a/48755228
			this.iframeRenderKey = Math.random();
		}
	},
	computed: {
		...mapState( {
			property: 'property',
			textInputValue: 'value'
		} )
	},
	components: {
		Button,
		TextInput,
		QueryResult
	}
} );
</script>

<style scoped lang="scss">
.querybuilder {
	padding-block: $dimension-spacing-xlarge;
	padding-inline: $dimension-spacing-xlarge;
}

.querybuilder__heading {
	font-family: $font-family-style-heading-serif;
	font-weight: $font-weight-style-h1;
	font-size: $font-size-style-h1;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
}

.querybuilder__description {
	font-family: $font-family-style-description;
	font-weight: $font-weight-style-description;
	font-size: $font-size-style-description;
	line-height: $font-line-height-style-description;
	color: $font-color-base;
}

.querybuilder__find-title {
	font-family: $font-family-style-heading-sans;
	font-weight: $font-weight-style-h4;
	font-size: $font-size-style-h4;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
	margin-block-start: $dimension-static-size-500;
}

.querybuilder__rule {
	display: flex;
	margin-block-start: $dimension-layout-medium;
	padding-block: $dimension-layout-xsmall;
	padding-inline: $dimension-layout-medium;
}

.querybuilder__rule__value {
	margin-inline-start: $dimension-layout-xsmall;
}

.querybuilder__run {
	margin-block-start: $dimension-layout-medium;
}
</style>
