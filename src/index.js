const mongoose = require('mongoose')
const { mongoUri } = require('./config')

const startServer = async () => {
	if (mongoUri) {
		await mongoose.connect(mongoUri)
		console.log('Connected to MongoDB')
	}
	require('../backend/server')
}

startServer().catch((error) => {
	console.error('Unable to connect to MongoDB:', error.message)
	process.exitCode = 1
})
