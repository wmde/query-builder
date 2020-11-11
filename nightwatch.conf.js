const build = `Nightwatch build-${process.env.DATE}`;

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

		sauceLabs: {
			launch_url: `${process.env.DEPLOY_URL}`,
			isLocal: false,
			selenium_host: 'ondemand.saucelabs.com',
			selenium_port: 80,
			username: process.env.SAUCE_USERNAME,
			access_key: process.env.SAUCE_ACCESS_KEY,
			desiredCapabilities: {
				build,
				screenResolution: '1600x1200',
				seleniumVersion: '3.141.59',
			},
		},
		sauceChrome: {
			extends: 'sauceLabs',
			desiredCapabilities: {
				browserName: 'googlechrome',
				platform: 'Windows 10',
				version: 'latest',
			},
		},

		sauceFirefox: {
			extends: 'sauceLabs',
			desiredCapabilities: {
				browserName: 'firefox',
				platform: 'Windows 10',
				version: 'latest',
			},
		},

		sauceIE: {
			extends: 'sauceLabs',
			desiredCapabilities: {
				browserName: 'internet explorer',
				platform: 'Windows 10',
				version: 'latest',
			},
		},

		sauceEdge: {
			extends: 'sauceLabs',
			desiredCapabilities: {
				browserName: 'MicrosoftEdge',
				platform: 'Windows 10',
				version: 'latest',
			},
		},

		sauceSafari: {
			extends: 'sauceLabs',
			desiredCapabilities: {
				browserName: 'safari',
				platform: 'macOS 10.15',
				version: 'latest',
			},
		},
	},
};
