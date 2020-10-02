module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: '@import "~@wmde/wikit-tokens/dist/variables";'
			}
		}
	}
};
