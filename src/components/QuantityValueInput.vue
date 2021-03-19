<template>
	<QuantityInput
		:label="$i18n('query-builder-quantity-value-label')"
		@input="$emit('input', $event)"
		:numberInputValue="numberInputValue"
		:error="error ? {message: $i18n(error.message), type: error.type} : null"
		:numberInputPlaceholder="$i18n('query-builder-quantity-value-number-input-placeholder')"
		:unitLookupPlaceholder="$i18n('query-builder-quantity-value-unit-lookup-input-placeholder')"
		:unitLookupLabel="$i18n('query-builder-quantity-value-unit-lookup-label')"
		:unitLookupMenuItems="searchResults"
		:unitLookupSearchInput.sync="search"
		:disabled="disabled"
		v-on:scroll="handleScroll"
	/>
</template>

<script lang="ts">

import { QuantityInput } from '@wmde/wikit-vue-components';
import Vue from 'vue';
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import SearchOptions from '@/data-access/SearchOptions';
import SearchResult from '@/data-access/SearchResult';
import debounce from 'lodash/debounce';

const NUMBER_OF_SEARCH_RESULTS = 12;

export default Vue.extend( {
	name: 'QuantityValueInput',
	data() {
		return {
			search: '',
			searchResults: [] as MenuItem[],
			topItemIndex: 1,
			numberInputValue: this.value.toString(),
			debouncedUpdateMenuItems: null as Function | null,
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
			const searchResults = await this.searchForItems( searchOptions );
			return searchResults.map(
				( item: MenuItem & SearchResult ) => {
					item.tag = item.tag && this.$i18n( item.tag );
					return item;
				},
			);
		},
		searchForItems( options: SearchOptions ): Promise<SearchResult[]> {
			return this.$store.dispatch( 'searchItemValues', options );
		},
		updateMenuItems( searchOptions: SearchOptions ): void {
			if ( this.debouncedUpdateMenuItems === null ) {
				this.debouncedUpdateMenuItems = debounce(
					async ( debouncedSearchOptions: SearchOptions ) => {
						this.searchResults = await this.searchForItems( debouncedSearchOptions );
					},
					150,
				);
			}
			this.debouncedUpdateMenuItems( searchOptions );
		},
	},
	watch: {
		disabled( isDisabled: boolean ): void {
			if ( isDisabled ) {
				this.search = '';
			}
		},
		search( newSearchString: string ): void {
			this.topItemIndex = 0;
			if ( !newSearchString ) {
				this.searchResults = [];
				return;
			}
			const searchOptions: SearchOptions = {
				search: newSearchString,
				limit: NUMBER_OF_SEARCH_RESULTS,
			};
			this.updateMenuItems( searchOptions );
		},
	},
	props: {
		value: {
			type: Number,
			default: null,
		},
		error: {
			type: Object,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		QuantityInput,
	},
} );
</script>
