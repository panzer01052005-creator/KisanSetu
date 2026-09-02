const { Pool } = require('pg')

const createDatabase = () => {
    if (!process.env.DATABASE_URL) return null

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })

    return {
        query: (text, values) => pool.query(text, values),
        pool,
    }
}

module.exports = { createDatabase }
