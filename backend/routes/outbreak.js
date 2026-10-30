const express = require('express');
const router = express.Router();

const outbreaks = [
  { id: 101, state: 'Maharashtra', district: 'Pune', taluka: 'Haveli Taluka Cluster', disease: 'Foot and Mouth Disease (FMD)', cases: 14, status: 'High Risk', is_simulated: true },
  { id: 102, state: 'Maharashtra', district: 'Kolhapur', taluka: 'Karveer Taluka Zone', disease: 'Lumpy Skin Disease (LSD)', cases: 8, status: 'Medium Risk', is_simulated: true },
  { id: 103, state: 'Andhra Pradesh', district: 'Guntur', mandal: 'Tenali Mandal Cluster', disease: 'Foot and Mouth Disease (FMD)', cases: 12, status: 'High Risk', is_simulated: true }
];

router.get('/', (req, res) => {
  res.json({ success: true, count: outbreaks.length, data: outbreaks });
});

router.post('/report', (req, res) => {
  const { state, disease, taluka, mandal } = req.body;
  const newReport = {
    id: Date.now(),
    state: state || 'Maharashtra',
    taluka: taluka || mandal || 'Farmer Reported Area',
    disease: disease || 'Suspected Outbreak',
    cases: 1,
    status: 'Reported',
    is_simulated: true
  };
  outbreaks.unshift(newReport);
  res.json({ success: true, message: 'Case reported successfully', report: newReport });
});

module.exports = router;
