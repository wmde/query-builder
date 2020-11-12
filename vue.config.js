module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: '@import "~@wmde/wikit-tokens/dist/variables";',
			},
		},
	},
	lintOnSave: process.env.NODE_ENV === 'production',
	transpileDependencies: [
		'sparqljs',
	],
};
