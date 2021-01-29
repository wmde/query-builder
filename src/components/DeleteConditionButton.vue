<template>
	<Button
		iconOnly
		class="delete-condition-button"
		type="neutral"
		variant="quiet"
		:aria-label="$i18n('query-builder-delete-condition')"
		@click.native="$emit('click')"
		:disabled="disabled"
	> <Icon type="trash" size="large" color="inherit" class="delete-condition-button__icon"/>
	</Button>
</template>

<script lang="ts">
import { Button, Icon } from '@wmde/wikit-vue-components';
import Vue from 'vue';
export default Vue.extend( {
	name: 'DeleteConditionButton',
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		Button,
		Icon,
	},
} );
</script>

<style lang="scss">
	.delete-condition-button__icon {
		vertical-align: top;
	}
</style>
