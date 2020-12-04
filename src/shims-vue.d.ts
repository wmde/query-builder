declare module '*.vue' {
	import Vue from 'vue';

	declare module 'vue/types/vue' {
		interface Vue {
			$i18n: ( msg: string ) => string;
		}
	}

	export default Vue;
}

declare module 'vue-banana-i18n';
