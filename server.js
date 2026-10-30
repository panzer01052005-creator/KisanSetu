const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection failed:', err.message));
}

const schedules = [
  { crop: 'Wheat / HD-3086', mspRate: '₹2,275', procurementWindow: '01 Nov – 30 Nov', operatingHours: '08:00–18:00', capacity: '92% full' },
  { crop: 'Paddy / PB-1509', mspRate: '₹2,150', procurementWindow: '05 Nov – 30 Nov', operatingHours: '08:00–17:00', capacity: '68% full' },
  { crop: 'Mustard / RH-749', mspRate: '₹5,450', procurementWindow: '08 Nov – 25 Nov', operatingHours: '09:00–16:00', capacity: '54% full' }
];

const centers = [
  { id: 'pacs-manesar', name: 'PACS Manesar', district: 'Gurugram', tehsil: 'Manesar', pincode: '122051', crop: 'Wheat', queueCount: 180, capacity: 52, status: 'green', operatingHours: '08:00–18:00', facilityBadges: ['Covered shed', 'Bardana', 'Moisture testing'] },
  { id: 'shikohpur-mandi', name: 'Shikohpur Mandi', district: 'Gurugram', tehsil: 'Sohna', pincode: '122102', crop: 'Paddy', queueCount: 260, capacity: 78, status: 'amber', operatingHours: '08:00–17:00', facilityBadges: ['DBT enabled', 'Lodging', 'Water point'] },
  { id: 'gurugram-pacs', name: 'Gurugram PACS', district: 'Gurugram', tehsil: 'Gurugram', pincode: '122001', crop: 'Mustard', queueCount: 420, capacity: 100, status: 'red', operatingHours: '09:00–16:00', facilityBadges: ['Covered shed', 'Weighbridge', 'Bardana'] }
];

const faqNorms = {
  wheat: {
    crop: 'Wheat',
    maxMoisture: 14,
    maxForeignMatter: 2,
    maxDamagedGrain: 3,
    bardana: '2 bags per quintal',
    packing: 'Moisture-safe gunny packaging required.'
  },
  paddy: {
    crop: 'Paddy',
    maxMoisture: 17,
    maxForeignMatter: 2,
    maxDamagedGrain: 4,
    bardana: '2 bags per quintal',
    packing: 'Dry storage or sealed cover recommended.'
  },
  mustard: {
    crop: 'Mustard',
    maxMoisture: 8,
    maxForeignMatter: 1.5,
    maxDamagedGrain: 2,
    bardana: '2 bags per quintal',
    packing: 'Grain must be dry and clean before dispatch.'
  }
};

const supportTickets = [];

const issueSlaMap = {
  'Weighing Discrepancy': 4,
  'Unfair Quality Rejection': 4,
  'Delayed Payment': 6,
  'Officer Misconduct': 2,
  'Other': 8
};

function buildTicketId() {
  return 'MSD-' + String(Date.now()).slice(-6);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'kisan-setu', timestamp: new Date().toISOString() });
});

app.get('/api/v1/public/schedules', (req, res) => {
  res.json({ success: true, data: schedules });
});

app.get('/api/v1/public/centers', (req, res) => {
  res.json({ success: true, data: centers });
});

app.get('/api/v1/public/faq-norms/:cropId', (req, res) => {
  const crop = String(req.params.cropId || '').toLowerCase();
  const details = faqNorms[crop] || faqNorms.wheat;
  res.json({ success: true, data: details });
});

app.post('/api/v1/support/tickets', (req, res) => {
  const { farmerMobile, tokenId, centerName, issueCategory, description, imageName, voiceNoteName } = req.body || {};

  if (!farmerMobile || !/^\d{10}$/.test(String(farmerMobile))) {
    return res.status(400).json({ success: false, message: 'A valid 10-digit mobile number is required.' });
  }

  if (!centerName || !issueCategory || !description || !String(description).trim()) {
    return res.status(400).json({ success: false, message: 'Center, issue category, and description are required.' });
  }

  const ticketId = buildTicketId();
  const issueKey = issueCategory || 'Other';
  const slaHours = issueSlaMap[issueKey] || 8;
  const createdAt = new Date().toISOString();

  const ticket = {
    ticketId,
    farmerMobile: String(farmerMobile),
    tokenId: tokenId || null,
    centerName,
    issueCategory: issueKey,
    description: String(description).trim(),
    attachments: {
      image: imageName || null,
      voiceNote: voiceNoteName || null
    },
    status: 'Submitted',
    assignedDepartment: 'District Nodal Officer',
    slaHours,
    slaDeadline: new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString(),
    createdAt,
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: createdAt,
        note: 'Ticket submitted and routed to district nodal officer.'
      }
    ],
    notification: {
      mode: 'demo',
      status: 'Mock SMS + dashboard alert queued',
      recipient: 'district_nodal_officer'
    }
  };

  supportTickets.push(ticket);

  return res.status(201).json({
    success: true,
    message: 'Grievance submitted successfully and routed to the district nodal officer.',
    data: ticket
  });
});

app.get('/api/v1/support/tickets/:ticketId', (req, res) => {
  const { ticketId } = req.params;
  const { mobile } = req.query;
  const ticket = supportTickets.find((item) => item.ticketId === ticketId);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' });
  }

  if (!mobile || ticket.farmerMobile !== String(mobile).replace(/\D/g, '')) {
    return res.status(403).json({ success: false, message: 'Ticket lookup requires a valid mobile number match for privacy protection.' });
  }

  return res.json({ success: true, data: ticket });
});

