const path = require('node:path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { createCropRepository } = require('./crop-repository')
const { createDatabase } = require('./database')
const { createAuthRepository } = require('./auth-repository')

const app = express()
const frontendRoot = path.resolve(__dirname, '..', 'frontend')
const port = Number(process.env.PORT) || 3000
const database = createDatabase()
const sessionSecret = process.env.SESSION_SECRET

if (process.env.NODE_ENV === 'production' && !database && process.env.ALLOW_MEMORY_STORAGE !== 'true') {
    throw new Error('MONGO_URI is required in production. Set ALLOW_MEMORY_STORAGE=true only for temporary testing.')
}
if (process.env.NODE_ENV === 'production' && (!sessionSecret || sessionSecret.length < 32)) {
    throw new Error('SESSION_SECRET must be at least 32 characters in production.')
}

const cropRepository = createCropRepository(database || undefined)
const authRepository = createAuthRepository(database || undefined)

const protectedPagePrefixes = [
    '/pages/dashboard/',
    '/pages/register/',
    '/pages/Account/',
    '/pages/Queue/',
    '/pages/orders/',
    '/pages/payments/',
]

const requiresAuthentication = (request) => protectedPagePrefixes.some((prefix) => request.path.startsWith(prefix))

const requireAuthentication = (request, response, next) => {
    if (request.session.user) {
        request.user = request.session.user
        return next()
    }
    if (request.path.startsWith('/api/')) return response.status(401).json({ error: 'Authentication required.' })
    response.redirect('/pages/login/index.html')
}

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(session({
    name: 'kisansetu.sid',
    secret: sessionSecret || 'development-only-session-secret',
    resave: false,
    saveUninitialized: false,
    store: database ? MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }) : undefined,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
    },
}))
app.use((request, response, next) => {
    response.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    })
    next()
})

const validateAuthInput = (body, isSignup) => {
    if (isSignup && (!String(body.fullName || '').trim() || !String(body.mobile || '').trim())) return 'Full name and mobile number are required.'
    if (!String(body.mobile || '').trim() || String(body.password || '').length < 6) return 'Mobile/email and a password of at least 6 characters are required.'
    return null
}

const validateCropRegistration = (body) => {
    const crop = body.crop === 'Other' ? String(body.otherCrop || '').trim() : String(body.crop || '').trim()
    const quantity = Number(body.quantity)
    const unit = String(body.unit || '')
    const requiredFields = [crop, body.center, body.address, body.district, body.pincode]

    if (requiredFields.some((field) => field === undefined || field === null || !String(field).trim()) || !Number.isFinite(quantity) || quantity <= 0) {
        return 'Crop, quantity, collection center, and complete address are required.'
    }
    if (!['kg', 'quintal', 'ton'].includes(unit)) return 'Quantity unit is invalid.'
    if (!/^[0-9]{6}$/.test(String(body.pincode))) return 'PIN code must contain 6 digits.'
    return null
}

app.get('/api/health', async (request, response) => {
    if (!database) return response.json({ status: 'ok', database: 'memory', message: 'Set MONGO_URI to enable MongoDB.' })
    try {
        await database.connection.db.admin().ping()
        response.json({ status: 'ok', database: 'mongodb' })
    } catch {
        response.status(503).json({ status: 'error', database: 'unavailable' })
    }
})

    app.get('/api/config', (request, response) => {
        response.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '' })
    })

app.post('/api/auth/register', async (request, response) => {
    const body = request.body
    const validationError = validateAuthInput(body, true)
    if (validationError) return response.status(400).json({ error: validationError })
    try {
        const user = await authRepository.createUser({
            fullName: String(body.fullName).trim(), email: String(body.email || '').trim(), mobile: String(body.mobile).trim(),
            password: String(body.password), role: ['seller', 'buyer'].includes(body.role) ? body.role : 'seller', language: String(body.language || 'en'),
        })
        request.session.user = { id: user.id, fullName: user.fullName, role: user.role }
        response.status(200).json({ message: 'Account created.', user: { id: user.id, fullName: user.fullName, role: user.role } })
    } catch (error) {
        response.status(error.code === '23505' ? 409 : 400).json({ error: error.code === '23505' ? 'That mobile number or email is already registered.' : error.message })
    }
})

app.post('/api/auth/login', async (request, response) => {
    const body = request.body
    const validationError = validateAuthInput(body, false)
    if (validationError) return response.status(400).json({ error: validationError })
    try {
        const user = await authRepository.findByLogin(String(body.mobile).trim())
        if (!user || !(await authRepository.passwordMatches(String(body.password), user))) return response.status(401).json({ error: 'Incorrect login details.' })
        request.session.user = { id: user.id, fullName: user.fullName, role: user.role }
        response.json({ message: 'Login successful.', user: { id: user.id, fullName: user.fullName, role: user.role } })
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

app.post('/api/auth/logout', (request, response) => {
    request.session.destroy(() => response.status(204).end())
})

app.post('/api/crop-registrations', requireAuthentication, async (request, response) => {
    const body = request.body
    const validationError = validateCropRegistration(body)
    if (validationError) return response.status(400).json({ error: validationError })
    try {
        const registration = await cropRepository.create({
            crop: body.crop === 'Other' ? String(body.otherCrop).trim() : String(body.crop).trim(),
            quantity: Number(body.quantity), unit: String(body.unit), center: String(body.center).trim(),
            address: String(body.address).trim(), district: String(body.district).trim(), pincode: String(body.pincode),
        })
        response.status(201).json({ message: 'Crop registration received.', registration })
    } catch (error) {
        response.status(400).json({ error: error.message || 'Unable to save crop registration.' })
    }
})

app.use((request, response, next) => requiresAuthentication(request) ? requireAuthentication(request, response, next) : next())
app.use(express.static(frontendRoot, { extensions: ['html'] }))
app.use((request, response) => {
    if (request.path.startsWith('/api/')) return response.status(404).json({ error: 'API route not found.' })
    response.status(404).type('text').send('Not found')
})

const server = app.listen(port, () => {
    console.log(`KisanSetu frontend available at http://localhost:${port}`)
})

const shutdown = async () => {
    server.close()
    if (database) await database.connection.close()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

module.exports = { app, server }
