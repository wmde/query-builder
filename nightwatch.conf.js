/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
	src_folders: [ 'tests/e2e/specs' ],
	page_objects_path: '',
	custom_commands_path: '',
	custom_assertions_path: '',
	globals_path: 'tests/e2e/globals.js',

	webdriver: {},

	test_settings: {
		default: {
			launch_url: process.env.QB_URL,
			isLocal: true,
		},

		docker: {
			launch_url: `http://dev:${process.env.PORT}`,
			isLocal: true,
			selenium_host: 'selenium',
			desiredCapabilities: {
				browserName: 'chrome',
				chromeOptions: {
					args: [ 'headless', 'no-sandbox', 'disable-gpu' ],
					w3c: false,
				},
			},
		},
	},
};
