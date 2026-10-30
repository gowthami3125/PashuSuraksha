const express = require('express');
const router = express.Router();
const { diseasesDB } = require('./diseases');

router.post('/analyze', (req, res) => {
  const { symptoms, species } = req.body;
  const validSyms = (symptoms && symptoms.length > 0) ? symptoms : ['fever', 'salivation', 'blisters', 'lameness'];

  let matches = diseasesDB.map(d => {
    let common = d.matchSymptoms.filter(s => validSyms.includes(s));
    let score = common.length / d.matchSymptoms.length;
    return { ...d, score, commonCount: common.length };
  });

  matches.sort((a, b) => b.score - a.score || b.commonCount - a.commonCount);
  const topResults = matches.slice(0, 2);

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    species: species || 'cow',
    symptomsAnalyzed: validSyms,
    results: topResults
  });
});

module.exports = router;
