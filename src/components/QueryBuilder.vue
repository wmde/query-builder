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
				placeholder="Enter a property" />
			<TextInput
				class="querybuilder__rule__value"
				label="Value"
				placeholder="Enter a value" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import TextInput from '@wmde/wikit-vue-components/src/components/TextInput.vue';

export default Vue.extend( {
	name: 'QueryBuilder',
	components: { TextInput }
} );
</script>

<style scoped lang="scss">
.querybuilder {
	padding: $dimension-spacing-xlarge;
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
	margin-top: $dimension-static-size-500;
}

.querybuilder__rule {
	display: flex;
	margin-top: $dimension-layout-medium;
	padding: $dimension-layout-xsmall $dimension-layout-medium;
}

.querybuilder__rule__value {
	margin-left: $dimension-layout-xsmall;
}
</style>
