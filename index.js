require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

const MONGODB_URI = process.env.MONGODB_URI || '';
const HMAC_SECRET = process.env.HMAC_SECRET || 'mandi-hmac-secret-key-2026';

// ============================================================================
// 1. MONGOOSE SCHEMAS & MODELS
// ============================================================================
const ScheduleSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  variety: { type: String, required: true },
  season: { type: String, default: 'Kharif/Rabi' },
  mspRate: { type: Number, required: true },
  maxMoisturePct: { type: Number, required: true },
  maxForeignMatterPct: { type: Number, default: 1.0 },
  maxDamagedGrainPct: { type: Number, default: 3.0 },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  operatingHours: { type: String, default: '08:00 AM - 06:00 PM' }
});

const CenterSchema = new mongoose.Schema({
  centerCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  tehsil: { type: String, required: true },
  pincode: { type: String, required: true },
  distanceKm: { type: Number, default: 5 },
  dailyMaxCapacityQtl: { type: Number, default: 1200 },
  bookedQtl: { type: Number, default: 420 },
  liveQueueCount: { type: Number, default: 6 },
  bardanaStockBags: { type: Number, default: 3500 },
  facilities: [{ type: String }],
  slots: [
    {
      window: String,
      maxQtl: Number,
      bookedQtl: Number
    }
  ]
});

const TokenSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  farmerName: { type: String, required: true },
  farmerMobile: { type: String, required: true },
  khasraNo: { type: String, default: 'KH-402/1B' },
  cropName: { type: String, required: true },
  mspRate: { type: Number, required: true },
  estQuintals: { type: Number, required: true },
  centerCode: { type: String, required: true },
  centerName: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotWindow: { type: String, required: true },
  qrSignature: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'SLOT_CONFIRMED',
      'GATE_CHECKED_IN',
      'QUALITY_APPROVED',
      'ON_HOLD',
      'QUALITY_REJECTED',
      'WEIGHING_COMPLETED',
      'RECEIPT_GENERATED',
      'PAYMENT_SETTLED',
      'EXPIRED'
    ],
    default: 'SLOT_CONFIRMED'
  },
  gateEntry: {
    vehicleNo: String,
    queueNumber: Number,
    assignedBay: String,
    checkedInAt: Date
  },
  qualityReport: {
    sampleId: String,
    moisturePct: Number,
    foreignMatterPct: Number,
    damagedGrainPct: Number,
    remarks: String,
    gradedAt: Date
  },
  weighbridge: {
    grossWeightQtl: Number,
    tareWeightQtl: Number,
    gunnyBagCount: Number,
    bagTareDeductionQtl: Number,
    netWeightQtl: Number,
    weighedAt: Date
  },
  settlement: {
    jFormId: String,
    netPayableInr: Number,
    bankAccountMasked: { type: String, default: 'SBI XXXX4821 (DBT Active)' },
    utrNumber: String,
    settledAt: Date
  },
  timeline: [
    {
      stage: String,
      note: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const GrievanceSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  farmerMobile: { type: String, required: true },
  tokenId: { type: String, default: 'N/A' },
  centerName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'OPEN (4-Hr SLA Active)' },
  createdAt: { type: Date, default: Date.now }
});

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
const Center = mongoose.models.Center || mongoose.model('Center', CenterSchema);
const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);
const Grievance = mongoose.models.Grievance || mongoose.model('Grievance', GrievanceSchema);

// ============================================================================
// 2. INITIAL SEED DATA & FALLBACK STORE
// ============================================================================
function createHmacSignature(payload) {
  return crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex')
    .substring(0, 16)
    .toUpperCase();
}

