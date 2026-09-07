const resolveMongoUri = (environment = process.env) => environment.MONGO_URI || environment.MONGODB_URI

const validateProductionConfiguration = (environment = process.env) => {
    const mongoUri = resolveMongoUri(environment)

    if (environment.NODE_ENV === 'production' && (!mongoUri || environment.ALLOW_MEMORY_STORAGE !== 'false')) {
        throw new Error('Production requires MONGO_URI or MONGODB_URI and ALLOW_MEMORY_STORAGE=false.')
    }
    if (environment.NODE_ENV === 'production' && (!environment.SESSION_SECRET || environment.SESSION_SECRET.length < 32)) {
        throw new Error('SESSION_SECRET must be at least 32 characters in production.')
    }
}

module.exports = { resolveMongoUri, validateProductionConfiguration }
