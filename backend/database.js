const { Pool } = require('pg')

const createDatabase = () => {
    if (!process.env.DATABASE_URL) return null

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: Number(process.env.DB_POOL_MAX) || 10,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
    })

    return {
        query: (text, values) => pool.query(text, values),
        pool,
    }
}

module.exports = { createDatabase }
