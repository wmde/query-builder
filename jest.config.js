module.exports = {
	preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
	transformIgnorePatterns: [
		'<rootDir>/node_modules/(?!(@wmde/wikit-vue-components)/)'
	]
};
