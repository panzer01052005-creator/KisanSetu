const { app, ready } = require('../backend/server')

module.exports = async (request, response) => {
	try {
		await ready
		return app(request, response)
	} catch (error) {
		console.error(`Unable to connect to MongoDB: ${error.message}`)

		response.statusCode = 503
		response.setHeader('Content-Type', 'application/json')

		return response.end(
			JSON.stringify({
				error: 'Database unavailable.'
			})
		)
	}
}