<template>
	<div class="querybuilder" role="main">
		<h1 class="querybuilder__heading">سازنده کوئری ساده</h1>
		<p class="querybuilder__description">
			به سامانه تست سازنده کوئری خوش‌آمدید. توجه کنید که این یک پروژه در حال پیشرفت است و خیلی چیزها هنوز کار نمی‌کند.
			<a href="https://w.wiki/kG$">بازخورد مزید امتنان خواهد بود</a>
		</p>
		<div role="form">
			<h2 class="querybuilder__find-title">یافتن همه آیتم‌هایی که...</h2>
			<div class="querybuilder__rule">
				<PropertyLookup
					v-model="selectedProperty"
					:error="fieldErrors.property"
				/>
				<TextInput
					class="querybuilder__rule__value"
					label="مقدار"
					ref="value"
					v-model="textInputValue"
					:error="fieldErrors.value"
					placeholder="یک مقدار وارد کنید" />
			</div>
			<div class="querybuilder__run">
				<Button @click.native="runQuery" type="primaryProgressive">راندن کوئری</Button>
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
import QueryResult from '@/components/QueryResult.vue';
import SearchResult from '@/data-access/SearchResult';
import Property from '@/data-model/Property';
import Error from '@/data-model/Error';
import buildQuery from '@/sparql/buildQuery';

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
		validate(): boolean {
			this.errors = [];
			this.$store.dispatch( 'setErrors', [] );
			if ( !this.selectedProperty && !this.textInputValue ) {
				this.errors.push( {
					// eslint-disable-next-line max-len
					message: 'کوئری شما خالی است. لطفا نحو دیگری انجام دهید',
					type: 'notice',
				} );
				return false;
			}

			if ( !this.selectedProperty || !this.textInputValue ) {
				if ( !this.selectedProperty ) {
					this.fieldErrors.property = {
						message: 'لطفا یک خاصیت انتخاب کنید',
						type: 'error',
					};
				}
				if ( !this.textInputValue ) {
					this.fieldErrors.value = {
						message: 'لطفا یک مقدار وارد کنید',
						type: 'error',
					};
				}
				this.errors.push( {
					message: 'بخشی از ورودی کامل نیست. لطفا آن را کامل کنید',
					type: 'error',
				} );
				return false;
			}
			return true;
		},
		runQuery(): void {
			const isValid = this.validate();
			if ( !isValid ) {
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
