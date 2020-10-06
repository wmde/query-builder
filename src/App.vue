<template>
	<div id="app">
		<QueryBuilder/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import QueryBuilder from '@/components/QueryBuilder.vue';
import store from '@/store';

export default Vue.extend( {
	name: 'App',
	components: {
		QueryBuilder
	},
	store
} );
</script>

<style lang="scss">
@import '~ress';
</style>
