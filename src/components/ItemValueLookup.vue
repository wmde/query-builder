<template>
	<EntityLookup
		:value="value"
		@input="$emit( 'input', $event )"
		:error="error"
		:searchForMenuItems="searchForItems"
		:label="$i18n('query-builder-input-value-label')"
		:tooltip="$i18n('query-builder-input-value-tooltip')"
		:placeholder="$i18n('query-builder-input-value-placeholder')"
		:no-match-found-message="$i18n('query-builder-item-value-lookup-no-match-found')"
		:disabled="disabled"
	/>
</template>

<script lang="ts">
import EntityLookup from '@/components/EntityLookup.vue';
import SearchOptions from '@/data-access/SearchOptions';
import SearchResult from '@/data-access/SearchResult';
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import Vue, { PropType } from 'vue';

export default Vue.extend( {
	name: 'ItemValueLookup',
	components: {
		EntityLookup,
	},
	methods: {
		searchForItems( options: SearchOptions ): Promise<SearchResult[]> {
			return this.$store.dispatch( 'searchItemValues', options );
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
		disabled: {
			type: Boolean,
			default: false,
		},
	},
} );
</script>
