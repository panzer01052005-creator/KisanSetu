const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { createCropRepository } = require('./crop-repository')
const { createDatabase } = require('./database')

const frontendRoot = path.resolve(__dirname, '..', 'frontend')
const port = Number(process.env.PORT) || 3000
const database = createDatabase()
if (process.env.NODE_ENV === 'production' && !database && process.env.ALLOW_MEMORY_STORAGE !== 'true') {
    throw new Error('DATABASE_URL is required in production. Set ALLOW_MEMORY_STORAGE=true only for temporary testing.')
}
const cropRepository = createCropRepository(database || undefined)
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
}

const sendJson = (response, statusCode, payload) => {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
    })
    response.end(JSON.stringify(payload))
}

const readJsonBody = (request) => new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
        body += chunk
        if (body.length > 1024 * 1024) reject(new Error('Request body is too large'))
    })
    request.on('end', () => {
        try {
            resolve(JSON.parse(body || '{}'))
        } catch {
            reject(new Error('Request body must be valid JSON'))
        }
    })
    request.on('error', reject)
})

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

const handleApiRequest = async (request, response) => {
    if (request.method === 'GET' && request.url.split('?')[0] === '/api/health') {
        if (!database) {
            sendJson(response, 200, { status: 'ok', database: 'memory', message: 'Set DATABASE_URL to enable PostgreSQL.' })
            return true
        }
        try {
            await database.query('SELECT 1')
            sendJson(response, 200, { status: 'ok', database: 'postgresql' })
        } catch {
            sendJson(response, 503, { status: 'error', database: 'unavailable' })
        }
        return true
    }
    if (request.method !== 'POST' || request.url.split('?')[0] !== '/api/crop-registrations') return false

    try {
        const body = await readJsonBody(request)
        const validationError = validateCropRegistration(body)
        if (validationError) {
            sendJson(response, 400, { error: validationError })
            return true
        }

        const registration = await cropRepository.create({
            crop: body.crop === 'Other' ? String(body.otherCrop).trim() : String(body.crop).trim(),
            quantity: Number(body.quantity),
            unit: String(body.unit),
            center: String(body.center).trim(),
            address: String(body.address).trim(),
            district: String(body.district).trim(),
            pincode: String(body.pincode),
        })
        sendJson(response, 201, { message: 'Crop registration received.', registration })
    } catch (error) {
        sendJson(response, 400, { error: error.message || 'Unable to save crop registration.' })
    }
    return true
}

const server = http.createServer(async (request, response) => {
    if (await handleApiRequest(request, response)) return
    const requestPath = decodeURIComponent(request.url.split('?')[0])
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1)
    const filePath = path.resolve(frontendRoot, relativePath)

    if (!filePath.startsWith(`${frontendRoot}${path.sep}`)) {
        response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
        response.end('Forbidden')
        return
    }

    fs.stat(filePath, (statError, stats) => {
        const resolvedPath = !statError && stats.isDirectory() ? path.join(filePath, 'index.html') : filePath
        fs.readFile(resolvedPath, (readError, content) => {
            if (readError) {
                response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
                response.end('Not found')
                return
            }

            response.writeHead(200, {
                'Content-Type': contentTypes[path.extname(resolvedPath)] || 'application/octet-stream',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            })
            response.end(content)
        })
    })
})

server.listen(port, () => {
    console.log(`KisanSetu frontend available at http://localhost:${port}`)
})

const shutdown = async () => {
    server.close()
    if (database) await database.pool.end()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
