const mongoose = require('mongoose')

const createDatabase = () => {
    if (!process.env.MONGO_URI && process.env.MONGODB_URI) process.env.MONGO_URI = process.env.MONGODB_URI
    if (!process.env.MONGO_URI) return null
    return {
        type: 'mongodb',
        connection: mongoose.connection,
        ready: mongoose.connect(process.env.MONGO_URI),
    }
}

module.exports = { createDatabase }