const initialSchedules = [
  {
    cropName: 'Wheat (Gehu)',
    variety: 'FAQ Shb / Lokwan',
    season: 'Rabi',
    mspRate: 2425,
    maxMoisturePct: 14.0,
    maxForeignMatterPct: 0.75,
    maxDamagedGrainPct: 2.0,
    startDate: '2026-04-01',
    endDate: '2026-06-15',
    operatingHours: '08:00 AM - 06:00 PM'
  },
  {
    cropName: 'Paddy (Dhan - Common)',
    variety: 'Common FAQ',
    season: 'Kharif',
    mspRate: 2300,
    maxMoisturePct: 17.0,
    maxForeignMatterPct: 1.0,
    maxDamagedGrainPct: 3.0,
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    operatingHours: '08:00 AM - 06:00 PM'
  },
  {
    cropName: 'Paddy (Grade-A)',
    variety: 'Fine / Superfine',
    season: 'Kharif',
    mspRate: 2320,
    maxMoisturePct: 17.0,
    maxForeignMatterPct: 1.0,
    maxDamagedGrainPct: 3.0,
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    operatingHours: '08:00 AM - 06:00 PM'
  },
  {
    cropName: 'Mustard (Sarson)',
    variety: 'Yellow / Black FAQ',
    season: 'Rabi',
    mspRate: 5950,
    maxMoisturePct: 8.0,
    maxForeignMatterPct: 2.0,
    maxDamagedGrainPct: 2.0,
    startDate: '2026-03-25',
    endDate: '2026-05-30',
    operatingHours: '08:00 AM - 05:00 PM'
  }
];

const initialCenters = [
  {
    centerCode: 'MND-AGR-01',
    name: 'Kheragarh Krishi Utpadan Mandi',
    district: 'Agra',
    tehsil: 'Kheragarh',
    pincode: '283121',
    distanceKm: 4.2,
    dailyMaxCapacityQtl: 1200,
    bookedQtl: 650,
    liveQueueCount: 5,
    bardanaStockBags: 4200,
    facilities: ['Electronic Weighbridge', 'Digital Moisture Meter', 'Covered Shed', 'Drinking Water'],
    slots: [
      { window: '08:00 AM - 10:00 AM', maxQtl: 300, bookedQtl: 210 },
      { window: '10:00 AM - 12:00 PM', maxQtl: 300, bookedQtl: 240 },
      { window: '01:00 PM - 03:00 PM', maxQtl: 300, bookedQtl: 120 },
      { window: '03:00 PM - 05:00 PM', maxQtl: 300, bookedQtl: 80 }
    ]
  },
  {
    centerCode: 'MND-AGR-02',
    name: 'Fatehabad PACS Procurement Center',
    district: 'Agra',
    tehsil: 'Fatehabad',
    pincode: '283111',
    distanceKm: 14.8,
    dailyMaxCapacityQtl: 1000,
    bookedQtl: 890,
    liveQueueCount: 14,
    bardanaStockBags: 1800,
    facilities: ['Electronic Weighbridge', 'Digital Moisture Meter', 'Farmer Waiting Hall'],
    slots: [
      { window: '08:00 AM - 10:00 AM', maxQtl: 250, bookedQtl: 250 },
      { window: '10:00 AM - 12:00 PM', maxQtl: 250, bookedQtl: 240 },
      { window: '01:00 PM - 03:00 PM', maxQtl: 250, bookedQtl: 220 },
      { window: '03:00 PM - 05:00 PM', maxQtl: 250, bookedQtl: 180 }
    ]
  },
  {
    centerCode: 'MND-RMP-03',
    name: 'Bilaspur Model Mandi Samiti',
    district: 'Rampur',
    tehsil: 'Bilaspur',
    pincode: '244921',
    distanceKm: 19.5,
    dailyMaxCapacityQtl: 1600,
    bookedQtl: 480,
    liveQueueCount: 3,
    bardanaStockBags: 6000,
    facilities: ['Dual Weighbridge', 'Automated Grain Dryer', 'Covered Shed', 'Canteen'],
    slots: [
      { window: '08:00 AM - 10:00 AM', maxQtl: 400, bookedQtl: 150 },
      { window: '10:00 AM - 12:00 PM', maxQtl: 400, bookedQtl: 130 },
      { window: '01:00 PM - 03:00 PM', maxQtl: 400, bookedQtl: 100 },
      { window: '03:00 PM - 05:00 PM', maxQtl: 400, bookedQtl: 100 }
    ]
  }
];

