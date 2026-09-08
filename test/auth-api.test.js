const assert = require('node:assert/strict')
const { after, before, test } = require('node:test')

const { app } = require('../backend/server')

let server
let baseUrl

const postJson = async (path, body, cookie) => fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
    redirect: 'manual',
})

const getJson = async (path, cookie) => fetch(`${baseUrl}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
})

before(() => new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`
        resolve()
    })
}))

after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())))

test('registration rejects duplicate mobile numbers and email addresses', async () => {
    const first = await postJson('/api/auth/register', {
        fullName: 'First Farmer', email: 'farmer@example.com', mobile: '9000000001', password: 'password123',
    })
    assert.equal(first.status, 200)

    const duplicateMobile = await postJson('/api/auth/register', {
        fullName: 'Second Farmer', email: 'other@example.com', mobile: '9000000001', password: 'password123',
    })
    assert.equal(duplicateMobile.status, 409)

    const duplicateEmail = await postJson('/api/auth/register', {
        fullName: 'Third Farmer', email: 'FARMER@example.com', mobile: '9000000002', password: 'password123',
    })
    assert.equal(duplicateEmail.status, 409)
})

test('logout destroys the session and clears its cookie', async () => {
    const registration = await postJson('/api/auth/register', {
        fullName: 'Logout Farmer', email: 'logout@example.com', mobile: '9000000003', password: 'password123',
    })
    const cookie = registration.headers.get('set-cookie').split(';')[0]

    const logout = await postJson('/api/auth/logout', {}, cookie)
    assert.equal(logout.status, 204)
    assert.match(logout.headers.get('set-cookie'), /kisansetu\.sid=;/)

    const cropRegistration = await postJson('/api/crop-registrations', {
        crop: 'Wheat', quantity: 10, unit: 'kg', center: 'Shivaji Nagar Mandi', address: 'Village Road', district: 'Bareilly', pincode: '243001',
    }, cookie)
    assert.equal(cropRegistration.status, 401)
})

test('a farmer can retrieve only their own crop registrations for the dashboard', async () => {
    const farmer = await postJson('/api/auth/register', {
        fullName: 'Dashboard Farmer', email: 'dashboard@example.com', mobile: '9000000004', password: 'password123',
    })
    const farmerCookie = farmer.headers.get('set-cookie').split(';')[0]

    const cropRegistration = await postJson('/api/crop-registrations', {
        crop: 'Wheat', quantity: 25, unit: 'kg', center: 'Shivaji Nagar Mandi', address: 'Village Road', district: 'Bareilly', pincode: '243001',
    }, farmerCookie)
    assert.equal(cropRegistration.status, 201)

    const registrations = await getJson('/api/crop-registrations/mine', farmerCookie)
    assert.equal(registrations.status, 200)
    const result = await registrations.json()
    assert.equal(result.registrations.length, 1)
    assert.deepEqual(Object.keys(result.registrations[0]).sort(), ['address', 'center', 'createdAt', 'crop', 'district', 'id', 'pincode', 'quantity', 'status', 'unit'])
    assert.equal(result.registrations[0].crop, 'Wheat')

    const anotherFarmer = await postJson('/api/auth/register', {
        fullName: 'Another Farmer', email: 'another@example.com', mobile: '9000000005', password: 'password123',
    })
    const anotherCookie = anotherFarmer.headers.get('set-cookie').split(';')[0]
    const otherRegistrations = await getJson('/api/crop-registrations/mine', anotherCookie)
    assert.deepEqual((await otherRegistrations.json()).registrations, [])
})
