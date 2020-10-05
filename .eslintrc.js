module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'wikimedia',
		'wikimedia/language/es2019',
		'@wmde/wikimedia-typescript'
	],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
	},
	overrides: [
		{
			files: [ '**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)' ],
			env: {
				jest: true
			}
		},
		{
			files: [ '*.js' ],
			extends: [
				'wikimedia/node'
			],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/explicit-member-accessibility': 'off',
				'@typescript-eslint/no-var-requires': 'off'
			}
		}
	]
};
