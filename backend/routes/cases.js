const express = require('express');
const router = express.Router();

let casesStore = [
  {
    id: "CASE-2026-1001",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    species: "cow",
    numberAffected: 3,
    state: "Maharashtra",
    district: "Pune",
    taluka: "Haveli",
    village: "Local Village",
    location: "Pune District Center",
    symptoms: ["fever", "salivation", "blisters", "lameness"],
    symptomLabels: ["High Fever", "Excessive Salivation", "Mouth/Hoof Blisters", "Lameness"],
    severity: "High",
    durationDays: 2,
    farmerNotes: "Cow has fever and drooling.",
    predictedDisease: "Foot and Mouth Disease (FMD)",
    riskLevel: "High Risk",
    is_simulated: true,
    status: "OFFICER_ALERTED",
    statusHistory: [
      { status: "SUSPECTED", timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), officer: "Farmer Self-Report", notes: "Case submitted by farmer" },
      { status: "ASSESSED", timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString(), officer: "System Rule Assessment", notes: "Rule evaluated FMD High Risk" },
      { status: "OFFICER_ALERTED", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), officer: "District Vet Officer Pune", notes: "Officer notified" }
    ],
    verifiedDiagnosis: null,
    labResult: null
  },
  {
    id: "CASE-2026-1002",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    species: "cow",
    numberAffected: 5,
    state: "Andhra Pradesh",
    district: "Guntur",
    mandal: "Tenali",
    village: "Local Village",
    location: "Guntur District Center",
    symptoms: ["skin_lesions", "fever", "milk_drop"],
    symptomLabels: ["Nodular Skin Lumps", "High Fever", "Milk Drop"],
    severity: "High",
    durationDays: 4,
    farmerNotes: "Hard skin bumps appearing across body.",
    predictedDisease: "Lumpy Skin Disease (LSD)",
    riskLevel: "High Risk",
    is_simulated: true,
    status: "FIELD_INSPECTION",
    statusHistory: [
      { status: "SUSPECTED", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), officer: "Farmer Report", notes: "Case reported" },
      { status: "FIELD_INSPECTION", timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), officer: "Veterinary Officer", notes: "Inspected cattle, skin lumps observed" }
    ],
    verifiedDiagnosis: "Lumpy Skin Disease (LSD)",
    labResult: "POSITIVE"
  }
];

// GET case list with filtering
router.get('/', (req, res) => {
  const { state, district, taluka, mandal, disease, species, risk, status } = req.query;
  let filtered = [...casesStore];

  if (state && state !== 'All') filtered = filtered.filter(c => c.state === state);
  if (district && district !== 'All') filtered = filtered.filter(c => c.district === district);
  if (disease && disease !== 'All') filtered = filtered.filter(c => c.predictedDisease === disease);
  if (species && species !== 'All') filtered = filtered.filter(c => c.species === species);
  if (risk && risk !== 'All') filtered = filtered.filter(c => c.riskLevel === risk);
  if (status && status !== 'All') filtered = filtered.filter(c => c.status === status);

  res.json({ success: true, count: filtered.length, data: filtered });
});

// POST new farmer case report
router.post('/report', (req, res) => {
  const data = req.body;
  const newId = `CASE-2026-${1000 + casesStore.length + 1}`;
  
  const newCase = {
    id: newId,
    timestamp: new Date().toISOString(),
    species: data.species || 'cow',
    numberAffected: parseInt(data.numberAffected || 1),
    state: data.state || 'Maharashtra',
    district: data.district || 'Pune',
    taluka: data.taluka || data.mandal || 'Haveli',
    village: data.village || 'Local Village',
    location: data.location || 'Location',
    symptoms: data.symptoms || ['fever', 'salivation'],
    symptomLabels: data.symptomLabels || ['High Fever', 'Salivation'],
    severity: data.severity || 'Moderate',
    durationDays: parseInt(data.durationDays || 1),
    farmerNotes: data.farmerNotes || '',
    predictedDisease: data.predictedDisease || 'Foot and Mouth Disease (FMD)',
    riskLevel: data.riskLevel || 'High Risk',
    is_simulated: true,
    status: 'ASSESSED',
    statusHistory: [
      { status: 'SUSPECTED', timestamp: new Date().toISOString(), officer: 'Farmer Report', notes: 'Case logged via Farmer Portal' }
    ],
    verifiedDiagnosis: null,
    labResult: null
  };

  casesStore.unshift(newCase);
  res.json({ success: true, message: "Farmer Case Reported Successfully", caseData: newCase });
});

// PATCH update case status lifecycle
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, officer, notes } = req.body;
  
  const targetCase = casesStore.find(c => c.id === id);
  if (!targetCase) {
    return res.status(404).json({ success: false, error: "Case ID not found" });
  }

  targetCase.status = status;
  targetCase.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    officer: officer || 'Veterinary Officer',
    notes: notes || 'Status updated'
  });

  res.json({ success: true, message: "Case lifecycle updated", caseData: targetCase });
});

module.exports = router;
