exports.handler = async ( event ) => {
	if ( true ) { // add no-cookie condition
		return {
			statusCode: 301,
			headers: { Location: 'https://query.wikidata.org/embed.html' },
		};
	}
	return {
		statusCode: 200,
		body: `<script>
document.open();
document.write('<pre>' + decodeURIComponent(location.hash.substring(1)) + '</pre>');
document.close();
</script>`,
	};
};
