<template>
	<Lookup
		:value="value"
		@input="$emit( 'input', $event )"
		:error="error"
		:menu-items="searchResults"
		:search-input.sync="search"
		:placeholder="placeholder"
		:label="label"
		v-on:scroll="handleScroll"
	>
		<template
			v-slot:no-results
		>{{ noMatchFoundMessage }}</template>
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
	name: 'EntityLookup',
	components: {
		Lookup,
	},
	data() {
		return {
			search: '',
			searchResults: [] as MenuItem[],
			topItemIndex: 1,
		};
	},
	methods: {
		async handleScroll( event: number ): Promise<void> {
			if ( this.topItemIndex <= event ) {
				this.topItemIndex += NUMBER_OF_SEARCH_RESULTS;

				const searchOptions: SearchOptions = {
					search: this.search,
					offset: this.topItemIndex,
					limit: NUMBER_OF_SEARCH_RESULTS,
				};

				this.searchResults = this.searchResults.concat(
					await this.searchEntities( searchOptions ),
				);
			}
		},
		async searchEntities( searchOptions: SearchOptions ): Promise<SearchResult[]> {
			const searchResults = await this.searchForMenuItems( searchOptions );
			return searchResults.map(
				( item: MenuItem & SearchResult ) => {
					item.tag = item.tag && this.$i18n( item.tag );
					return item;
				},
			);
		},
	},
	watch: {
		async search( newSearchString: string ): Promise<void> {
			this.topItemIndex = 0;
			if ( !newSearchString ) {
				return;
			}
			const searchOptions: SearchOptions = {
				search: newSearchString,
				limit: NUMBER_OF_SEARCH_RESULTS,
			};
			this.searchResults = await this.searchEntities( searchOptions );
		},
	},
	props: {
		searchForMenuItems: {
			type: Function as PropType<( searchOptions: SearchOptions ) => Promise<SearchResult[]>>,
			required: true,
		},
		value: {
			type: Object as PropType<MenuItem>,
			default: null,
		},
		error: {
			type: Object,
			default: null,
		},
		label: {
			type: String,
			required: true,
		},
		noMatchFoundMessage: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
} );
</script>
