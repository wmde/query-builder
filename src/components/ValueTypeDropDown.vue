<template>
	<select class="querybuilder__dropdown">
		<option
			class="querybuilder__dropdown-option"
			v-for="(optionItem, index) in optionItems"
			:value="optionItem.value"
			:key="index"
			@click="$emit( 'input', optionItem.value )"
		>
			{{ optionItem.value }}
		</option>
	</select>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'ValueTypeDropDown',
	data() {
		return {
			selected: null,
			optionItems: [
				{ value: 'matching' },
				{ value: 'regardless of value' },
				{ value: 'without' },
			],
		};
	},
	props: {
		value: {
			type: String,
			default: null,
		},
	},
} );
</script>
<style scoped lang="scss">
	// will be removed once dropdown component is implemented in the DS
	.querybuilder__dropdown {
		width: 256px;
		height: 32px;
		margin-inline-start: $dimension-layout-xsmall;
		margin-block-start: 23px;
		border-color: #a2a9b1;
		border-style: solid;
		border-width: 1px;
		border-radius: 2px;
		appearance: auto;
	}
</style>
