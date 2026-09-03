const registrations = []
const mongoose = require('mongoose')
const cropRegistrationSchema = new mongoose.Schema({
    crop: { type: String, required: true, trim: true, maxlength: 120 },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['kg', 'quintal', 'ton'], required: true },
    center: { type: String, required: true, trim: true, maxlength: 160 },
    address: { type: String, required: true, trim: true, maxlength: 240 },
    district: { type: String, required: true, trim: true, maxlength: 100 },
    pincode: { type: String, required: true, match: /^[0-9]{6}$/ },
    status: { type: String, default: 'pending' },
}, { timestamps: true })
const CropRegistration = mongoose.models.CropRegistration || mongoose.model('CropRegistration', cropRegistrationSchema)

const createCropRepository = (database = {}) => ({
    async create(registration) {
        if (database.type === 'mongodb') {
            const created = await CropRegistration.create(registration)
            return {
                id: created.id, crop: created.crop, quantity: created.quantity, unit: created.unit, center: created.center,
                address: created.address, district: created.district, pincode: created.pincode, status: created.status,
                createdAt: created.createdAt.toISOString(),
            }
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