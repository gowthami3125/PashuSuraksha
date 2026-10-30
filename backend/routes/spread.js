const express = require('express');
const router = express.Router();

router.post('/calculate', (req, res) => {
  const { disease, location, caseCount, species } = req.body;
  
  const affectedCount = parseInt(caseCount || 5);
  const primaryExposed = affectedCount * 4;
  const secondaryExposed = affectedCount * 12;
  const riskRadiusKm = disease && disease.includes('FMD') ? 12.5 : disease && disease.includes('LSD') ? 10.0 : 8.0;

  const nodes = [
    { id: 'n1', label: 'Index Affected Animal(s)', type: 'Animal', risk: 'HIGH', count: affectedCount, desc: 'Primary symptomatic livestock' },
    { id: 'n2', label: 'Primary Farm Herd', type: 'Herd', risk: 'HIGH', count: primaryExposed, desc: 'Direct co-located animals in shed' },
    { id: 'n3', label: 'Index Farm Location', type: 'Farm', risk: 'HIGH', count: 1, desc: location || 'Primary Farm Shed' },
    { id: 'n4', label: 'Adjacent Farms (500m)', type: 'Nearby Farms', risk: 'HIGH', count: 6, desc: 'Neighboring cattle holdings' },
    { id: 'n5', label: 'Mandal Village Cluster', type: 'Villages', risk: 'MEDIUM', count: 14, desc: 'Shared mandal boundaries' },
    { id: 'n6', label: 'Communal Water Tank / Grazing', type: 'Shared Water/Feed', risk: 'MEDIUM', count: secondaryExposed, desc: 'Shared water trough & pasture' },
    { id: 'n7', label: 'Weekly Mandal Animal Haat', type: 'Markets/Haats', risk: 'HIGH', count: 450, desc: 'Livestock trading hub' },
    { id: 'n8', label: 'Inter-district Transport Route', type: 'Transport Routes', risk: 'MEDIUM', count: 1200, desc: 'State Highway transport corridor' }
  ];

  const connections = [
    { from: 'n1', to: 'n2', route: 'Inhalation / Direct Contact' },
    { from: 'n2', to: 'n3', route: 'Shed Bedding & Milking Equipment' },
    { from: 'n3', to: 'n4', route: 'Airborne Aerosol / Vector Dispersion' },
    { from: 'n4', to: 'n5', route: 'Farmer Movement & Fodder Transport' },
    { from: 'n3', to: 'n6', route: 'Communal Grazing Discharge' },
    { from: 'n5', to: 'n7', route: 'Animal Transport to Weekly Market' },
    { from: 'n7', to: 'n8', route: 'Inter-State Cattle Trucks' }
  ];

  const containmentChecklist = [
    { task: "Strict Quarantine of Index Herd", category: "Isolation", status: "PENDING" },
    { task: "Ban Movement to Weekly Livestock Haats", category: "Movement Control", status: "RECOMMENDED" },
    { task: "Disinfect Shed Floor with 1% KMnO4 / 2% NaOH", category: "Disinfection", status: "PENDING" },
    { task: "Daily Thermometer & Salivation Monitoring", category: "Monitoring", status: "IN_PROGRESS" },
    { task: "1962 Veterinary Ring-Vaccination Dispatch", category: "Veterinary Action", status: "REQUESTED" }
  ];

  res.json({
    success: true,
    disease: disease || 'Foot and Mouth Disease (FMD)',
    species: species || 'cow',
    location: location || 'Guntur Mandal',
    metrics: {
      primaryExposedAnimals: primaryExposed,
      secondaryExposedAnimals: secondaryExposed,
      geographicRiskRadiusKm: riskRadiusKm,
      riskLevel: "CRITICAL HIGH CONTAINMENT REQUIRED"
    },
    nodes,
    connections,
    containmentChecklist
  });
});

module.exports = router;
