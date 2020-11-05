<template>
	<div id="app">
		<QueryBuilder/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import QueryBuilder from '@/components/QueryBuilder.vue';

export default Vue.extend( {
	name: 'App',
	components: {
		QueryBuilder
	},
} );
</script>

<style lang="scss">
@import '~ress';
</style>
