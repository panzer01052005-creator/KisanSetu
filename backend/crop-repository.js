const registrations = []

const createCropRepository = ({ query } = {}) => ({
    async create(registration) {
        if (query) {
            const result = await query(
                `INSERT INTO crop_registrations
                    (crop_name, quantity, unit, collection_center, address, district, pincode)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id, crop_name, quantity, unit, collection_center, status, created_at`,
                [registration.crop, registration.quantity, registration.unit, registration.center, registration.address, registration.district, registration.pincode],
            )
            return result.rows[0]
        }

        const created = {
            id: `CR-${String(registrations.length + 1).padStart(4, '0')}`,
            ...registration,
            status: 'pending',
            createdAt: new Date().toISOString(),
        }
        registrations.push(created)
        return created
    },
})

module.exports = { createCropRepository }