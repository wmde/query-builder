exports.handler = async ( event ) => {
	const cookieHeader = event.headers;
	const subject = event.queryStringParameters.name || 'World';
	return {
		statusCode: 200,
		body: `Hello ${subject}! ${cookieHeader} ${JSON.stringify( cookieHeader )}`,
	};
};
