<template>
	<Lookup
		:value="value"
		@input="$emit( 'input', $event )"
		:error="error ? {message: $i18n(error.message), type: error.type} : null"
		:menu-items="searchResults"
		:search-input.sync="search"
		:placeholder="$i18n('query-builder-property-lookup-placeholder')"
		:label="$i18n('query-builder-property-lookup-label')"
	>
		<template
			v-slot:no-results
			v-i18n="{msg: 'query-builder-property-lookup-no-match-found'}"
		/>
	</Lookup>
</template>

<script lang="ts">
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import Vue, { PropType, VueConstructor } from 'vue';

import { Lookup } from '@wmde/wikit-vue-components';
import allowedDatatypes from '@/allowedDataTypes';
import SearchResult from '@/data-access/SearchResult';

export default ( Vue as VueConstructor<Vue & { $i18n: ( i: string ) => string }> ).extend( {
	name: 'PropertyLookup',
	components: {
		Lookup,
	},
	data() {
		return {
			search: '',
			searchResults: [],
		};
	},
	watch: {
		async search( newSearchString: string ): Promise<void> {
			const searchResults = await this.$store.dispatch( 'searchProperties', newSearchString );
			this.searchResults = searchResults.map( ( key: MenuItem & SearchResult ) => {
				if ( !allowedDatatypes.includes( key.datatype ) ) {
					key.tag = this.$i18n( 'query-builder-property-lookup-limited-support-tag' );
				}
				return key;
			} );
		},
	},
	props: {
		value: {
			type: Object as PropType<MenuItem>,
			default: null,
		},
		error: {
			type: Object,
			default: null,
		},
	},
} );
</script>
