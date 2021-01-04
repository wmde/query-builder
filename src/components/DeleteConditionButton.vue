<template>
	<Button
		class="delete-condition-button"
		type="primaryDestructive"
		@click.native="$emit('click')"
		:disabled="disabled"
	> Trash
	</Button>
</template>

<script lang="ts">
import { Button } from '@wmde/wikit-vue-components';
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
	},
} );
</script>
