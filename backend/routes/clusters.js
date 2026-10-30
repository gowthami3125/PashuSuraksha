const express = require('express');
const router = express.Router();

let alertsStore = [
  {
    id: "ALT-2026-801",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    disease: "Foot and Mouth Disease (FMD)",
    location: "Haveli Taluka, Pune District, Maharashtra",
    caseCount: 14,
    triggerReason: "Multiple FMD reports within 5km radius",
    riskLevel: "High Risk",
    status: "NEW",
    is_simulated: true,
    actionPlan: "1. Quarantine affected herds.\n2. Keep shed clean.\n3. Restrict livestock movement."
  },
  {
    id: "ALT-2026-802",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    disease: "Lumpy Skin Disease (LSD)",
    location: "Karveer Taluka, Kolhapur District, Maharashtra",
    caseCount: 8,
    triggerReason: "Increasing LSD skin nodule reports in cattle",
    riskLevel: "Medium Risk",
    status: "ACKNOWLEDGED",
    is_simulated: true,
    actionPlan: "1. Control fly and mosquito breeding.\n2. Apply neem and turmeric paste over unbroken lumps."
  }
];

let clustersStore = [
  {
    clusterId: "CLUST-MH-FMD-01",
    location: "Haveli Taluka Cluster (Pune District)",
    disease: "Foot and Mouth Disease (FMD)",
    species: "Cattle / Buffalo",
    caseCount: 14,
    timeWindow: "Last 48 Hours",
    riskLevel: "High Risk",
    affectedRadiusKm: 5.0,
    estimatedExposedLivestock: 450,
    containmentUrgency: "ISOLATION & HYGIENE ADVISED",
    detectionReason: "Multiple FMD reports detected within 5km radius.",
    is_simulated: true
  },
  {
    clusterId: "CLUST-MH-LSD-01",
    location: "Karveer Taluka Zone (Kolhapur District)",
    disease: "Lumpy Skin Disease (LSD)",
    species: "Dairy Cows",
    caseCount: 8,
    timeWindow: "Last 72 Hours",
    riskLevel: "Medium Risk",
    affectedRadiusKm: 3.5,
    estimatedExposedLivestock: 320,
    containmentUrgency: "VECTOR CONTROL ADVISED",
    detectionReason: "Skin nodules reported in local herds.",
    is_simulated: true
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, count: clustersStore.length, clusters: clustersStore });
});

router.get('/alerts', (req, res) => {
  res.json({ success: true, count: alertsStore.length, alerts: alertsStore });
});

router.patch('/alerts/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const alertItem = alertsStore.find(a => a.id === id);
  if (!alertItem) {
    return res.status(404).json({ success: false, error: "Alert ID not found" });
  }

  alertItem.status = status;
  res.json({ success: true, message: "Alert status updated", alert: alertItem });
});

module.exports = router;