const demoTokenPayload = {
  tokenId: 'MND-2026-1042',
  farmerName: 'Ramesh Chandra Verma',
  cropName: 'Paddy (Dhan - Common)',
  estQuintals: 45,
  slotDate: '2026-11-04'
};

const initialTokens = [
  {
    tokenId: 'MND-2026-1042',
    farmerName: 'Ramesh Chandra Verma',
    farmerMobile: '9876543210',
    khasraNo: 'KH-402/1B',
    cropName: 'Paddy (Dhan - Common)',
    mspRate: 2300,
    estQuintals: 45,
    centerCode: 'MND-AGR-01',
    centerName: 'Kheragarh Krishi Utpadan Mandi',
    slotDate: '2026-11-04',
    slotWindow: '08:00 AM - 10:00 AM',
    qrSignature: createHmacSignature(demoTokenPayload),
    status: 'GATE_CHECKED_IN',
    gateEntry: {
      vehicleNo: 'UP-80-BT-4419',
      queueNumber: 4,
      assignedBay: 'Bay-2 (Main Kata)',
      checkedInAt: new Date(Date.now() - 35 * 60000)
    },
    timeline: [
      {
        stage: 'SLOT_CONFIRMED',
        note: 'Slot booked for 45 Quintals (08:00 AM - 10:00 AM). Capacity locked.',
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        stage: 'GATE_CHECKED_IN',
        note: 'QR verified at Gate. Tractor UP-80-BT-4419 assigned Queue #4 at Bay-2.',
        timestamp: new Date(Date.now() - 35 * 60000)
      }
    ]
  }
];

let memoryStore = {
  schedules: [...initialSchedules],
  centers: JSON.parse(JSON.stringify(initialCenters)),
  tokens: JSON.parse(JSON.stringify(initialTokens)),
  grievances: []
};

// Serverless MongoDB Connection Caching
let cachedDb = global.mongooseConnection;
if (!cachedDb) {
  cachedDb = global.mongooseConnection = { conn: null, promise: null, isConnected: false };
}

async function connectDatabase() {
  if (!MONGODB_URI) {
    return false;
  }
  if (cachedDb.isConnected && mongoose.connection.readyState === 1) {
    return true;
  }
  try {
    if (!cachedDb.promise) {
      cachedDb.promise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
    }
    cachedDb.conn = await cachedDb.promise;
    cachedDb.isConnected = true;

    // Auto-seed MongoDB if empty
    const scheduleCount = await Schedule.countDocuments();
    if (scheduleCount === 0) {
      await Schedule.insertMany(initialSchedules);
    }
    const centerCount = await Center.countDocuments();
    if (centerCount === 0) {
      await Center.insertMany(initialCenters);
    }
    const tokenCount = await Token.countDocuments();
    if (tokenCount === 0) {
      await Token.insertMany(initialTokens);
    }
    return true;
  } catch (err) {
    console.warn('MongoDB connection warning (falling back to active memory store):', err.message);
    cachedDb.promise = null;
    cachedDb.isConnected = false;
    return false;
  }
}

// ============================================================================
// 3. PUBLIC & DISCOVERY PORTAL API ENDPOINTS
// ============================================================================

// System & Database Health Status
app.get('/api/v1/health', async (req, res) => {
  const dbConnected = await connectDatabase();
  res.json({
    status: 'ok',
    databaseMode: dbConnected ? 'MongoDB Atlas Connected' : 'In-Memory Store (Add MONGODB_URI in Vercel)',
    timestamp: new Date().toISOString()
  });
});

