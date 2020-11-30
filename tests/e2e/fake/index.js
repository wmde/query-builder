const Hapi = require( '@hapi/hapi' );
const fs = require( 'fs' );

const init = async () => {

	const server = Hapi.server( {
		port: 3000,
		host: 'localhost',
	} );
	const fakePropertyResponseData = fs.readFileSync(
		'tests/e2e/fake/property-fake-response-data-post.json',
		'utf8',
	);

	server.route( {
		method: 'GET',
		path: '/embed.html',
		handler: () => {
			/**
			 * This url is embedded in an iframe by the app and its content is  not actually
			 * relevant to browser testing, but it is still nice to have for manual inspection.
			 */

			return `<script>
document.open();
document.write('<pre>' + decodeURIComponent(location.hash.substring(1)) + '</pre>');
document.close();
</script>`;
		},
	} );

	server.route( {
		method: 'GET',
		path: '/w/api.php',
		handler: ( request, h ) => {
			const response = h.response( fakePropertyResponseData );
			response.type( 'application/json' );
			response.header( 'Access-Control-Allow-Origin', '*' );
			return response;
		},
	} );

	await server.start();
	console.log( 'Server running on %s', server.info.uri );
};

process.on( 'unhandledRejection', ( err ) => {

	console.log( err );
	throw err;
} );

init();
