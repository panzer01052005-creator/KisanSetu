require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const frontendDir = path.join(__dirname, '../frontend');
const frontendIndexPath = path.join(frontendDir, 'index.html');

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir, { index: false }));

mongoose.set('bufferCommands', false);

const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();
const HMAC_SECRET = process.env.HMAC_SECRET || 'kisansetu-hmac-secret-2026';

// ============================================================================
// 1. MONGOOSE SCHEMAS & MODELS
// ============================================================================
const ScheduleSchema = new mongoose.Schema({
  cropName: String,
  variety: String,
  season: String,
  mspRate: Number,
  maxMoisturePct: Number,
  startDate: String,
  endDate: String,
  operatingHours: String
});

const CenterSchema = new mongoose.Schema({
  centerCode: { type: String, unique: true },
  name: String,
  district: String,
  tehsil: String,
  pincode: String,
  distanceKm: Number,
  dailyMaxCapacityQtl: Number,
  bookedQtl: Number,
  liveQueueCount: Number,
  bardanaStockBags: Number
});

const TokenSchema = new mongoose.Schema({
  tokenId: { type: String, unique: true },
  farmerName: String,
  farmerMobile: String,
  khasraNo: String,
  cropName: String,
  mspRate: Number,
  estQuintals: Number,
  centerCode: String,
  centerName: String,
  slotDate: String,
  slotWindow: String,
  qrSignature: String,
  status: { type: String, default: 'SLOT_CONFIRMED' },
  gateEntry: { vehicleNo: String, queueNumber: Number, assignedBay: String, checkedInAt: Date },
  qualityReport: { sampleId: String, moisturePct: Number, foreignMatterPct: Number, remarks: String, gradedAt: Date },
  weighbridge: { grossWeightQtl: Number, tareWeightQtl: Number, gunnyBagCount: Number, bagTareDeductionQtl: Number, netWeightQtl: Number, weighedAt: Date },
  settlement: { jFormId: String, netPayableInr: Number, utrNumber: String, settledAt: Date },
  timeline: [{ stage: String, note: String, timestamp: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
const Center = mongoose.models.Center || mongoose.model('Center', CenterSchema);
const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);

// ============================================================================
// 2. SEED DATA & FALLBACK MEMORY
// ============================================================================
function signPayload(data) {
  return crypto.createHmac('sha256', HMAC_SECRET).update(JSON.stringify(data)).digest('hex').slice(0, 14).toUpperCase();
}

const seedSchedules = [
  { cropName: 'Wheat (Gehu)', variety: 'FAQ Lokwan / Shb', season: 'Rabi', mspRate: 2425, maxMoisturePct: 14.0, startDate: '2026-04-01', endDate: '2026-06-15', operatingHours: '08:00 AM - 06:00 PM' },
  { cropName: 'Paddy (Dhan - Common)', variety: 'Common FAQ', season: 'Kharif', mspRate: 2300, maxMoisturePct: 17.0, startDate: '2026-10-01', endDate: '2026-12-31', operatingHours: '08:00 AM - 06:00 PM' },
  { cropName: 'Paddy (Grade-A)', variety: 'Superfine FAQ', season: 'Kharif', mspRate: 2320, maxMoisturePct: 17.0, startDate: '2026-10-01', endDate: '2026-12-31', operatingHours: '08:00 AM - 06:00 PM' },
  { cropName: 'Mustard (Sarson)', variety: 'Yellow / Black FAQ', season: 'Rabi', mspRate: 5950, maxMoisturePct: 8.0, startDate: '2026-03-25', endDate: '2026-05-30', operatingHours: '08:00 AM - 05:00 PM' }
];

const seedCenters = [
  { centerCode: 'KS-MND-01', name: 'Kheragarh Krishi Utpadan Mandi', district: 'Agra', tehsil: 'Kheragarh', pincode: '283121', distanceKm: 4.2, dailyMaxCapacityQtl: 1200, bookedQtl: 650, liveQueueCount: 5, bardanaStockBags: 4200 },
  { centerCode: 'KS-MND-02', name: 'Fatehabad PACS Procurement Center', district: 'Agra', tehsil: 'Fatehabad', pincode: '283111', distanceKm: 14.8, dailyMaxCapacityQtl: 1000, bookedQtl: 890, liveQueueCount: 14, bardanaStockBags: 1800 },
  { centerCode: 'KS-MND-03', name: 'Bilaspur Model Mandi Samiti', district: 'Rampur', tehsil: 'Bilaspur', pincode: '244921', distanceKm: 19.5, dailyMaxCapacityQtl: 1600, bookedQtl: 480, liveQueueCount: 3, bardanaStockBags: 6000 }
];

const seedTokens = [
  {
    tokenId: 'KS-2026-1042',
    farmerName: 'Ramesh Chandra Verma',
    farmerMobile: '9876543210',
    khasraNo: 'KH-402/1B',
    cropName: 'Paddy (Dhan - Common)',
    mspRate: 2300,
    estQuintals: 45,
    centerCode: 'KS-MND-01',
    centerName: 'Kheragarh Krishi Utpadan Mandi',
    slotDate: '2026-11-04',
    slotWindow: '08:00 AM - 10:00 AM',
    qrSignature: signPayload({ id: 'KS-2026-1042', qtl: 45 }),
    status: 'GATE_CHECKED_IN',
    gateEntry: { vehicleNo: 'UP-80-BT-4419', queueNumber: 4, assignedBay: 'Bay-2 (Main Kata)', checkedInAt: new Date() },
    timeline: [
      { stage: 'SLOT_CONFIRMED', note: 'Booked 45 Quintals for 08:00 AM - 10:00 AM. Capacity locked.', timestamp: new Date(Date.now() - 3600000) },
      { stage: 'GATE_CHECKED_IN', note: 'QR verified at Gate. Tractor UP-80-BT-4419 assigned Queue #4.', timestamp: new Date() }
    ]
  }
];

let memory = {
  schedules: JSON.parse(JSON.stringify(seedSchedules)),
  centers: JSON.parse(JSON.stringify(seedCenters)),
  tokens: JSON.parse(JSON.stringify(seedTokens))
};

let lastDbError = null;
let isSeeded = false;

async function connectDB() {
  if (!MONGODB_URI) {
    lastDbError = 'Set MONGODB_URI or MONGO_URI in Vercel Environment Variables';
    return false;
  }
  if (mongoose.connection.readyState === 1) return true;
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
    lastDbError = null;
    if (!isSeeded) {
      if ((await Schedule.countDocuments()) === 0) await Schedule.insertMany(seedSchedules);
      if ((await Center.countDocuments()) === 0) await Center.insertMany(seedCenters);
      if ((await Token.countDocuments()) === 0) await Token.insertMany(seedTokens);
      isSeeded = true;
    }
    return true;
  } catch (err) {
    lastDbError = err.message;
    return false;
  }
}

// ============================================================================
// 3. KISANSETU REST API ROUTES
// ============================================================================
// Moved from "/" to "/api/status" so "/" loads the full website!
app.get('/api/status', async (req, res) => {
  const connected = await connectDB();
  res.json({
    message: 'KisanSetu API is running',
    dbConnected: connected,
    mode: connected ? 'MongoDB Atlas Connected' : 'In-Memory Active Mode',
    errorHint: lastDbError
  });
});

app.get('/healthz', async (req, res) => {
  const connected = await connectDB();
  res.status(200).json({
    ok: true,
    name: 'KisanSetu',
    dbConnected: connected,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/public/schedules', async (req, res) => {
  const connected = await connectDB();
  const data = connected ? await Schedule.find().lean() : memory.schedules;
  res.json(data);
});

app.get('/api/v1/public/centers', async (req, res) => {
  const connected = await connectDB();
  const data = connected ? await Center.find().lean() : memory.centers;
  res.json(data);
});

app.get('/api/v1/tokens', async (req, res) => {
  const connected = await connectDB();
  const data = connected ? await Token.find().sort({ createdAt: -1 }).lean() : memory.tokens;
  res.json(data);
});

app.get('/api/v1/tokens/:tokenId/timeline', async (req, res) => {
  const connected = await connectDB();
  const id = req.params.tokenId.toUpperCase();
  const token = connected ? await Token.findOne({ tokenId: id }).lean() : memory.tokens.find((t) => t.tokenId.toUpperCase() === id);
  if (!token) return res.status(404).json({ error: 'Token ID not found' });
  res.json(token);
});

app.post('/api/v1/tokens/book', async (req, res) => {
  const connected = await connectDB();
  const { farmerName, farmerMobile, cropName, estQuintals, centerCode, slotDate, slotWindow } = req.body;
  const qty = Number(estQuintals) || 30;

  const schedules = connected ? await Schedule.find().lean() : memory.schedules;
  const crop = schedules.find((s) => s.cropName === cropName) || schedules[0];
  const center = connected ? await Center.findOne({ centerCode }) : memory.centers.find((c) => c.centerCode === centerCode);

  if (!center) return res.status(404).json({ error: 'Center not found' });
  if (center.bookedQtl + qty > center.dailyMaxCapacityQtl) {
    return res.status(400).json({ error: 'Center capacity full for this date. Select an alternate Mandi.' });
  }

  const tokenId = 'KS-2026-' + Math.floor(1000 + Math.random() * 9000);
  const newToken = {
    tokenId,
    farmerName: farmerName || 'Ramesh Chandra Verma',
    farmerMobile: farmerMobile || '9876543210',
    khasraNo: 'KH-402/1B',
    cropName: crop.cropName,
    mspRate: crop.mspRate,
    estQuintals: qty,
    centerCode: center.centerCode,
    centerName: center.name,
    slotDate: slotDate || '2026-11-05',
    slotWindow: slotWindow || '08:00 AM - 10:00 AM',
    qrSignature: signPayload({ tokenId, qty, slotDate }),
    status: 'SLOT_CONFIRMED',
    timeline: [{ stage: 'SLOT_CONFIRMED', note: `Booked ${qty} Qtl of ${crop.cropName} at ${center.name} (${slotWindow}).`, timestamp: new Date() }]
  };

  if (connected) {
    center.bookedQtl += qty;
    await center.save();
    const created = await Token.create(newToken);
    return res.status(201).json(created);
  }
  center.bookedQtl += qty;
  memory.tokens.unshift(newToken);
  res.status(201).json(newToken);
});

app.patch('/api/v1/admin/tokens/:tokenId/gate-checkin', async (req, res) => {
  const connected = await connectDB();
  const id = req.params.tokenId.toUpperCase();
  const queueNo = Math.floor(1 + Math.random() * 10);
  const gateEntry = { vehicleNo: (req.body.vehicleNo || 'UP-80-BT-4419').toUpperCase(), queueNumber: queueNo, assignedBay: 'Bay-1 (Main Kata)', checkedInAt: new Date() };
  const log = { stage: 'GATE_CHECKED_IN', note: `Gate QR verified. Vehicle ${gateEntry.vehicleNo} assigned Queue #${queueNo}.`, timestamp: new Date() };

  if (connected) {
    const updated = await Token.findOneAndUpdate({ tokenId: id }, { status: 'GATE_CHECKED_IN', gateEntry, $push: { timeline: log } }, { new: true });
    return res.json(updated);
  }
  const token = memory.tokens.find((t) => t.tokenId === id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  token.status = 'GATE_CHECKED_IN';
  token.gateEntry = gateEntry;
  token.timeline.push(log);
  res.json(token);
});

app.post('/api/v1/admin/tokens/:tokenId/quality-check', async (req, res) => {
  const connected = await connectDB();
  const id = req.params.tokenId.toUpperCase();
  const decision = req.body.decision || 'QUALITY_APPROVED';
  const qualityReport = { sampleId: 'SMP-' + Math.floor(1000 + Math.random() * 9000), moisturePct: Number(req.body.moisturePct) || 13.2, foreignMatterPct: 0.4, remarks: 'FAQ verified', gradedAt: new Date() };
  const log = { stage: decision, note: `Quality Graded: Moisture ${qualityReport.moisturePct}% -> ${decision}.`, timestamp: new Date() };

  if (connected) {
    const updated = await Token.findOneAndUpdate({ tokenId: id }, { status: decision, qualityReport, $push: { timeline: log } }, { new: true });
    return res.json(updated);
  }
  const token = memory.tokens.find((t) => t.tokenId === id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  token.status = decision;
  token.qualityReport = qualityReport;
  token.timeline.push(log);
  res.json(token);
});

app.post('/api/v1/admin/tokens/:tokenId/weighing', async (req, res) => {
  const connected = await connectDB();
  const id = req.params.tokenId.toUpperCase();
  const gross = Number(req.body.grossWeightQtl) || 68.5;
  const tare = Number(req.body.tareWeightQtl) || 23.0;
  const bags = Number(req.body.gunnyBagCount) || 90;
  const bagDeduction = Number((bags * 0.005).toFixed(2));
  const netWeight = Number(Math.max(0, gross - tare - bagDeduction).toFixed(2));

  const weighbridge = { grossWeightQtl: gross, tareWeightQtl: tare, gunnyBagCount: bags, bagTareDeductionQtl: bagDeduction, netWeightQtl: netWeight, weighedAt: new Date() };
  const log = { stage: 'WEIGHING_COMPLETED', note: `Weighbridge: Gross ${gross} - Tare ${tare} - Bags ${bagDeduction} = Net ${netWeight} Qtl.`, timestamp: new Date() };

  if (connected) {
    const updated = await Token.findOneAndUpdate({ tokenId: id }, { status: 'WEIGHING_COMPLETED', weighbridge, $push: { timeline: log } }, { new: true });
    return res.json(updated);
  }
  const token = memory.tokens.find((t) => t.tokenId === id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  token.status = 'WEIGHING_COMPLETED';
  token.weighbridge = weighbridge;
  token.timeline.push(log);
  res.json(token);
});

app.post('/api/v1/admin/tokens/:tokenId/settlement', async (req, res) => {
  const connected = await connectDB();
  const id = req.params.tokenId.toUpperCase();
  let token = connected ? await Token.findOne({ tokenId: id }) : memory.tokens.find((t) => t.tokenId === id);
  if (!token) return res.status(404).json({ error: 'Token not found' });

  const netQtl = token.weighbridge?.netWeightQtl || token.estQuintals;
  const netPayableInr = Math.round(netQtl * token.mspRate);
  const jFormId = 'JF-2026-' + Math.floor(10000 + Math.random() * 90000);
  const utrNumber = 'SBIN26' + Math.floor(100000000 + Math.random() * 900000000);

  const settlement = { jFormId, netPayableInr, utrNumber, settledAt: new Date() };
  const log1 = { stage: 'RECEIPT_GENERATED', note: `Digital J-Form ${jFormId} issued for ${netQtl} Qtl @ ₹${token.mspRate}/Qtl.`, timestamp: new Date() };
  const log2 = { stage: 'PAYMENT_SETTLED', note: `DBT ₹${netPayableInr.toLocaleString('en-IN')} credited. UTR: ${utrNumber}.`, timestamp: new Date() };

  if (connected) {
    token.status = 'PAYMENT_SETTLED';
    token.settlement = settlement;
    token.timeline.push(log1, log2);
    await token.save();
    return res.json(token);
  }
  token.status = 'PAYMENT_SETTLED';
  token.settlement = settlement;
  token.timeline.push(log1, log2);
  res.json(token);
});

// ============================================================================
// 4. KISANSETU FULL FRONTEND UI SERVED AT "/"
// ============================================================================
const KISANSETU_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KisanSetu | Smart Agricultural Procurement Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .portal-active { background-color: #15803d; color: #fff; font-weight: 700; }
    .tab-active { border-bottom: 3px solid #15803d; color: #15803d; font-weight: 700; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
  <div class="bg-slate-900 text-slate-200 text-xs py-2 px-4 flex flex-wrap justify-between items-center gap-2">
    <div class="flex items-center gap-2">
      <span id="dbBadge" class="px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-300 font-medium">Checking KisanSetu API...</span>
      <span id="dbHint" class="text-slate-400"></span>
    </div>
    <span>KisanSetu Toll-Free IVR: <strong>1800-180-1551</strong></span>
  </div>

  <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-green-700 text-white flex items-center justify-center font-bold text-lg">KS</div>
        <div>
          <h1 class="text-lg font-bold">KisanSetu Smart Mandi Portal</h1>
          <p class="text-xs text-slate-500">Slot Booking • Live Queue • Digital J-Form & DBT Settlement</p>
        </div>
      </div>
      <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-sm">
        <button onclick="setPortal('public')" id="p-public" class="px-4 py-2 rounded-lg portal-active">1. Public Discovery</button>
        <button onclick="setPortal('farmer')" id="p-farmer" class="px-4 py-2 rounded-lg text-slate-700">2. Farmer Portal</button>
        <button onclick="setPortal('admin')" id="p-admin" class="px-4 py-2 rounded-lg text-slate-700">3. Mandi Officer Admin</button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto w-full px-4 py-6 flex-1 space-y-6">
    <!-- PORTAL 1: PUBLIC -->
    <section id="view-public" class="space-y-5">
      <div class="bg-gradient-to-r from-green-800 to-emerald-700 rounded-2xl p-6 text-white flex flex-wrap justify-between items-center gap-4">
        <div class="max-w-2xl">
          <h2 class="text-2xl font-bold">KisanSetu Zero-Queue Agricultural Procurement</h2>
          <p class="text-green-100 text-sm mt-1">View live MSP procurement schedules, check Mandi capacity, and book your 2-hour arrival slot before bringing your harvest.</p>
        </div>
        <div class="flex gap-3">
          <button onclick="setPortal('farmer'); setFarmerTab('book');" class="bg-white text-green-800 font-bold px-4 py-2.5 rounded-xl text-sm shadow">Book Slot Now →</button>
          <button onclick="setPortal('farmer'); setFarmerTab('track');" class="bg-green-900/60 border border-green-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm">Track Token Status</button>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4" id="centersContainer"></div>

      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 class="font-bold text-base mb-3">Live Crop Procurement Schedule & Official MSP Rates</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-slate-100 border-b border-slate-200">
                <th class="p-3">Crop & Variety</th>
                <th class="p-3">Season</th>
                <th class="p-3">MSP Rate</th>
                <th class="p-3">Max Moisture</th>
                <th class="p-3">Active Window</th>
              </tr>
            </thead>
            <tbody id="scheduleRows" class="divide-y divide-slate-200"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- PORTAL 2: FARMER -->
    <section id="view-farmer" class="hidden space-y-5">
      <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <span class="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">KisanSetu Verified Farmer</span>
          <h2 class="text-base font-bold mt-1">Ramesh Chandra Verma • Khasra: KH-402/1B (Max Eligible: 135 Qtl)</h2>
        </div>
        <div class="flex gap-3 text-sm">
          <button onclick="setFarmerTab('list')" id="ft-list" class="pb-2 tab-active">My e-Tokens & J-Forms</button>
          <button onclick="setFarmerTab('book')" id="ft-book" class="pb-2 text-slate-600">+ Book Smart Slot</button>
          <button onclick="setFarmerTab('track')" id="ft-track" class="pb-2 text-slate-600">Live 6-Stage Tracker</button>
        </div>
      </div>

      <div id="f-list" class="grid md:grid-cols-2 gap-4"></div>

      <div id="f-book" class="hidden bg-white rounded-xl border border-slate-200 p-6 max-w-2xl mx-auto">
        <h3 class="font-bold text-base mb-4">Book a 2-Hour Mandi Arrival Slot</h3>
        <form onsubmit="bookSlot(event)" class="space-y-4 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Farmer Name</label>
              <input id="bName" required value="Ramesh Chandra Verma" class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">Mobile Number</label>
              <input id="bMobile" required value="9876543210" class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Select Crop</label>
              <select id="bCrop" class="w-full border rounded-lg px-3 py-2">
                <option value="Paddy (Dhan - Common)">Paddy (Dhan - Common) — ₹2,300/Qtl</option>
                <option value="Wheat (Gehu)">Wheat (Gehu) — ₹2,425/Qtl</option>
                <option value="Mustard (Sarson)">Mustard (Sarson) — ₹5,950/Qtl</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Estimated Quantity (Quintals)</label>
              <input id="bQty" type="number" value="40" required class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-medium mb-1">Mandi Center</label>
              <select id="bCenter" class="w-full border rounded-lg px-3 py-2">
                <option value="KS-MND-01">Kheragarh Mandi</option>
                <option value="KS-MND-02">Fatehabad PACS</option>
                <option value="KS-MND-03">Bilaspur Model Mandi</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Arrival Date</label>
              <input id="bDate" type="date" value="2026-11-05" required class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block font-medium mb-1">2-Hr Time Window</label>
              <select id="bWindow" class="w-full border rounded-lg px-3 py-2">
                <option>08:00 AM - 10:00 AM</option>
                <option>10:00 AM - 12:00 PM</option>
                <option>01:00 PM - 03:00 PM</option>
              </select>
            </div>
          </div>
          <button type="submit" class="w-full bg-green-700 text-white font-bold py-2.5 rounded-xl">Generate QR e-Token & Lock Slot</button>
        </form>
      </div>

      <div id="f-track" class="hidden bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div class="flex gap-2 items-center">
          <input id="trackId" value="KS-2026-1042" class="border rounded-lg px-3 py-1.5 text-sm font-mono" />
          <button onclick="loadTracker()" class="bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">Track Status</button>
        </div>
        <div id="trackerOutput"></div>
      </div>
    </section>

    <!-- PORTAL 3: ADMIN -->
    <section id="view-admin" class="hidden space-y-5">
      <div class="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 class="text-lg font-bold">KisanSetu Officer Operations Console</h2>
          <p class="text-xs text-slate-300">Select an active token and push it through Gate Check-In, Quality Testing, Weighbridge & DBT Settlement.</p>
        </div>
        <select id="admTokenSelect" class="bg-slate-800 text-amber-300 font-mono text-sm px-3 py-2 rounded border border-slate-700"></select>
      </div>

      <div class="grid md:grid-cols-2 gap-4 text-sm">
        <div class="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 class="font-bold">1. Gate Check-In Console</h3>
          <input id="admVehicle" value="UP-80-BT-4419" placeholder="Tractor Number" class="w-full border rounded-lg px-3 py-2" />
          <button onclick="runAdminGate()" class="w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Verify QR & Assign Queue</button>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 class="font-bold">2. Quality & Moisture Desk</h3>
          <div class="grid grid-cols-2 gap-2">
            <input id="admMoisture" type="number" step="0.1" value="13.2" placeholder="Moisture %" class="border rounded-lg px-3 py-2" />
            <select id="admDecision" class="border rounded-lg px-3 py-2">
              <option value="QUALITY_APPROVED">Approve (FAQ)</option>
              <option value="ON_HOLD">Hold for Drying</option>
            </select>
          </div>
          <button onclick="runAdminQuality()" class="w-full bg-purple-700 text-white font-semibold py-2 rounded-lg">Save Quality Grade</button>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 class="font-bold">3. Weighbridge (Kata) Desk</h3>
          <div class="grid grid-cols-3 gap-2">
            <input id="admGross" type="number" step="0.1" value="68.5" placeholder="Gross Qtl" class="border rounded-lg px-2 py-2" />
            <input id="admTare" type="number" step="0.1" value="23.0" placeholder="Tare Qtl" class="border rounded-lg px-2 py-2" />
            <input id="admBags" type="number" value="90" placeholder="Bags" class="border rounded-lg px-2 py-2" />
          </div>
          <button onclick="runAdminWeigh()" class="w-full bg-amber-600 text-white font-semibold py-2 rounded-lg">Record Net Weight</button>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 class="font-bold">4. Digital J-Form & DBT Settlement</h3>
          <p class="text-xs text-slate-500">Auto-calculates Net Weight × MSP Rate, generates Digital J-Form ID, and issues Bank UTR.</p>
          <button onclick="runAdminSettle()" class="w-full bg-emerald-700 text-white font-semibold py-2 rounded-lg">Generate J-Form & Settle Payment</button>
        </div>
      </div>
    </section>
  </main>

  <script>
    async function init() {
      const h = await fetch('/api/status').then(r => r.json());
      const badge = document.getElementById('dbBadge');
      const hint = document.getElementById('dbHint');
      badge.textContent = '● ' + h.message + ' (' + h.mode + ')';
      hint.textContent = h.errorHint ? '[' + h.errorHint + ']' : '';

      const schedules = await fetch('/api/v1/public/schedules').then(r => r.json());
      document.getElementById('scheduleRows').innerHTML = schedules.map(s => \`
        <tr>
          <td class="p-3 font-semibold">\${s.cropName} <span class="text-xs text-slate-500 block">\${s.variety}</span></td>
          <td class="p-3">\${s.season}</td>
          <td class="p-3 font-bold text-green-700">₹\${s.mspRate}/Qtl</td>
          <td class="p-3">≤ \${s.maxMoisturePct}%</td>
          <td class="p-3 text-xs">\${s.startDate} to \${s.endDate}</td>
        </tr>
      \`).join('');

      const centers = await fetch('/api/v1/public/centers').then(r => r.json());
      document.getElementById('centersContainer').innerHTML = centers.map(c => {
        const pct = Math.round((c.bookedQtl / c.dailyMaxCapacityQtl) * 100);
        return \`
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
            <div class="flex justify-between text-xs">
              <span class="font-mono text-slate-500">\${c.centerCode}</span>
              <span class="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">\${pct}% Booked</span>
            </div>
            <h4 class="font-bold">\${c.name}</h4>
            <p class="text-xs text-slate-500">\${c.tehsil}, \${c.district} (\${c.distanceKm} km)</p>
            <div class="text-xs bg-slate-50 p-2 rounded border border-slate-100">
              Capacity: <strong>\${c.bookedQtl}/\${c.dailyMaxCapacityQtl} Qtl</strong> • Live Queue: <strong>\${c.liveQueueCount} Tractors</strong>
            </div>
          </div>
        \`;
      }).join('');
    }

    function setPortal(p) {
      ['public', 'farmer', 'admin'].forEach(x => {
        document.getElementById('view-' + x).classList.toggle('hidden', x !== p);
        document.getElementById('p-' + x).classList.toggle('portal-active', x === p);
      });
      if (p === 'farmer') { loadTokens(); loadTracker(); }
      if (p === 'admin') { loadAdminDropdown(); }
    }

    function setFarmerTab(t) {
      ['list', 'book', 'track'].forEach(x => {
        document.getElementById('f-' + x).classList.toggle('hidden', x !== t);
        document.getElementById('ft-' + x).classList.toggle('tab-active', x === t);
      });
      if (t === 'list') loadTokens();
      if (t === 'track') loadTracker();
    }

    async function loadTokens() {
      const tokens = await fetch('/api/v1/tokens').then(r => r.json());
      document.getElementById('f-list').innerHTML = tokens.map(t => \`
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
          <div class="flex justify-between">
            <span class="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded">\${t.tokenId}</span>
            <span class="text-xs font-bold text-green-700">\${t.status}</span>
          </div>
          <h4 class="font-bold">\${t.cropName} — \${t.estQuintals} Qtl</h4>
          <p class="text-xs text-slate-500">\${t.centerName} • \${t.slotDate} (\${t.slotWindow})</p>
          \${t.settlement?.jFormId ? \`<div class="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs"><strong>J-Form \${t.settlement.jFormId}:</strong> Paid ₹\${t.settlement.netPayableInr.toLocaleString('en-IN')} (UTR: \${t.settlement.utrNumber})</div>\` : ''}
          <button onclick="document.getElementById('trackId').value='\${t.tokenId}'; setFarmerTab('track');" class="w-full bg-slate-900 text-white text-xs py-2 rounded-lg font-semibold">Track 6-Stage Progress</button>
        </div>
      \`).join('');
    }

    async function bookSlot(e) {
      e.preventDefault();
      const res = await fetch('/api/v1/tokens/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: document.getElementById('bName').value,
          farmerMobile: document.getElementById('bMobile').value,
          cropName: document.getElementById('bCrop').value,
          estQuintals: document.getElementById('bQty').value,
          centerCode: document.getElementById('bCenter').value,
          slotDate: document.getElementById('bDate').value,
          slotWindow: document.getElementById('bWindow').value
        })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);
      document.getElementById('trackId').value = data.tokenId;
      setFarmerTab('track');
      init();
    }

    async function loadTracker() {
      const id = document.getElementById('trackId').value.trim();
      const res = await fetch('/api/v1/tokens/' + encodeURIComponent(id) + '/timeline');
      const box = document.getElementById('trackerOutput');
      if (!res.ok) { box.innerHTML = '<p class="text-red-600 text-sm">Token not found.</p>'; return; }
      const t = await res.json();
      const stages = ['SLOT_CONFIRMED', 'GATE_CHECKED_IN', 'QUALITY_APPROVED', 'WEIGHING_COMPLETED', 'RECEIPT_GENERATED', 'PAYMENT_SETTLED'];
      const doneSet = new Set(t.timeline.map(x => x.stage));
      box.innerHTML = \`
        <div class="mb-4">
          <h4 class="font-bold text-base">\${t.tokenId}: \${t.farmerName} (\${t.cropName} — \${t.estQuintals} Qtl)</h4>
          <p class="text-xs text-slate-500">Current State: <strong>\${t.status}</strong> • QR HMAC: \${t.qrSignature}</p>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            \${stages.map((s, idx) => \`
              <div class="p-2.5 rounded-lg border text-xs font-semibold \${doneSet.has(s) ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 text-slate-400'}">
                \${doneSet.has(s) ? '✓' : (idx + 1) + '.'} \${s}
              </div>
            \`).join('')}
          </div>
          <div class="space-y-2">
            \${t.timeline.map(l => \`
              <div class="p-2.5 rounded border bg-slate-50 text-xs">
                <strong>\${l.stage}</strong>: \${l.note}
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    async function loadAdminDropdown() {
      const tokens = await fetch('/api/v1/tokens').then(r => r.json());
      document.getElementById('admTokenSelect').innerHTML = tokens.map(t => \`
        <option value="\${t.tokenId}">\${t.tokenId} — \${t.farmerName} [\${t.status}]</option>
      \`).join('');
    }

    async function runAdminGate() {
      const id = document.getElementById('admTokenSelect').value;
      await fetch('/api/v1/admin/tokens/' + id + '/gate-checkin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNo: document.getElementById('admVehicle').value })
      });
      alert('Gate Check-In Recorded for ' + id);
      loadAdminDropdown();
    }

    async function runAdminQuality() {
      const id = document.getElementById('admTokenSelect').value;
      await fetch('/api/v1/admin/tokens/' + id + '/quality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moisturePct: document.getElementById('admMoisture').value,
          decision: document.getElementById('admDecision').value
        })
      });
      alert('Quality Grade Recorded for ' + id);
      loadAdminDropdown();
    }

    async function runAdminWeigh() {
      const id = document.getElementById('admTokenSelect').value;
      await fetch('/api/v1/admin/tokens/' + id + '/weighing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grossWeightQtl: document.getElementById('admGross').value,
          tareWeightQtl: document.getElementById('admTare').value,
          gunnyBagCount: document.getElementById('admBags').value
        })
      });
      alert('Weighbridge Net Weight Recorded for ' + id);
      loadAdminDropdown();
    }

    async function runAdminSettle() {
      const id = document.getElementById('admTokenSelect').value;
      await fetch('/api/v1/admin/tokens/' + id + '/settlement', { method: 'POST' });
      alert('Digital J-Form & DBT Payment Settled for ' + id);
      loadAdminDropdown();
    }

    init();
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.sendFile(frontendIndexPath);
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(frontendIndexPath);
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`KisanSetu running on http://localhost:${PORT}`));
}

module.exports = app;