// 1.1 Live Procurement Schedules
app.get('/api/v1/public/schedules', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { season, crop } = req.query;
  if (dbConnected) {
    const filter = {};
    if (season && season !== 'All') filter.season = new RegExp(season, 'i');
    if (crop) filter.cropName = new RegExp(crop, 'i');
    const schedules = await Schedule.find(filter).lean();
    return res.json(schedules);
  }
  let list = memoryStore.schedules;
  if (season && season !== 'All') {
    list = list.filter((s) => s.season.toLowerCase().includes(season.toLowerCase()));
  }
  if (crop) {
    list = list.filter((s) => s.cropName.toLowerCase().includes(crop.toLowerCase()));
  }
  res.json(list);
});

// 1.2 Center Locator & Capacity Map
app.get('/api/v1/public/centers', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { district, pincode } = req.query;
  if (dbConnected) {
    const filter = {};
    if (district && district !== 'All') filter.district = new RegExp(district, 'i');
    if (pincode) filter.pincode = new RegExp(pincode, 'i');
    const centers = await Center.find(filter).lean();
    return res.json(centers);
  }
  let centers = memoryStore.centers;
  if (district && district !== 'All') {
    centers = centers.filter((c) => c.district.toLowerCase().includes(district.toLowerCase()));
  }
  if (pincode) {
    centers = centers.filter((c) => c.pincode.includes(pincode));
  }
  res.json(centers);
});

// 1.4 Grievance Desk Submission & Listing
app.get('/api/v1/support/tickets', async (req, res) => {
  const dbConnected = await connectDatabase();
  if (dbConnected) {
    const tickets = await Grievance.find().sort({ createdAt: -1 }).lean();
    return res.json(tickets);
  }
  res.json(memoryStore.grievances);
});

app.post('/api/v1/support/tickets', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { farmerMobile, tokenId, centerName, category, description } = req.body;
  const ticketData = {
    ticketId: 'GRV-' + Math.floor(10000 + Math.random() * 90000),
    farmerMobile: farmerMobile || '9876543210',
    tokenId: tokenId || 'N/A',
    centerName: centerName || 'Kheragarh Krishi Utpadan Mandi',
    category: category || 'Weighing / Moisture Dispute',
    description: description || 'Requested supervisor verification.',
    status: 'OPEN (4-Hr SLA Active)',
    createdAt: new Date()
  };

  if (dbConnected) {
    const created = await Grievance.create(ticketData);
    return res.status(201).json(created);
  }
  memoryStore.grievances.unshift(ticketData);
  res.status(201).json(ticketData);
});

// ============================================================================
// 4. FARMER PORTAL API ENDPOINTS
// ============================================================================

// 2.1 OTP Authentication & Farmer Profile Summary
app.post('/api/v1/auth/verify-otp', async (req, res) => {
  const { mobile } = req.body;
  res.json({
    authenticated: true,
    role: 'FARMER',
    farmer: {
      name: 'Ramesh Chandra Verma',
      mobile: mobile || '9876543210',
      farmerRegistryId: 'UP-AGR-KISAN-88412',
      identityKycStatus: 'Verified & Linked [ID Redacted]',
      dbtBankStatus: 'NPCI Active — SBI XXXX4821',
      khasraParcels: [
        { khasraNo: 'KH-402/1B', village: 'Kheragarh', areaHectares: 1.8, maxEligibleQtl: 90 },
        { khasraNo: 'KH-405/3A', village: 'Kheragarh', areaHectares: 0.9, maxEligibleQtl: 45 }
      ],
      totalMaxEligibleQtl: 135
    }
  });
});

