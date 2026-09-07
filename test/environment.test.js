const assert = require('node:assert/strict')
const { test } = require('node:test')

const { resolveMongoUri, validateProductionConfiguration } = require('../backend/environment')

test('production accepts MONGODB_URI as the MongoDB connection string alias', () => {
    const environment = {
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://example.test/kisansetu',
        ALLOW_MEMORY_STORAGE: 'false',
        SESSION_SECRET: 'a'.repeat(32),
    }

    assert.equal(resolveMongoUri(environment), environment.MONGODB_URI)
    assert.doesNotThrow(() => validateProductionConfiguration(environment))
})

test('production still requires a database connection string', () => {
    const environment = {
        NODE_ENV: 'production',
        ALLOW_MEMORY_STORAGE: 'false',
        SESSION_SECRET: 'a'.repeat(32),
    }

    assert.throws(() => validateProductionConfiguration(environment), /MONGO_URI or MONGODB_URI/)
})
