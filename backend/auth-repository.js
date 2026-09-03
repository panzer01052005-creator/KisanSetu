const crypto = require('node:crypto')
const mongoose = require('mongoose')

const users = []
const sessions = new Map()
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true, maxlength: 160 },
    mobile: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['seller', 'buyer', 'admin'], default: 'seller' },
    language: { type: String, default: 'en', maxlength: 10 },
}, { timestamps: true })
const User = mongoose.models.User || mongoose.model('User', userSchema)

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

const createAuthRepository = (database = {}) => ({
    async createUser({ fullName, email, mobile, password, role, language }) {
        const passwordHash = await hashPassword(password)
        if (database.type === 'mongodb') {
            const user = await User.create({ fullName, email: email || undefined, mobile, passwordHash, role, language })
            return { id: user.id, fullName: user.fullName, email: user.email, mobile: user.mobile, role: user.role, language: user.language }
        }
        const user = { id: `USR-${String(users.length + 1).padStart(4, '0')}`, fullName, email, mobile, passwordHash, role, language }
        users.push(user)
        return user
    },

    async findByLogin(login) {
        if (database.type === 'mongodb') {
            return User.findOne({ $or: [{ mobile: login }, { email: login.toLowerCase() }] }).lean()
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