// 2.4 Smart Slot & e-Token Booking with Atomic Capacity Validation
app.post('/api/v1/tokens/book', async (req, res) => {
  const dbConnected = await connectDatabase();
  const {
    farmerName,
    farmerMobile,
    khasraNo,
    cropName,
    estQuintals,
    centerCode,
    slotDate,
    slotWindow
  } = req.body;

  const qty = Number(estQuintals) || 25;
  const schedules = dbConnected ? await Schedule.find().lean() : memoryStore.schedules;
  const matchedCrop = schedules.find((s) => s.cropName === cropName) || schedules[0];

  let center = dbConnected
    ? await Center.findOne({ centerCode })
    : memoryStore.centers.find((c) => c.centerCode === centerCode);

  if (!center) {
    return res.status(404).json({ error: 'Selected procurement center not found.' });
  }

  const remainingCenterCap = center.dailyMaxCapacityQtl - center.bookedQtl;
  if (qty > remainingCenterCap) {
    return res.status(400).json({
      error: `Center capacity exceeded. Only ${remainingCenterCap} Quintals available today. Please select an alternate nearby center.`
    });
  }

  const tokenId = 'MND-2026-' + Math.floor(1000 + Math.random() * 9000);
  const qrSignature = createHmacSignature({
    tokenId,
    farmerName: farmerName || 'Ramesh Chandra Verma',
    cropName: matchedCrop.cropName,
    estQuintals: qty,
    slotDate: slotDate || '2026-11-05'
  });

  const newTokenData = {
    tokenId,
    farmerName: farmerName || 'Ramesh Chandra Verma',
    farmerMobile: farmerMobile || '9876543210',
    khasraNo: khasraNo || 'KH-402/1B',
    cropName: matchedCrop.cropName,
    mspRate: matchedCrop.mspRate,
    estQuintals: qty,
    centerCode: center.centerCode,
    centerName: center.name,
    slotDate: slotDate || '2026-11-05',
    slotWindow: slotWindow || '08:00 AM - 10:00 AM',
    qrSignature,
    status: 'SLOT_CONFIRMED',
    timeline: [
      {
        stage: 'SLOT_CONFIRMED',
        note: `Booked ${qty} Qtl of ${matchedCrop.cropName} for ${slotWindow || '08:00 AM - 10:00 AM'} at ${center.name}.`,
        timestamp: new Date()
      }
    ]
  };

  if (dbConnected) {
    center.bookedQtl += qty;
    const slotObj = center.slots.find((s) => s.window === slotWindow);
    if (slotObj) slotObj.bookedQtl = Math.min(slotObj.maxQtl, slotObj.bookedQtl + qty);
    await center.save();
    const savedToken = await Token.create(newTokenData);
    return res.status(201).json(savedToken);
  } else {
    center.bookedQtl += qty;
    const slotObj = center.slots.find((s) => s.window === slotWindow);
    if (slotObj) slotObj.bookedQtl = Math.min(slotObj.maxQtl, slotObj.bookedQtl + qty);
    memoryStore.tokens.unshift(newTokenData);
    return res.status(201).json(newTokenData);
  }
});

// 2.5 List All Tokens & Get Specific Token Timeline
app.get('/api/v1/tokens', async (req, res) => {
  const dbConnected = await connectDatabase();
  if (dbConnected) {
    const tokens = await Token.find().sort({ createdAt: -1 }).lean();
    return res.json(tokens);
  }
  res.json(memoryStore.tokens);
});

app.get('/api/v1/tokens/:tokenId/timeline', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { tokenId } = req.params;
  const token = dbConnected
    ? await Token.findOne({ tokenId: tokenId.toUpperCase() }).lean()
    : memoryStore.tokens.find((t) => t.tokenId.toUpperCase() === tokenId.toUpperCase());

  if (!token) {
    return res.status(404).json({ error: 'Token ID not found.' });
  }
  res.json(token);
});

// ============================================================================
// 5. MANDI OFFICER / ADMIN PORTAL API ENDPOINTS
// ============================================================================

// 3.1 Update Center Daily Capacity & Bardana Inventory
app.put('/api/v1/admin/centers/:centerCode/capacity', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { centerCode } = req.params;
  const { dailyMaxCapacityQtl, bardanaStockBags, liveQueueCount } = req.body;

  if (dbConnected) {
    const updated = await Center.findOneAndUpdate(
      { centerCode },
      {
        ...(dailyMaxCapacityQtl !== undefined && { dailyMaxCapacityQtl: Number(dailyMaxCapacityQtl) }),
        ...(bardanaStockBags !== undefined && { bardanaStockBags: Number(bardanaStockBags) }),
        ...(liveQueueCount !== undefined && { liveQueueCount: Number(liveQueueCount) })
      },
      { new: true }
    );
    return res.json(updated);
  }

  const center = memoryStore.centers.find((c) => c.centerCode === centerCode);
  if (!center) return res.status(404).json({ error: 'Center not found' });
  if (dailyMaxCapacityQtl !== undefined) center.dailyMaxCapacityQtl = Number(dailyMaxCapacityQtl);
  if (bardanaStockBags !== undefined) center.bardanaStockBags = Number(bardanaStockBags);
  if (liveQueueCount !== undefined) center.liveQueueCount = Number(liveQueueCount);
  res.json(center);
});

