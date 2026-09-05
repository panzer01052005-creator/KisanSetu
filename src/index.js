require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI

app.get('/', (request, response) => {
    response.status(200).json({
        message: 'KisanSetu API is running',
    })
})

app.get('/api/test', async (request, response) => {
    try {
        await mongoose.connect(MONGODB_URI)

        response.status(200).json({
            message: 'MongoDB connected successfully',
        })
    } catch (error) {
        console.error('MongoDB Error:', error)

        response.status(500).json({
            message: 'MongoDB connection failed',
            error: error.message,
        })
    }
})
if (require.main === module) {
    app.listen(port, () => {
        console.log(`KisanSetu API listening at http://localhost:${port}`)
    })
}

module.exports = app
