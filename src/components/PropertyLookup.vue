<template>
	<Lookup
		:value="value"
		@input="$emit( 'input', $event )"
		:error="error ? {message: $i18n(error.message), type: error.type} : null"
		:menu-items="searchResults"
		:search-input.sync="search"
		:placeholder="$i18n('query-builder-property-lookup-placeholder')"
		:label="$i18n('query-builder-property-lookup-label')"
		v-on:scroll="handleScroll"
	>
		<template
			v-slot:no-results
			v-i18n="{msg: 'query-builder-property-lookup-no-match-found'}"
		/>
	</Lookup>
</template>

<script lang="ts">
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import Vue, { PropType } from 'vue';

import { Lookup } from '@wmde/wikit-vue-components';
import SearchResult from '@/data-access/SearchResult';
import SearchOptions from '@/data-access/SearchOptions';

const NUMBER_OF_SEARCH_RESULTS = 12;

export default Vue.extend( {
	name: 'PropertyLookup',
	components: {
		Lookup,
	},
	data() {
		return {
			search: '',
			searchResults: [],
			topItemIndex: 1,
		};
	},
	methods: {
		handleScroll( event: number ): void {
			if ( this.topItemIndex <= event ) {
				this.topItemIndex += NUMBER_OF_SEARCH_RESULTS;

				const searchOptions: SearchOptions = {
					search: this.search,
					offset: this.topItemIndex,
					limit: NUMBER_OF_SEARCH_RESULTS,
				};

				this.searchPropertiesOnScroll( searchOptions );
			}
		},
		async searchPropertiesOnScroll( options: SearchOptions ): Promise<void> {
			const searchResults = await this.$store.dispatch( 'searchProperties', options );
			this.searchResults = this.searchResults.concat( searchResults );
		},
	},
	watch: {
		async search( newSearchString: string ): Promise<void> {
			if ( !newSearchString ) {
				return;
			}
			const searchOptions: SearchOptions = {
				search: newSearchString,
				limit: NUMBER_OF_SEARCH_RESULTS,
			};

			const searchResults = await this.$store.dispatch( 'searchProperties', searchOptions );
			this.searchResults = searchResults.map(
				( item: MenuItem & SearchResult ) => {
					item.tag = item.tag && this.$i18n( item.tag );
					return item;
				},
			);
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