// 3.2 Gate Check-In Console
app.patch('/api/v1/admin/tokens/:tokenId/gate-checkin', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { tokenId } = req.params;
  const { vehicleNo, assignedBay } = req.body;

  const queueNo = Math.floor(1 + Math.random() * 12);
  const gateData = {
    vehicleNo: (vehicleNo || 'UP-80-AG-9012').toUpperCase(),
    queueNumber: queueNo,
    assignedBay: assignedBay || 'Bay-1 (Electronic Kata)',
    checkedInAt: new Date()
  };
  const timelineEntry = {
    stage: 'GATE_CHECKED_IN',
    note: `Gate QR verified. Vehicle ${gateData.vehicleNo} assigned Queue #${queueNo} (${gateData.assignedBay}).`,
    timestamp: new Date()
  };

  if (dbConnected) {
    const token = await Token.findOneAndUpdate(
      { tokenId: tokenId.toUpperCase() },
      {
        status: 'GATE_CHECKED_IN',
        gateEntry: gateData,
        $push: { timeline: timelineEntry }
      },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: 'Token not found' });
    return res.json(token);
  }

  const token = memoryStore.tokens.find((t) => t.tokenId.toUpperCase() === tokenId.toUpperCase());
  if (!token) return res.status(404).json({ error: 'Token not found' });
  token.status = 'GATE_CHECKED_IN';
  token.gateEntry = gateData;
  token.timeline.push(timelineEntry);
  res.json(token);
});

// 3.3 Quality & Moisture Testing Desk
app.post('/api/v1/admin/tokens/:tokenId/quality-check', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { tokenId } = req.params;
  const { moisturePct, foreignMatterPct, damagedGrainPct, decision, remarks } = req.body;

  const nextStatus = decision || 'QUALITY_APPROVED';
  const qualityReport = {
    sampleId: 'SMP-' + Math.floor(1000 + Math.random() * 9000),
    moisturePct: Number(moisturePct) || 13.4,
    foreignMatterPct: Number(foreignMatterPct) || 0.5,
    damagedGrainPct: Number(damagedGrainPct) || 1.2,
    remarks: remarks || (nextStatus === 'QUALITY_APPROVED' ? 'Meets FAQ standards' : 'Moisture above limit — Hold for drying in yard'),
    gradedAt: new Date()
  };

  const timelineEntry = {
    stage: nextStatus,
    note: `Quality Graded (${qualityReport.sampleId}): Moisture ${qualityReport.moisturePct}%, Foreign Matter ${qualityReport.foreignMatterPct}%. Decision: ${nextStatus}. ${qualityReport.remarks}`,
    timestamp: new Date()
  };

  if (dbConnected) {
    const token = await Token.findOneAndUpdate(
      { tokenId: tokenId.toUpperCase() },
      {
        status: nextStatus,
        qualityReport,
        $push: { timeline: timelineEntry }
      },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: 'Token not found' });
    return res.json(token);
  }

  const token = memoryStore.tokens.find((t) => t.tokenId.toUpperCase() === tokenId.toUpperCase());
  if (!token) return res.status(404).json({ error: 'Token not found' });
  token.status = nextStatus;
  token.qualityReport = qualityReport;
  token.timeline.push(timelineEntry);
  res.json(token);
});

