<template>
	<Lookup
		:value="value"
		@input="$emit( 'input', $event )"
		:error="error"
		:menu-items="searchResults"
		:search-input.sync="search"
		placeholder="Enter a property"
		label="خاصیت"
	>
		<template v-slot:no-results>
			No match was found
		</template>
	</Lookup>
</template>

<script lang="ts">
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import Vue, { PropType } from 'vue';

import { Lookup } from '@wmde/wikit-vue-components';

export default Vue.extend( {
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
			this.searchResults = await this.$store.dispatch( 'searchProperties', newSearchString );
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
