const crypto = require('node:crypto')

const users = []
const sessions = new Map()

const hashPassword = (password) => new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) return reject(error)
        resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
})

const verifyPassword = (password, storedHash) => new Promise((resolve, reject) => {
    const [salt, key] = String(storedHash).split(':')
    if (!salt || !key) return resolve(false)
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) return reject(error)
        const expected = Buffer.from(key, 'hex')
        resolve(expected.length === derivedKey.length && crypto.timingSafeEqual(expected, derivedKey))
    })
})

const createAuthRepository = ({ query } = {}) => ({
    async createUser({ fullName, email, mobile, password, role, language }) {
        const passwordHash = await hashPassword(password)
        if (query) {
            const result = await query(
                `INSERT INTO users (full_name, email, mobile, password_hash, role, language)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, full_name AS "fullName", email, mobile, role, language`,
                [fullName, email || null, mobile, passwordHash, role, language],
            )
            return result.rows[0]
        }
        const user = { id: `USR-${String(users.length + 1).padStart(4, '0')}`, fullName, email, mobile, passwordHash, role, language }
        users.push(user)
        return user
    },

    async findByLogin(login) {
        if (query) {
            const result = await query(
                `SELECT id, full_name AS "fullName", email, mobile, password_hash, role, language
                 FROM users WHERE mobile = $1 OR LOWER(email) = LOWER($1) LIMIT 1`,
                [login],
            )
            return result.rows[0] || null
        }
        return users.find((user) => user.mobile === login || (user.email && user.email.toLowerCase() === login.toLowerCase())) || null
    },

    async passwordMatches(password, user) {
        return verifyPassword(password, user.password_hash || user.passwordHash)
    },

    createSession(user) {
        const token = crypto.randomBytes(32).toString('hex')
        sessions.set(token, { id: user.id, role: user.role, createdAt: Date.now() })
        return token
    },
})

module.exports = { createAuthRepository }