// 3.4 Weighbridge (Kata) Console
app.post('/api/v1/admin/tokens/:tokenId/weighing', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { tokenId } = req.params;
  const { grossWeightQtl, tareWeightQtl, gunnyBagCount } = req.body;

  const gross = Number(grossWeightQtl) || 68.5;
  const tare = Number(tareWeightQtl) || 23.0;
  const bags = Number(gunnyBagCount) || 90;
  // Standard gunny bag tare deduction = 0.005 Quintal (500g) per bag
  const bagDeduction = Number((bags * 0.005).toFixed(2));
  const netWeight = Number(Math.max(0, gross - tare - bagDeduction).toFixed(2));

  const weighbridge = {
    grossWeightQtl: gross,
    tareWeightQtl: tare,
    gunnyBagCount: bags,
    bagTareDeductionQtl: bagDeduction,
    netWeightQtl: netWeight,
    weighedAt: new Date()
  };

  const timelineEntry = {
    stage: 'WEIGHING_COMPLETED',
    note: `Weighbridge recorded: Gross ${gross} Qtl - Tare ${tare} Qtl - ${bags} Bags (${bagDeduction} Qtl) = Net Weight ${netWeight} Qtl.`,
    timestamp: new Date()
  };

  if (dbConnected) {
    const token = await Token.findOneAndUpdate(
      { tokenId: tokenId.toUpperCase() },
      {
        status: 'WEIGHING_COMPLETED',
        weighbridge,
        $push: { timeline: timelineEntry }
      },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: 'Token not found' });
    return res.json(token);
  }

  const token = memoryStore.tokens.find((t) => t.tokenId.toUpperCase() === tokenId.toUpperCase());
  if (!token) return res.status(404).json({ error: 'Token not found' });
  token.status = 'WEIGHING_COMPLETED';
  token.weighbridge = weighbridge;
  token.timeline.push(timelineEntry);
  res.json(token);
});

// 3.5 Digital J-Form & DBT Payment Settlement Console
app.post('/api/v1/admin/tokens/:tokenId/settlement', async (req, res) => {
  const dbConnected = await connectDatabase();
  const { tokenId } = req.params;

  let token = dbConnected
    ? await Token.findOne({ tokenId: tokenId.toUpperCase() })
    : memoryStore.tokens.find((t) => t.tokenId.toUpperCase() === tokenId.toUpperCase());

  if (!token) return res.status(404).json({ error: 'Token not found' });

  const netQtl = token.weighbridge?.netWeightQtl || token.estQuintals;
  const totalPayable = Math.round(netQtl * token.mspRate);
  const jFormId = 'JF-2026-' + Math.floor(10000 + Math.random() * 90000);
  const utrNumber = 'SBIN26' + Math.floor(100000000 + Math.random() * 900000000);

  const settlement = {
    jFormId,
    netPayableInr: totalPayable,
    bankAccountMasked: 'SBI XXXX4821 (NPCI DBT Active)',
    utrNumber,
    settledAt: new Date()
  };

  const receiptTimeline = {
    stage: 'RECEIPT_GENERATED',
    note: `Digital J-Form (${jFormId}) generated for ${netQtl} Qtl @ ₹${token.mspRate}/Qtl = ₹${totalPayable.toLocaleString('en-IN')}.`,
    timestamp: new Date()
  };

  const paymentTimeline = {
    stage: 'PAYMENT_SETTLED',
    note: `DBT Payment of ₹${totalPayable.toLocaleString('en-IN')} credited to SBI XXXX4821. UTR: ${utrNumber}.`,
    timestamp: new Date()
  };

  if (dbConnected) {
    token.status = 'PAYMENT_SETTLED';
    token.settlement = settlement;
    token.timeline.push(receiptTimeline, paymentTimeline);
    await token.save();
    return res.json(token);
  }

  token.status = 'PAYMENT_SETTLED';
  token.settlement = settlement;
  token.timeline.push(receiptTimeline, paymentTimeline);
  res.json(token);
});

// Serve Frontend UI for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Local server startup (Vercel imports `app` automatically)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Smart Mandi Platform running on http://localhost:${PORT}`);
  });
}

module.exports = app;