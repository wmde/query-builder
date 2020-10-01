<template>
	<div class="querybuilder">
		<h1 class="querybuilder__heading">Simple Query Builder</h1>
		<p class="querybuilder__description">
			Short explanatory text that also manages expectations. Short explanatory text that also
			manages expectations.
		</p>
		<h2 class="querybuilder__find-title">Find all items...</h2>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'QueryBuilder'
} );
</script>

<style scoped lang="scss">
@import '~@wmde/wikit-tokens/dist/variables';

.querybuilder {
	position: relative;
	width: 1024px;
	height: 349px;
	padding: 40px;  // $dimension-spacing-xlarge
}

.querybuilder__heading {
	font-family: $font-family-style-heading-serif;
	font-weight: $font-weight-style-h1;
	font-size: $font-size-style-h1;
	line-height: $font-line-height-style-heading;
	display: flex;
	align-items: center;

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
	font-family: $font-family-style-heading-serif;
	font-weight: $font-weight-style-h4;
	font-size: $font-size-style-h4;
	line-height: $font-line-height-style-heading;
	color: $font-color-base;
	margin-top: $dimension-static-size-500;
}
</style>
