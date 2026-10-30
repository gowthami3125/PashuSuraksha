const express = require('express');
const router = express.Router();

const vetDirectory = {
  'Maharashtra': [
    { id: 1, nameEn: 'District Veterinary Polyclinic - Pune', phone: '020-25880486', district: 'Pune', is_verified: true, is_simulated: false },
    { id: 2, nameEn: 'Government Veterinary Hospital - Kolhapur', phone: '0231-2651234', district: 'Kolhapur', is_verified: true, is_simulated: false }
  ],
  'Andhra Pradesh': [
    { id: 3, nameEn: 'Super Specialty Veterinary Hospital - Guntur', phone: '0863-2234567', district: 'Guntur', is_verified: true, is_simulated: false }
  ]
};

router.get('/', (req, res) => {
  const state = req.query.state || 'Maharashtra';
  res.json({ success: true, state, hospitals: vetDirectory[state] || [] });
});

module.exports = router;
