const { app, ready } = require('../backend/server')

module.exports = async (request, response) => {
    try {
        await ready
        return app(request, response)
    } catch (error) {
        console.error('Unable to connect to MongoDB:', error.message)
        return response.status(503).json({ error: 'Database unavailable.' })
    }
}
