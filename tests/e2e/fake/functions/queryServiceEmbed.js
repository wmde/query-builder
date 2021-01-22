/* eslint-disable */
exports.handler = async ( event ) => {
	const cookieHeader = event.headers;
	if ( false ) { // add no-cookie condition
		return {
			statusCode: 301,
			headers: { Location: 'https://query.wikidata.org/embed.html' },
		};
	}
	return {
		statusCode: 200,
		body: `<script>
document.open();
document.write('<pre>' + decodeURIComponent(location.hash.substring(1)) + '</pre><pre>${JSON.stringify( cookieHeader )}</pre>');
document.close();
</script>`,
	};
};
