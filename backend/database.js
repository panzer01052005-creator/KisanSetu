const mongoose = require('mongoose')

const createDatabase = () => {
    if (!process.env.MONGO_URI) return null
    return { type: 'mongodb', connection: mongoose.connection }
}

module.exports = { createDatabase }
