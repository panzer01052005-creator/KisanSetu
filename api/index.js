const { app, ready } = require('../backend/server')

module.exports = async (request, response) => {
	try {
		await ready
		return app(request, response)
	} catch (error) {
		console.error(`Unable to connect to MongoDB: ${error.message}`)
		const payload = JSON.stringify({ error: 'Database unavailable.' })

		if (typeof response.status === 'function') return response.status(503).json({ error: 'Database unavailable.' })
		response.statusCode = 503
		response.setHeader('Content-Type', 'application/json')
		return response.end(payload)
	}
}