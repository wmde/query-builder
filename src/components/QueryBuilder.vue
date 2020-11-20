<template>
	<div class="querybuilder" role="main">
		<h1 class="querybuilder__heading"
			v-i18n="{msg: 'query-builder-heading'}" />
		<p class="querybuilder__description">
			Welcome to the test system of the Simple Query Builder. Please note that this is a work in progress,
			not all features are included, and it can sometimes be broken.
			<a href="https://w.wiki/kG$">Feedback is welcome here.</a>
		</p>>
		<div role="form">
			<h2 class="querybuilder__find-title"
				v-i18n="{msg: 'query-builder-find-all-items'}" />
			<div class="querybuilder__rule">
				<PropertyLookup
					v-model="selectedProperty"
					:error="fieldErrors.property"
				/>
				<ValueTypeDropDown
					v-model="selectedPropertyValueRelation"
				/>
				<TextInput
					class="querybuilder__rule__value"
					:label="$i18n('query-builder-input-value-label')"
					ref="value"
					v-model="textInputValue"
					:error="fieldErrors.value ?
						{message: $i18n(fieldErrors.value.message), type: fieldErrors.value.type}: null"
					:placeholder="$i18n('query-builder-input-value-placeholder')" />
			</div>
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
import { Button, TextInput } from '@wmde/wikit-vue-components';

import PropertyLookup from '@/components/PropertyLookup.vue';
import ValueTypeDropDown from '@/components/ValueTypeDropDown.vue';
import QueryResult from '@/components/QueryResult.vue';
import SearchResult from '@/data-access/SearchResult';
import Property from '@/data-model/Property';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';
import buildQuery from '@/sparql/buildQuery';
import Validator from '@/form/Validator';

export default Vue.extend( {
	name: 'QueryBuilder',
	data() {
		return {
			encodedQuery: '',
			iframeRenderKey: 0,
			fieldErrors: {
				property: null as null | Error,
				value: null as null | Error,
			},
		};
	},
	methods: {
		validate(): void {
			const formValues = {
				property: this.selectedProperty,
				value: this.textInputValue,
				relation: this.selectedPropertyValueRelation,
			};
			const validator = new Validator( formValues );
			const validationResult = validator.validate();
			this.errors = validationResult.formErrors;
			this.$store.dispatch( 'setErrors', validationResult.formErrors );
			this.fieldErrors = validationResult.fieldErrors;
		},
		runQuery(): void {
			this.validate();
			if ( this.errors.length ) {
				return;
			}
			this.encodedQuery = encodeURI( buildQuery( this.$store.getters.query ) );

			// force the iframe to rerender https://stackoverflow.com/a/48755228
			this.iframeRenderKey = Math.random();
		},
	},
	computed: {
		selectedProperty: {
			get(): Property | null {
				return this.$store.getters.property;
			},
			set( selectedProperty: SearchResult ): void {
				this.$store.dispatch( 'updateProperty', selectedProperty );
			},
		},
		selectedPropertyValueRelation: {
			get(): PropertyValueRelation {
				return this.$store.getters.propertyValueRelation;
			},
			set( selectedPropertyValueRelation: string ): void {
				this.$store.dispatch( 'updatePropertyValueRelation', selectedPropertyValueRelation );
			},
		},
		textInputValue: {
			get(): string { return this.$store.getters.value; },
			set( value: string ): void { this.$store.dispatch( 'updateValue', value ); },
		},
		...mapState( {
			errors: 'errors',
		} ),
	},
	components: {
		Button,
		TextInput,
		QueryResult,
		PropertyLookup,
		ValueTypeDropDown,
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
