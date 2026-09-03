const path = require('node:path')
const dotenv = require('dotenv')

const environmentFile = path.resolve(__dirname, '..', 'backend', '.env')
dotenv.config({ path: environmentFile })

module.exports = {
    mongoUri: process.env.MONGO_URI,
    port: Number(process.env.PORT) || 3000,
    nodeEnvironment: process.env.NODE_ENV || 'development',
}
