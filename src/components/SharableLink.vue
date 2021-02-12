<template>
	<span class="querybuilder__sharable-link">
		{{ $i18n('query-builder-sharable-link-text') }}
		<Popover
			:reactToHover="false"
			position="end"
		>
			<template v-slot:target>
				<Button
					variant="normal"
					type="neutral"
					iconOnly
					@click.native="copyTextToClipboard"
					aria-label="Sharable link">
					<Icon type="link" size="medium" />
				</Button>
			</template>
			<template v-slot:default>
				{{ $i18n('query-builder-sharable-link-message') }}
			</template>
		</Popover>
	</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Icon, Button, Popover } from '@wmde/wikit-vue-components';
import QuerySerializer from '@/serialization/QuerySerializer';

export default Vue.extend( {
	name: 'SharableLink',
	components: {
		Icon,
		Button,
		Popover,
	},
	data: function () {
		return {
			href: '' as string,
		};
	},
	methods: {
		async copyTextToClipboard(): Promise<void> {
			const querySerializer = new QuerySerializer();
			const serializedQuery = querySerializer.serialize( this.$store.state );
			const current = new URL( window.location.href );
			current.searchParams.set( 'query', serializedQuery );
			this.href = current.href;
			try {
				await navigator.clipboard.writeText( current.href );
			} catch ( err ) {
				// The code might run in a context that doesn't have a clipboard API (like test).
				// Ignore and pass.
			}
		},
	},
} );
</script>

<style scoped lang="scss">
$tinyViewportWidth: 36em;

.querybuilder__sharable-link {
	font-family: $font-family-style-description;
	font-weight: $font-weight-style-description;
	font-size: $font-size-style-description;
	line-height: $font-line-height-style-description;
	margin-inline-start: $dimension-layout-xsmall;

	@media (max-width: $tinyViewportWidth) {
		margin-inline-start: 0;

		& button {
			margin-block-start: $dimension-layout-xxsmall;
		}
	}
}
</style>
