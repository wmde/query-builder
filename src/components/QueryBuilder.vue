<template>
	<div class="querybuilder">
		<main>
			<h1 class="querybuilder__heading">
				<bdi id="directionSample"
					v-i18n="{msg: 'query-builder-heading'}" />
			</h1>
			<p class="querybuilder__description"
				v-html="$i18n('query-builder-intro-text', 'https://w.wiki/FZy', 'https://w.wiki/kG$') " />
			<div role="form">
				<h2 class="querybuilder__query-title"
					v-html="$i18n('query-builder-query-heading')" />
				<p class="querybuilder__query-subtitle"
					v-i18n="{msg: 'query-builder-find-all-items'}" />
				<div v-if="!conditionRows.length"
					class="querybuilder__condition-placeholder"
					v-i18n="{msg: 'query-builder-condition-placeholder'}"/>
				<div
					v-for="(condition, index) in conditionRows"
					:key="condition.conditionId"
					:class="[
						'querybuilder__condition-group',
						(isAboveOr(index)) ? 'querybuilder__condition-group-above' : '',
					]"
				>
					<div
						:class="[
							'querybuilder__condition-wrapper',
							(index == 0) ? 'querybuilder__condition-wrapper-first' : '',
							((index + 1) == conditionRows.length) ? 'querybuilder__condition-wrapper-last' : '',
							(isBelowOr(index)) ? 'querybuilder__condition-wrapper-below' : '',
							(isAboveOr(index)) ? 'querybuilder__condition-wrapper-above' : '',
						]"
					><QueryCondition
						:condition-index="index"
					/></div>
					<ConditionRelationToggle
						v-if="(index + 1) !== conditionRows.length"
						:class="[
							'querybuilder__condition-relation-toggle',
							(isBelowOr(index + 1)) ? 'querybuilder__condition-relation-toggle-or' : '',
						]"
						:value="conditionRows[index + 1].conditionRelation"
						@set-relation-toggle="setConditionRelation($event, index)"
					/></div>
				<AddCondition @add-condition="addCondition" />
				<h2 class="querybuilder__setting-header"
					v-html="$i18n('query-builder-settings-heading')" />
				<div class="querybuilder__settings">
					<Limit />
					<LabelOptout />
				</div>
				<div class="querybuilder__run">
					<Button
						@click.native="runQuery"
						type="progressive"
						variant="primary"
						v-i18n="{msg: 'query-builder-run-query'}" />
					<SharableLink />
				</div>
			</div>
			<QueryResult
				:encodedQuery="encodedQuery"
				:iframeRenderKey="iframeRenderKey"
			/>
		</main>
		<Footer
			class="query-builder__footer"
		/>
	</div>
</template>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import { ConditionRow } from '@/store/RootState';
import Vue from 'vue';
import { mapState } from 'vuex';
import { Button } from '@wmde/wikit-vue-components';

import ConditionRelationToggle from '@/components/ConditionRelationToggle.vue';
import QueryCondition from '@/components/QueryCondition.vue';
import QueryResult from '@/components/QueryResult.vue';
import buildQuery from '@/sparql/buildQuery';
import AddCondition from '@/components/AddCondition.vue';
import Limit from '@/components/Limit.vue';
import LabelOptout from '@/components/LabelOptout.vue';
import ConditionRelation from '@/data-model/ConditionRelation';
import SharableLink from '@/components/SharableLink.vue';

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
		async addCondition(): Promise<void> {
			await this.$store.dispatch( 'addCondition' );
			setTimeout( () => {
				document
					.getElementsByClassName( 'querybuilder__condition-wrapper-last' )[ 0 ]
					.scrollIntoView( { behavior: 'smooth' } );

				const toggle = document
					.querySelectorAll( '.querybuilder__condition-relation-toggle .wikit-ToggleButton' );

				( toggle[ toggle.length - 1 ] as HTMLElement ).focus();
			} );
		},
		setConditionRelation( value: ConditionRelation, index: number ): void {
			this.$store.dispatch( 'setConditionRelation', { value, conditionIndex: index + 1 } );
		},
		isAboveOr( index: number ): boolean {
			return ( index + 1 ) !== this.conditionRows.length &&
          this.conditionRows[ index + 1 ].conditionRelation === ConditionRelation.Or;
		},
		isBelowOr( index: number ): boolean {
			return index !== 0 && this.conditionRows[ index ].conditionRelation === ConditionRelation.Or;
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
		ConditionRelationToggle,
		QueryResult,
		QueryCondition,
		AddCondition,
		Limit,
		LabelOptout,
		Footer,
		SharableLink,
	},
} );
</script>

