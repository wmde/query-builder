<template>
	<div class="querybuilder" role="main">
		<h1 class="querybuilder__heading"
			v-i18n="{msg: 'query-builder-heading'}" />
		<p class="querybuilder__description">
			Welcome to the test system of the Simple Query Builder. Please note that this is a work in progress,
			not all features are included, and it can sometimes be broken.
			<a href="https://w.wiki/kG$">Feedback is welcome here.</a>
		</p>
		<div role="form">
			<h2 class="querybuilder__find-title"
				v-i18n="{msg: 'query-builder-find-all-items'}" />
			<QueryCondition/>
			<div class="querybuilder__run">
				<Button
					@click.native="runQuery"
					type="primaryProgressive"
					v-i18n="{msg: 'query-builder-run-query'}" />
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
import { mapState } from 'vuex';
import { Button } from '@wmde/wikit-vue-components';

import QueryCondition from '@/components/QueryCondition.vue';
import QueryResult from '@/components/QueryResult.vue';
import buildQuery from '@/sparql/buildQuery';
import Validator from '@/form/Validator';

export default Vue.extend( {
	name: 'QueryBuilder',
	data() {
		return {
			encodedQuery: '',
			iframeRenderKey: 0,
		};
	},
	created() {
		this.incrementMetric( 'main-page-loaded' );
	},
	methods: {
		incrementMetric( metric: string ): void {
			this.$store.dispatch( 'incrementMetric', metric );
		},
		validate(): void {
			// TODO: Clean up FormValue <-> Query relation
			const formValues = {
				property: this.$store.getters.query.condition.propertyId,
				value: this.$store.getters.query.condition.value,
				propertyValueRelation: this.$store.getters.query.condition.propertyValueRelation,
			};
			const validator = new Validator( formValues );
			const validationResult = validator.validate();
			this.errors = validationResult.formErrors;
			this.$store.dispatch( 'setErrors', validationResult.formErrors );

		},
		runQuery(): void {
			this.validate();
			this.incrementMetric( 'run-query-button' );
			if ( this.errors.length ) {
				return;
			}
			this.encodedQuery = encodeURI( buildQuery( this.$store.getters.query ) );

			// force the iframe to rerender https://stackoverflow.com/a/48755228
			this.iframeRenderKey = Math.random();
		},
	},
	computed: {
		...mapState( {
			errors: 'errors',
		} ),
	},
	components: {
		Button,
		QueryResult,
		QueryCondition,
	},
} );
</script>

<style scoped lang="scss">
// TODO replace with link component once available
a {
	font-family: $font-family-style-link;
	font-style: $font-size-style-link;
	font-weight: $font-weight-style-link;
	font-size: $font-size-style-link;
	line-height: $font-line-height-style-link;
	color: $font-color-link-default;

	&:visited {
		color: $font-color-link-visited;
	}
}

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

.querybuilder__run {
	margin-block-start: $dimension-layout-medium;
}
</style>
