<template>
	<div class="querybuilder" role="main">
		<h1 class="querybuilder__heading"><bdi id="directionSample"
			v-i18n="{msg: 'query-builder-heading'}" /></h1>
		<p class="querybuilder__description">
			Welcome to the test system of the Simple Query Builder. Please note that this is a work in progress,
			not all features are included, and it can sometimes be broken.
			<a href="https://w.wiki/kG$">Feedback is welcome here.</a>
		</p>
		<div role="form">
			<h2 class="querybuilder__find-title"
				v-i18n="{msg: 'query-builder-find-all-items'}" />
			<div v-if="!conditionRows.length"
				class="querybuilder__condition-placeholder"
				v-i18n="{msg: 'query-builder-condition-placeholder'}"
			/>
			<div
				class="querybuilder__condition-wrapper"
				v-for="(condition, index) in conditionRows"
				:key="condition.conditionId"
			>
				<QueryCondition
					:condition-index="index"
				/>
			</div>
			<AddCondition @add-condition="addCondition" />
			<Limit />
			<LabelOptout />
			<div class="querybuilder__run">
				<Button
					class="querybuilder__run-query-button"
					@click.native="runQuery"
					type="progressive"
					variant="primary"
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
import { ConditionRow } from '@/store/RootState';
import Vue from 'vue';
import { mapState } from 'vuex';
import { Button } from '@wmde/wikit-vue-components';

import QueryCondition from '@/components/QueryCondition.vue';
import QueryResult from '@/components/QueryResult.vue';
import buildQuery from '@/sparql/buildQuery';
import AddCondition from '@/components/AddCondition.vue';
import Limit from '@/components/Limit.vue';
import LabelOptout from '@/components/LabelOptout.vue';

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
		async runQuery(): Promise<void> {
			await this.$store.dispatch( 'validateForm' );
			this.incrementMetric( 'run-query-button' );
			if ( this.errors.length ) {
				return;
			}
			this.encodedQuery = encodeURI( buildQuery( this.$store.getters.query ) );

			// force the iframe to rerender https://stackoverflow.com/a/48755228
			this.iframeRenderKey = Math.random();
		},
		addCondition(): void {
			this.$store.dispatch( 'addCondition' );
		},
	},
	computed: {
		conditionRows(): ConditionRow[] {
			return this.$store.getters.conditionRows;
		},
		...mapState( {
			errors: 'errors',
		} ),
	},
	components: {
		Button,
		QueryResult,
		QueryCondition,
		AddCondition,
		Limit,
		LabelOptout,
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

$tinyViewportWidth: 36em;

.querybuilder {
	padding-block: $dimension-layout-small;
	padding-inline: $dimension-layout-small;

	@media (max-width: $tinyViewportWidth) {
		padding-block: $dimension-layout-xsmall;
		padding-inline: $dimension-layout-xsmall;
	}
}

.querybuilder__condition-wrapper {
	margin-block: $dimension-layout-xsmall;
	padding-block: $dimension-layout-xsmall;
	padding-inline: $dimension-layout-xsmall;
	background-color: $color-base-80; // maybe replace with an alias token?
	border: $border-width-thin $border-style-base $border-color-base-default;
	border-radius: $border-radius-base;

	@media (max-width: $tinyViewportWidth) {
		padding-block: $dimension-layout-xxsmall;
		padding-inline: $dimension-layout-xxsmall;
	}
}

.querybuilder__condition-placeholder {
	background-color: $background-color-neutral-default;
	margin-block: $dimension-layout-xsmall;
	padding-block: $dimension-layout-xsmall;
	text-align: center;
	border-radius: $border-radius-base;
	font-family: $font-family-style-description;
	font-weight: $font-weight-style-description;
	font-size: $font-size-style-description;
	line-height: $font-line-height-style-description;
}

.querybuilder__heading {
	font-family: $font-family-style-heading-serif;
	font-weight: $font-weight-style-h1;
	font-size: $font-size-style-h1;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
	margin-block-end: $dimension-layout-xxsmall;
}

.querybuilder__description {
	font-family: $font-family-style-description;
	font-weight: $font-weight-style-description;
	font-size: $font-size-style-description;
	line-height: $font-line-height-style-description;
	color: $font-color-base;
	max-width: 672px; // TODO: replace with token

	@media (max-width: 671px) {
		width: 100%;
	}
}

.querybuilder__find-title {
	font-family: $font-family-style-heading-sans;
	font-weight: $font-weight-style-h4;
	font-size: $font-size-style-h4;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
	margin-block-start: $dimension-layout-large;
}

.querybuilder__run {
	margin-block-start: $dimension-layout-medium;
}
</style>