<style lang="scss">
// TODO replace with link component once available
a {
	font-family: $wikit-Link-font-family;
	font-weight: $wikit-Link-font-weight;
	font-size: $wikit-Link-font-size;
	line-height: $wikit-Link-line-height;
	color: $wikit-Link-font-color;
	transition: $transition-interaction-link-property $transition-interaction-link-duration;

	&:active {
		color: $font-color-progressive-active;
	}

	&:visited {
		color: $wikit-Link-visited-font-color;
	}
}

$tinyViewportWidth: 38em;

/*
 * This is a rough approximation. by using a screen size emulator,
 * we can see the width where all items are aligned.
 */
$largeViewportWidth: 90em; //~1438px

.querybuilder {
	padding-block: $dimension-layout-small;
	padding-inline: $dimension-layout-small;

	@media (max-width: $tinyViewportWidth) {
		padding-block: $dimension-layout-xsmall;
		padding-inline: $dimension-layout-xsmall;
	}

	@media (min-width: $largeViewportWidth) {
		// set maximum width of the page
		max-width: $largeViewportWidth;
		margin-block: auto;
		margin-inline: auto;
	}
}

.querybuilder__condition-wrapper {
	margin-block: $dimension-layout-xsmall;
	padding-block: $dimension-layout-xsmall;
	padding-inline: $dimension-layout-xsmall;
	background-color: $background-color-neutral-default;
	border: $border-width-thin $border-style-base $border-color-base-subtle;
	border-radius: $border-radius-base;

	@media (max-width: $tinyViewportWidth) {
		padding-block: $dimension-layout-xxsmall;
		padding-inline: $dimension-layout-xxsmall;
	}

	&.querybuilder__condition-wrapper-first {
		margin-block-start: 0;
	}
}

.querybuilder__condition-wrapper-below {
	margin-block-start: 0;
	border-block-start: none;
}

.querybuilder__condition-wrapper-above {
	margin-block-end: 0;
	border-inline: none;
	border-block-end: none;
}

.querybuilder__condition-group-above {
	border-inline: $border-width-thin $border-style-base $border-color-base-subtle;
	background-color: $background-color-neutral-default;
}

.querybuilder__condition-relation-toggle-or {
	padding-inline-start: $dimension-layout-xsmall;
}

.querybuilder__condition-relation-toggle {
	padding-block: $dimension-layout-xsmall;
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

	// Arabic scripts should use sans fonts (T270111).
	[lang=fa] &,
	[lang=ar] & {
		font-family: $font-family-style-heading-sans;
	}
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

.querybuilder__query-title {
	font-family: $font-family-style-heading-sans;
	font-weight: $font-weight-style-h4;
	font-size: $font-size-style-h4;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
	margin-block-start: $dimension-layout-large;
}

.querybuilder__query-subtitle {
	font-family: $font-family-style-description;
	font-weight: $font-weight-style-description;
	font-size: $font-size-style-description;
	line-height: $font-line-height-style-description;
	color: $font-color-base;
	margin-block-start: $dimension-layout-xsmall;
	margin-block-end: $dimension-layout-xxsmall;
}

.querybuilder__setting-header {
	font-family: $font-family-style-heading-sans;
	font-weight: $font-weight-style-h4;
	font-size: $font-size-style-h4;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
	margin-block-start: $dimension-layout-medium;
}

.querybuilder__settings {
	background-color: $background-color-neutral-default;
	border-radius: $border-radius-base;
	border-color: $border-color-base-transparent;
	margin-block-start: $dimension-layout-xxsmall;
	padding-block: $dimension-layout-xsmall;
	padding-inline: $dimension-layout-xsmall;
}

.querybuilder__run {
	font-family: $font-family-style-heading-sans;
	font-weight: $font-weight-style-h4;
	font-size: $font-size-style-h4;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
	margin-block-start: $dimension-layout-medium;

	& button {
		@media (max-width: $tinyViewportWidth) {
			width: 100%;
		}
	}
}

.query-builder__footer {
	margin-block-start: $dimension-layout-large;
}
</style>
