const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

app.use(cors());
app.use(express.json());

// PDF Report Download Route
app.post('/api/pdf/report', (req, res) => {
  const { animalId, riskLevel, matchedConditions, incidentDetails, timestamp, download } = req.body;
  const isUrgent = riskLevel === 'URGENT' || riskLevel === 'High';
  const caseId = incidentDetails?.caseId || `PS-${Date.now().toString().slice(-6)}`;
  
  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>PashuSuraksha Clinical Triage Report - ${caseId}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 30px; color: #111827; background: #fff; line-height: 1.5; font-size: 13px; }
        .header { border-bottom: 2px solid #0F2F5C; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
        .title { font-size: 22px; font-weight: 800; color: #0F2F5C; margin: 0; }
        .dept-title { font-size: 10px; font-weight: bold; color: #E07B00; text-transform: uppercase; letter-spacing: 0.5px; }
        .subtitle { font-size: 11px; color: #4B5563; margin-top: 2px; }
        .badge { display: inline-block; padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; color: white; background-color: ${isUrgent ? '#DC2626' : riskLevel === 'Medium' ? '#D97706' : '#15803D'}; }
        .section { margin-bottom: 18px; }
        .section-title { font-size: 12px; font-weight: 800; color: #0F2F5C; border-bottom: 1px solid #D1D5DB; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .field { font-size: 12px; margin-bottom: 4px; }
        .label { font-weight: 700; color: #4B5563; min-width: 120px; display: inline-block; }
        .val { font-weight: 600; color: #111827; }
        .timeline { margin: 15px 0; border: 1px solid #D1D5DB; border-radius: 6px; padding: 12px; background: #F9FAFB; }
        .timeline-step { display: flex; align-items: center; margin-bottom: 8px; font-size: 11px; }
        .timeline-step:last-child { margin-bottom: 0; }
        .timeline-icon { width: 18px; height: 18px; border-radius: 50%; background: #0F2F5C; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; margin-right: 10px; flex-shrink: 0; }
        .timeline-title { font-weight: bold; color: #111827; min-width: 180px; }
        .timeline-time { color: #6B7280; font-size: 10px; }
        .condition-card { background: #F3F4F6; padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #D1D5DB; }
        .condition-name { font-weight: 800; font-size: 14px; color: #111827; }
        .biosecurity-box { border: 1px solid #DC2626; background: #FEF2F2; padding: 10px; border-radius: 6px; margin: 12px 0; font-size: 11px; }
        .footer { font-size: 10px; color: #6B7280; border-top: 1px solid #D1D5DB; padding-top: 10px; margin-top: 25px; text-align: center; }
        .print-btn { background: #0F2F5C; color: white; padding: 8px 16px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 15px; text-align: right;">
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
      </div>

      <div class="header">
        <div>
          <div class="dept-title">Government Veterinary Health Network • PashuSuraksha</div>
          <h1 class="title">Clinical Pre-Triage Assessment Report</h1>
          <div class="subtitle">Reference ID: <strong>${caseId}</strong> • Generated: ${timestamp || new Date().toLocaleString()}</div>
        </div>
        <div style="text-align: right;">
          <span class="badge">RISK LEVEL: ${riskLevel || 'ASSESSED'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">1. Incident Information</div>
        <div class="grid">
          <div>
            <div class="field"><span class="label">Animal Species:</span> <span class="val">${animalId || 'Livestock'}</span></div>
            <div class="field"><span class="label">Sick Animals:</span> <span class="val">${incidentDetails?.sickCount || 1}</span></div>
            <div class="field"><span class="label">Dead Animals:</span> <span class="val">${incidentDetails?.deadCount || 0}</span></div>
          </div>
          <div>
            <div class="field"><span class="label">Onset Duration:</span> <span class="val">${incidentDetails?.durationDays || 1} Days</span></div>
            <div class="field"><span class="label">Location / Taluka:</span> <span class="val">${incidentDetails?.location || 'Baramati, Pune'}</span></div>
            <div class="field"><span class="label">Report Time:</span> <span class="val">${timestamp || new Date().toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">2. Case Status Timeline</div>
        <div class="timeline">
          <div class="timeline-step">
            <span class="timeline-icon">✓</span>
            <span class="timeline-title">1. Incident Submitted:</span>
            <span class="timeline-time">${timestamp || new Date().toLocaleString()} — Logged via PashuSuraksha App</span>
          </div>
          <div class="timeline-step">
            <span class="timeline-icon">✓</span>
            <span class="timeline-title">2. AI Pre-Triage Completed:</span>
            <span class="timeline-time">${riskLevel || 'Standard'} Risk classification verified</span>
          </div>
          <div class="timeline-step">
            <span class="timeline-icon" style="background: ${isUrgent ? '#DC2626' : '#E07B00'};">➜</span>
            <span class="timeline-title">3. Dispatched to Vet Center:</span>
            <span class="timeline-time">Transmitted to ${incidentDetails?.location || 'Local'} Veterinary Dispensary</span>
          </div>
          <div class="timeline-step">
            <span class="timeline-icon" style="background: #9CA3AF;">•</span>
            <span class="timeline-title">4. Prescription / Clinical Care:</span>
            <span class="timeline-time">${isUrgent ? 'URGENT: Emergency visit / Ambulance 1962 alerted' : 'Awaiting physical review & official e-prescription'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">3. Possible Clinical Conditions (${(matchedConditions || []).length})</div>
        ${(matchedConditions || []).map(c => `
          <div class="condition-card">
            <div class="condition-name">${c.nameEn || c.id}</div>
            <div style="font-size: 11px; color: #0F2F5C; font-weight: bold; margin: 3px 0;">Classification: ${c.categoryEn || 'Livestock Health'} • Pattern Match: ${c.confidenceLabel || 'Clinical Match'}</div>
            ${c.preventionEn ? `<div style="font-size: 11px; color: #374151; margin-top: 4px;"><strong>Immediate Biosecurity:</strong> ${c.preventionEn}</div>` : ''}
            ${c.treatmentEn ? `<div style="font-size: 11px; color: #374151; margin-top: 4px;"><strong>Supportive Care:</strong> ${c.treatmentEn}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="biosecurity-box">
        <strong style="color: #DC2626;">⚠️ MANDATORY VETERINARY COMPLIANCE:</strong>
        <p style="margin: 4px 0 0 0;">This pre-triage advice strictly provides containment, biosecurity, and supportive care. Do NOT administer unprescribed antibiotics or scheduled drugs. In case of sudden collapse or bleeding, call <strong>1962 Veterinary Emergency Helpline</strong> immediately.</p>
      </div>

      <div class="footer">
        PashuSuraksha Veterinary AI Pre-Triage Network • Official Animal Husbandry Support System • Toll-Free Emergency: 1962
      </div>
    </body>
    </html>
  `;

  if (download || req.query.download === 'true') {
    res.setHeader('Content-Disposition', `attachment; filename="PashuSuraksha_Report_${caseId}.html"`);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(reportHtml);
});

// Legacy Routes
const { router: diseasesRouter } = require('./routes/diseases');
const triageRouter = require('./routes/triage');
const vetsRouter = require('./routes/vets');
const outbreakRouter = require('./routes/outbreak');

// New Supervised ML & Surveillance Routes
const mlInferenceRouter = require('./routes/ml_inference');
const casesRouter = require('./routes/cases');
const clustersRouter = require('./routes/clusters');
const spreadRouter = require('./routes/spread');

app.use('/api/diseases', diseasesRouter);
app.use('/api/triage', triageRouter);
app.use('/api/vets', vetsRouter);
app.use('/api/outbreak', outbreakRouter);

app.use('/api/ml', mlInferenceRouter);
app.use('/api/cases', casesRouter);
app.use('/api/clusters', clustersRouter);
app.use('/api/spread', spreadRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'PashuSuraksha Backend Engine & Tele-Consultation Hub',
    timestamp: new Date().toISOString()
  });
});

// Real-Time Socket.io WebRTC Signaling & Tele-Consultation Hub
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_consultation', ({ roomId, userType, userName }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = userName || userType;
    console.log(`[Socket.io] ${userName || userType} joined room: ${roomId}`);
    
    socket.to(roomId).emit('user_joined', {
      socketId: socket.id,
      userType,
      userName: socket.userName,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('send_chat_message', (data) => {
    const { roomId, message, sender, timestamp } = data;
    io.in(roomId).emit('receive_chat_message', {
      id: `msg-${Date.now()}`,
      message,
      sender,
      timestamp: timestamp || new Date().toISOString()
    });
  });

  socket.on('webrtc_offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('webrtc_offer', { offer, senderSocketId: socket.id });
  });

  socket.on('webrtc_answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('webrtc_answer', { answer, senderSocketId: socket.id });
  });

  socket.on('webrtc_ice_candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc_ice_candidate', { candidate, senderSocketId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    if (socket.roomId) {
      socket.to(socket.roomId).emit('user_left', { socketId: socket.id, userName: socket.userName });
    }
  });
});

server.listen(PORT, () => {
  console.log(`PashuSuraksha Real Backend REST & WebRTC Server listening on http://localhost:${PORT}`);
});
