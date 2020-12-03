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
			scrollpropertiesSearchResults: [],
			searchOptions: {} as SearchOptions,
		};
	},
	methods: {
		handleScroll( event: number ): void {
			if ( event <= this.topItemIndex ) {
				this.searchOptions.search = this.search;
				this.searchOptions.offset = this.topItemIndex;

				this.searchPropertiesOnScroll( this.searchOptions );
				this.searchResults = this.searchResults.concat( this.scrollpropertiesSearchResults );
				this.topItemIndex += 13;
			}
		},
		async searchPropertiesOnScroll( options: SearchOptions ): Promise<void> {
			this.scrollpropertiesSearchResults = await this.$store.dispatch( 'searchProperties', options );
		},
	},
	watch: {
		async search( newSearchString: string ): Promise<void> {
			this.searchOptions.search = newSearchString;
			const searchResults = await this.$store.dispatch( 'searchProperties', this.searchOptions );
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