app.post('/api/v1/auth/send-otp', (req, res) => {
  const { mobile } = req.body || {};
  if (!mobile || !/^\d{10}$/.test(String(mobile))) {
    return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number is required.' });
  }
  res.json({ success: true, message: 'OTP sent successfully', otpHint: '123456' });
});

app.post('/api/v1/auth/verify-otp', (req, res) => {
  const { otp } = req.body || {};
  if (!otp || !/^\d{6}$/.test(String(otp))) {
    return res.status(400).json({ success: false, message: 'Valid 6-digit OTP is required.' });
  }
  res.json({
    success: true,
    token: 'demo.jwt.token.for.farmer',
    user: {
      role: 'FARMER',
      farmerId: 'KN-238917',
      name: 'Rahul Singh'
    }
  });
});

app.get('/api/v1/farmer/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      activeToken: 'KSM-40188',
      queuePosition: 3,
      slot: '10:00–12:00',
      center: 'PACS Manesar',
      seasonSales: { wheat: '₹1.1L', paddy: '₹0.7L', mustard: '₹0.5L' },
      eligibleQuintals: 118,
      dbtStatus: 'SETTLED'
    }
  });
});

app.get('/api/v1/farmer/land-records', (req, res) => {
  res.json({
    success: true,
    data: {
      aadhaarStatus: 'VERIFIED',
      npciBankStatus: 'ACTIVE',
      khatauni: 'APPROVED',
      cultivatedAreaAcres: 6.5,
      regionalYieldBenchmark: 18,
      maxEligibleQuintals: 117
    }
  });
});

app.post('/api/v1/tokens/book', (req, res) => {
  const payload = {
    token_id: 'KSM-40188',
    farmer_name: req.body?.farmer_name || 'Rahul Singh',
    crop: req.body?.crop || 'Wheat',
    est_weight: req.body?.est_weight || '18 qtl',
    slot_date: req.body?.slot_date || '2026-11-02'
  };

  res.status(201).json({
    success: true,
    data: {
      tokenId: 'KSM-40188',
      status: 'BOOKED',
      qrPayload: payload,
      signed: true,
      hmac: 'demo-signature'
    }
  });
});

app.get('/api/v1/tokens/:tokenId/timeline', (req, res) => {
  res.json({
    success: true,
    data: [
      { step: 1, status: 'SLOT_CONFIRMED', title: 'Slot Confirmed', description: '10:00–12:00 • PACS Manesar' },
      { step: 2, status: 'GATE_CHECKED_IN', title: 'Gate Entry Checked-In', description: 'Vehicle verified and queue assigned.' },
      { step: 3, status: 'QUALITY_APPROVED', title: 'Quality & Moisture Graded', description: 'Moisture 12.4% • Approved.' },
      { step: 4, status: 'WEIGHBRIDGE_COMPLETED', title: 'Weighbridge Completed', description: 'Net weight 4100 kg.' },
      { step: 5, status: 'J_FORM_ISSUED', title: 'Digital Receipt Issued', description: 'Signed J-form available in vault.' },
      { step: 6, status: 'PAYMENT_SETTLED', title: 'Payment / DBT Settled', description: 'UTR 24112371 • ₹9,328.75' }
    ]
  });
});

app.get('/api/v1/farmer/receipts', (req, res) => {
  res.json({
    success: true,
    data: [
      { type: 'gate-pass', file: 'GP-40188.pdf', status: 'READY' },
      { type: 'quality-report', file: 'QR-40188.pdf', status: 'SIGNED' },
      { type: 'payment-slip', file: 'UTR-24112371.pdf', status: 'DBT_CLEARED' }
    ]
  });
});

app.put('/api/v1/admin/centers/:id/capacity', (req, res) => {
  res.json({ success: true, message: 'Capacity updated successfully', centerId: req.params.id, data: req.body });
});

app.post('/api/v1/admin/centers/:id/bulk-reschedule', (req, res) => {
  res.json({ success: true, message: 'Bulk reschedule queued with SMS alerts', centerId: req.params.id, data: req.body });
});

app.patch('/api/v1/admin/tokens/:id/gate-checkin', (req, res) => {
  res.json({ success: true, message: 'Gate check-in recorded', tokenId: req.params.id, status: 'GATE_CHECKED_IN' });
});

app.post('/api/v1/admin/tokens/:id/quality-check', (req, res) => {
  res.json({ success: true, message: 'Quality check logged', tokenId: req.params.id, status: 'QUALITY_APPROVED' });
});

app.post('/api/v1/admin/tokens/:id/weighing', (req, res) => {
  const gross = Number(req.body?.grossWeight || 6200);
  const tare = Number(req.body?.tareWeight || 1450);
  const bagCount = Number(req.body?.bagCount || 15);
  const bagTareWeight = 3.5;
  const netWeight = gross - tare - (bagCount * bagTareWeight);

  res.json({
    success: true,
    tokenId: req.params.id,
    netWeightKg: Number(netWeight.toFixed(2)),
    status: 'WEIGHBRIDGE_COMPLETED'
  });
});

app.post('/api/v1/admin/tokens/:id/generate-receipt', (req, res) => {
  res.json({ success: true, message: 'Digital J-Form generated and signed', tokenId: req.params.id });
});

app.post('/api/v1/webhooks/payment-status', (req, res) => {
  res.json({ success: true, message: 'Payment status webhook processed', status: 'SETTLED' });
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`KisanSetu server running on http://localhost:${PORT}`);
  });
}
