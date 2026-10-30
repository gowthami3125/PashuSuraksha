const express = require('express');
const router = express.Router();

const diseasesDB = [
  {
    id: 'fmd',
    nameEn: 'Foot and Mouth Disease (FMD)',
    nameHi: 'खुरपका-मुंहपका रोग (FMD)',
    nameTe: 'గాలికుంటు వ్యాధి (FMD)',
    categoryEn: 'Contagious Viral Epidemic (Picornaviridae)',
    riskEn: 'CRITICAL HIGH EPIDEMIC',
    riskColor: 'bg-red-600 border-red-700 text-white',
    confidence: '96% Epidemiological Match',
    matchSymptoms: ['fever', 'salivation', 'blisters', 'lameness', 'milk_drop'],
    preventionEn: '1. Strict quarantine of infected herd.\n2. Wash oral & hoof lesions with 1% Potassium Permanganate solution.\n3. Administer biannual FMD vaccination.',
    treatmentEn: 'Broad-spectrum antibiotics + Analgesics (Meloxicam) + Soft green fodder feed.'
  },
  {
    id: 'lsd',
    nameEn: 'Lumpy Skin Disease (LSD)',
    nameHi: 'लम्पी त्वचा रोग (LSD)',
    nameTe: 'లంపీ స్కిన్ వ్యాధి / చర్మ గడ్డల వ్యాధి (LSD)',
    categoryEn: 'Poxviridae Vector-Borne Threat',
    riskEn: 'HIGH BIO-SECURITY ALERT',
    riskColor: 'bg-red-600 border-red-700 text-white',
    confidence: '94% Match',
    matchSymptoms: ['skin_lesions', 'fever', 'milk_drop', 'weakness', 'eye_discharge'],
    preventionEn: '1. Isolate infected cattle immediately.\n2. Spray fly/mosquito repellents.\n3. Goat Pox Vaccine ring-vaccination.',
    treatmentEn: 'Antihistaminics + Anti-inflammatory + Topical Antiseptic Spray.'
  },
  {
    id: 'mastitis',
    nameEn: 'Bovine Mastitis (Udder Inflammation)',
    nameHi: 'थनेला रोग (मास्टाइटिस)',
    nameTe: 'మస్టిటిస్ / పొదుగు వాపు వ్యాధి',
    categoryEn: 'Bacterial Production Loss Disease',
    riskEn: 'MODERATE PRODUCTION LOSS RISK',
    riskColor: 'bg-amber-600 border-amber-700 text-white',
    confidence: '91% Match',
    matchSymptoms: ['udder_swelling', 'milk_drop', 'fever', 'weakness'],
    preventionEn: '1. Teat dipping in 0.5% Iodine solution.\n2. Maintain clean bedding.',
    treatmentEn: 'Intramammary Antibiotics + Trisodium Citrate oral mix.'
  },
  {
    id: 'ppr',
    nameEn: 'Peste des Petits Ruminants (PPR / Goat Plague)',
    nameHi: 'पीपीआर रोग (बकरी प्लेग)',
    nameTe: 'పి.పి.ఆర్ వ్యాధి (మేకలు & గొర్రెల ప్లేగు వ్యాధి)',
    categoryEn: 'Small Ruminant Morbillivirus Epidemic',
    riskEn: 'CRITICAL HIGH MORTALITY RISK',
    riskColor: 'bg-red-600 border-red-700 text-white',
    confidence: '95% Match',
    matchSymptoms: ['fever', 'diarrhea', 'respiratory', 'eye_discharge', 'weakness'],
    preventionEn: '1. PPR Vaccine once in a lifetime for goats above 3 months.',
    treatmentEn: 'ORSL Rehydration Electrolytes + Antidiarrheal + Mucosal Ointments.'
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, count: diseasesDB.length, data: diseasesDB });
});

module.exports = { router, diseasesDB };
