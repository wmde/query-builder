<template>
	<div class="querybuilder">
		<h1 class="querybuilder__heading">Simple Query Builder</h1>
		<p class="querybuilder__description">
			Short explanatory text that also manages expectations. Short explanatory text that also
			manages expectations.
		</p>
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
</template>

<script lang="ts">
import Vue from 'vue';
import TextInput from '@wmde/wikit-vue-components/src/components/TextInput.vue';
import Button from '@wmde/wikit-vue-components/src/components/Button.vue';
import { mapState } from 'vuex';
import buildQuery from '@/sparql/buildQuery';

export default Vue.extend( {
	name: 'QueryBuilder',
	methods: {
		updateInputTextValue( value: string ): void {
			this.$store.dispatch( 'updateValue', value );
		},
		runQuery(): void {
			console.log( buildQuery(
				this.$store.getters.query
			) );
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
		TextInput
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
