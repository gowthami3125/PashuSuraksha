import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, FlaskConical, AlertTriangle, Send, CheckCircle, Clock, MapPin, Activity, X } from 'lucide-react';

export default function GovSurveillanceDashboard({ lang, selectedState, currentVetUser }) {
  const [cases, setCases] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterState, setFilterState] = useState(selectedState || 'All');
  const [filterDisease, setFilterDisease] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals state
  const [feedbackModalCase, setFeedbackModalCase] = useState(null);
  const [prescriptionModalCase, setPrescriptionModalCase] = useState(null);
  const [labReferralModalCase, setLabReferralModalCase] = useState(null);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

  // Retrain feedback state
  const [verifiedDiagnosis, setVerifiedDiagnosis] = useState('');
  const [labResult, setLabResult] = useState('POSITIVE (RT-PCR / ELISA Confirmed)');
  const [feedbackNotes, setFeedbackNotes] = useState('');

  // Prescription Form state
  const [rxForm, setRxForm] = useState({
    diagnosis: 'Foot and Mouth Disease (FMD)',
    medicineName: '',
    dosage: '',
    frequency: 'Once Daily',
    advice: 'Isolate affected cow in dry shed. Provide soft green fodder and clean drinking water.',
    withdrawalPeriodDays: '7',
    followUpDate: '2026-09-27'
  });
  const [rxSuccessMsg, setRxSuccessMsg] = useState(false);

  // Lab Referral state
  const [labForm, setLabForm] = useState({
    sampleType: 'Mouth Blister Epithelium Swab',
    targetLab: 'District Disease Investigation Section (DIS) - Pune',
    notes: 'Urgent PCR test for FMD serotype identification.'
  });
  const [labSuccessMsg, setLabSuccessMsg] = useState(false);

  // Advisory broadcast state
  const [broadcastLang, setBroadcastLang] = useState('mr');
  const [broadcastMsg, setBroadcastMsg] = useState('सावधान: हवेली तालुक्यात लाळ्या खुरकूत प्रादुर्भाव. जनावरांचे विलगीकरण करा.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [casesRes, clustersRes] = await Promise.all([
        fetch('http://localhost:5000/api/cases'),
        fetch('http://localhost:5000/api/clusters')
      ]);

      if (casesRes.ok) {
        const d = await casesRes.json();
        setCases(d.data || []);
      }
      if (clustersRes.ok) {
        const c = await clustersRes.json();
        setClusters(c.clusters || []);
      }
    } catch (err) {
      console.warn("Backend fetch fallback:", err);
      // Fallback initial dataset
      setCases([
        {
          id: "CASE-2026-901",
          timestamp: new Date().toISOString(),
          farmerName: "Anandrao Patil",
          species: "Cattle (Crossbred Cow)",
          numberAffected: 3,
          state: "Maharashtra",
          district: "Pune",
          mandal: "Haveli",
          village: "Bakori",
          predictedDisease: "Foot and Mouth Disease (FMD)",
          riskLevel: "High Risk",
          status: "OFFICER_ALERTED",
          symptoms: ["High Fever", "Salivation", "Mouth Blisters"],
          is_simulated: true
        },
        {
          id: "CASE-2026-902",
          timestamp: new Date().toISOString(),
          farmerName: "Babanrao Shinde",
          species: "Cattle (Gir Cow)",
          numberAffected: 5,
          state: "Maharashtra",
          district: "Kolhapur",
          mandal: "Karveer",
          village: "Shiroli",
          predictedDisease: "Lumpy Skin Disease (LSD)",
          riskLevel: "High Risk",
          status: "FIELD_INSPECTION",
          symptoms: ["Skin Nodules", "Fever", "Udder Swelling"],
          is_simulated: true
        },
        {
          id: "CASE-2026-903",
          timestamp: new Date().toISOString(),
          farmerName: "Subba Rao",
          species: "Goat (Osmanabadi)",
          numberAffected: 8,
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Tenali",
          village: "Nagarampalem",
          predictedDisease: "Peste des Petits Ruminants (PPR)",
          riskLevel: "High Risk",
          status: "SAMPLE_COLLECTED",
          symptoms: ["Diarrhea", "Nasal Discharge", "High Fever"],
          is_simulated: true
        }
      ]);

      setClusters([
        {
          clusterId: "CLUSTER-MH-01",
          disease: "Foot and Mouth Disease (FMD)",
          location: "Haveli Mandal, Pune District",
          riskLevel: "High Risk Zone",
          caseCount: 14,
          affectedRadiusKm: 5.0,
          containmentUrgency: "Ring Vaccination Active",
          is_simulated: true
        },
        {
          clusterId: "CLUSTER-MH-02",
          disease: "Lumpy Skin Disease (LSD)",
          location: "Karveer Mandal, Kolhapur District",
          riskLevel: "Medium Risk Zone",
          caseCount: 8,
          affectedRadiusKm: 3.5,
          containmentUrgency: "Vector Fogging Active",
          is_simulated: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cases/${caseId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          officer: currentVetUser ? currentVetUser.name : "Govt Veterinary Officer",
          notes: `Status updated to ${newStatus}`
        })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackModalCase) return;

    setCases(prev => prev.map(c => c.id === feedbackModalCase.id ? { ...c, verifiedDiagnosis, labResult, status: 'RESOLVED' } : c));
    setFeedbackModalCase(null);
    setVerifiedDiagnosis('');
  };

  const handleCreatePrescription = (e) => {
    e.preventDefault();
    setRxSuccessMsg(true);
    setTimeout(() => {
      setRxSuccessMsg(false);
      setPrescriptionModalCase(null);
    }, 1500);
  };

  const handleCreateLabReferral = (e) => {
    e.preventDefault();
    setLabSuccessMsg(true);
    setTimeout(() => {
      setLabSuccessMsg(false);
      setLabReferralModalCase(null);
    }, 1500);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastModalOpen(false);
    }, 1500);
  };

  const filteredCases = cases.filter(c => {
    if (filterState !== 'All' && c.state !== filterState) return false;
    if (filterDisease !== 'All' && c.predictedDisease !== filterDisease) return false;
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8 mb-8">
      {/* Header Banner */}
      <div className="bg-[#0F2F5C] text-white rounded-lg p-6 border border-[#0F2F5C]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#0B2447] text-slate-200 font-mono text-xs px-3 py-1 rounded-md border border-[#D1D5DB]/30 uppercase tracking-widest font-bold">
                Statewide Surveillance Feed
              </span>
              <span className="bg-white text-[#4B5563] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D1D5DB]">
                Sample data
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-2 tracking-tight">
              Veterinary Officer Surveillance & Response Dashboard
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm mt-1">
              Officer: <strong>{currentVetUser ? currentVetUser.name : "Dr. S. K. Kulkarni (B.V.Sc)"}</strong> • Reg No: <strong>{currentVetUser ? currentVetUser.licenseNumber : "VCI-MH-2021-0842"}</strong>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBroadcastModalOpen(true)}
              className="bg-[#E07B00] hover:bg-[#D97706] text-white font-bold py-2.5 px-4 rounded-lg transition text-xs flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Advisory</span>
            </button>
            <button
              onClick={fetchDashboardData}
              className="bg-white text-[#0F2F5C] hover:bg-slate-100 font-bold py-2.5 px-4 rounded-lg transition text-xs flex items-center justify-center space-x-1 border border-[#D1D5DB]"
            >
              <span>🔄 Refresh Feed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cluster & Containment Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {clusters.map((cl, i) => (
          <div key={i} className="gov-card p-5 border-l-4 border-l-[#DC2626] space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${cl.riskLevel.includes('High') ? 'bg-[#DC2626] text-white' : 'bg-[#D97706] text-[#111827]'}`}>
                {cl.riskLevel}
              </span>
              <span className="text-xs text-[#4B5563] font-mono font-bold">{cl.clusterId}</span>
            </div>
            <h3 className="font-bold text-[#111827] text-base">{cl.disease}</h3>
            <p className="text-xs text-[#4B5563] font-medium">📍 {cl.location}</p>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB]">
              <div>
                <span className="text-[#4B5563] block">Case Count:</span>
                <strong className="text-[#DC2626] text-sm font-bold">{cl.caseCount} Cases</strong>
              </div>
              <div>
                <span className="text-[#4B5563] block">Containment Radius:</span>
                <strong className="text-[#111827] font-bold">{cl.affectedRadiusKm} km</strong>
              </div>
            </div>

            <div className="text-xs text-[#111827] bg-[#F3F4F6] p-2.5 rounded-lg border border-[#D1D5DB] font-semibold flex items-center justify-between">
              <span>⚡ <strong>Containment Action:</strong> {cl.containmentUrgency}</span>
              <span className="bg-white text-[#4B5563] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#D1D5DB]">Sample data</span>
            </div>
          </div>
        ))}
      </div>

      {/* Case Management & Workflow Registry */}
      <div className="gov-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D1D5DB]">
          <div>
            <h2 className="text-base font-bold text-[#111827]">National Case Registry & Urgent Case Queue</h2>
            <p className="text-xs text-[#4B5563]">Urgent-first queue filtered by State, Disease, and Case Lifecycle Status.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
              className="border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white font-bold text-[#111827]"
            >
              <option value="All">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
            </select>

            <select
              value={filterDisease}
              onChange={e => setFilterDisease(e.target.value)}
              className="border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white font-bold text-[#111827]"
            >
              <option value="All">All Diseases</option>
              <option value="Foot and Mouth Disease (FMD)">Foot and Mouth Disease (FMD)</option>
              <option value="Lumpy Skin Disease (LSD)">Lumpy Skin Disease (LSD)</option>
              <option value="Peste des Petits Ruminants (PPR)">PPR (Goat Plague)</option>
              <option value="Bovine Mastitis">Bovine Mastitis</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white font-bold text-[#111827]"
            >
              <option value="All">All Statuses</option>
              <option value="OFFICER_ALERTED">OFFICER_ALERTED</option>
              <option value="FIELD_INSPECTION">FIELD_INSPECTION</option>
              <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        {/* Case Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B2447] text-white uppercase text-[11px] tracking-wider font-bold">
                <th className="p-3.5 rounded-tl-lg">Case ID</th>
                <th className="p-3.5">Farmer & Species</th>
                <th className="p-3.5">Location (Taluka / District)</th>
                <th className="p-3.5">Suspected Disease</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-tr-lg">Vet Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1D5DB]">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-[#4B5563] font-medium">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => (
                  <tr key={c.id} className="hover:bg-[#F3F4F6] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#111827]">{c.id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#111827]">{c.farmerName || 'Local Farmer'}</div>
                      <div className="text-[11px] text-[#4B5563]">{c.species} ({c.numberAffected || 1} Head)</div>
                    </td>
                    <td className="p-3.5 text-[#111827] font-medium">{c.mandal || c.village}, {c.district}, {c.state}</td>
                    <td className="p-3.5 font-bold text-[#DC2626]">{c.predictedDisease}</td>
                    <td className="p-3.5">
                      <span className="bg-[#DC2626] text-white font-bold px-2.5 py-0.5 rounded text-[10px]">
                        {c.riskLevel || 'High Risk'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded font-bold text-[10px] ${
                        c.status === 'RESOLVED' ? 'bg-[#15803D] text-white' :
                        c.status === 'OFFICER_ALERTED' ? 'bg-[#D97706] text-[#111827]' :
                        c.status === 'FIELD_INSPECTION' ? 'bg-[#0F2F5C] text-white' :
                        'bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB]'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <select
                          value={c.status}
                          onChange={e => handleStatusUpdate(c.id, e.target.value)}
                          className="border border-[#D1D5DB] rounded p-1 text-[11px] bg-white font-bold cursor-pointer"
                        >
                          <option value="OFFICER_ALERTED">OFFICER_ALERTED</option>
                          <option value="FIELD_INSPECTION">FIELD_INSPECTION</option>
                          <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>

                        <button
                          onClick={() => setPrescriptionModalCase(c)}
                          className="btn-navy px-2 py-1 text-[11px] cursor-pointer"
                        >
                          📋 Write Rx
                        </button>

                        <button
                          onClick={() => setLabReferralModalCase(c)}
                          className="bg-[#0B2447] hover:bg-[#0B2447]/90 text-white font-bold px-2 py-1 rounded text-[11px] transition cursor-pointer"
                        >
                          🧪 Lab Referral
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: PRESCRIPTION CREATOR (VET ONLY) */}
      {prescriptionModalCase && (
        <div className="fixed inset-0 bg-[#0B2447]/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-[#D1D5DB] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1D5DB]">
              <h3 className="font-bold text-[#111827] text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#0F2F5C]" />
                <span>Issue Veterinary Prescription Record</span>
              </h3>
              <button onClick={() => setPrescriptionModalCase(null)} className="text-[#4B5563] hover:text-[#111827] font-bold p-1">✕</button>
            </div>

            {rxSuccessMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-[#15803D] mx-auto animate-bounce" />
                <h4 className="font-bold text-[#111827] text-sm">Prescription Issued Successfully!</h4>
                <p className="text-xs text-[#4B5563]">Record updated in Farmer's treatment history and printable PDF generated.</p>
              </div>
            ) : (
              <form onSubmit={handleCreatePrescription} className="space-y-3 text-xs">
                <div className="bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB] space-y-1 text-[#111827]">
                  <p>Farmer: <strong>{prescriptionModalCase.farmerName || 'Anandrao Patil'}</strong></p>
                  <p>Species: <strong>{prescriptionModalCase.species}</strong> | Case: <strong>{prescriptionModalCase.id}</strong></p>
                  <p>Officer: <strong>{currentVetUser ? currentVetUser.name : 'Dr. S. K. Kulkarni'}</strong> (Reg: {currentVetUser ? currentVetUser.licenseNumber : 'VCI-MH-2021-0842'})</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Confirmed Clinical Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={rxForm.diagnosis}
                    onChange={e => setRxForm({...rxForm, diagnosis: e.target.value})}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 font-semibold bg-white text-[#111827]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Prescribed Veterinary Medicine (Name & Formulation)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boric Acid Wash / Potassium Permanganate Mouth Rinse"
                    value={rxForm.medicineName}
                    onChange={e => setRxForm({...rxForm, medicineName: e.target.value})}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 font-semibold bg-white text-[#111827]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#111827]">Administration Frequency</label>
                    <select
                      value={rxForm.frequency}
                      onChange={e => setRxForm({...rxForm, frequency: e.target.value})}
                      className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs font-semibold bg-white text-[#111827]"
                    >
                      <option value="Twice Daily">Twice Daily (Morning & Evening)</option>
                      <option value="Once Daily">Once Daily</option>
                      <option value="Topical Application">Topical Application As Needed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#111827]">Withdrawal Period (Days)</label>
                    <input
                      type="number"
                      required
                      value={rxForm.withdrawalPeriodDays}
                      onChange={e => setRxForm({...rxForm, withdrawalPeriodDays: e.target.value})}
                      className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs font-semibold bg-white text-[#111827]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Biosecurity & Herd Management Advice</label>
                  <textarea
                    rows="2"
                    required
                    value={rxForm.advice}
                    onChange={e => setRxForm({...rxForm, advice: e.target.value})}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs font-semibold bg-white text-[#111827]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-navy py-3 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Save Prescription & Generate PDF Record
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: LAB REFERRAL CREATOR */}
      {labReferralModalCase && (
        <div className="fixed inset-0 bg-[#0B2447]/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-[#D1D5DB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1D5DB]">
              <h3 className="font-bold text-[#111827] text-base flex items-center space-x-2">
                <FlaskConical className="w-5 h-5 text-[#0F2F5C]" />
                <span>Issue Diagnostic Laboratory Referral</span>
              </h3>
              <button onClick={() => setLabReferralModalCase(null)} className="text-[#4B5563] hover:text-[#111827] font-bold p-1">✕</button>
            </div>

            {labSuccessMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-[#15803D] mx-auto animate-bounce" />
                <h4 className="font-bold text-[#111827] text-sm">Lab Referral Created!</h4>
                <p className="text-xs text-[#4B5563]">Sample tracking ID generated. Status set to: Sample Collected → Sent to Lab.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateLabReferral} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Biological Sample Type Collected</label>
                  <select
                    value={labForm.sampleType}
                    onChange={e => setLabForm({...labForm, sampleType: e.target.value})}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs font-semibold bg-white text-[#111827]"
                  >
                    <option value="Mouth Blister Epithelium Swab">Mouth Blister Epithelium Swab</option>
                    <option value="Whole Blood in EDTA">Whole Blood in EDTA</option>
                    <option value="Milk Sample (Stripped)">Milk Sample (Stripped)</option>
                    <option value="Nasal Discharge Swab">Nasal Discharge Swab</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Target Diagnostic Laboratory</label>
                  <input
                    type="text"
                    required
                    value={labForm.targetLab}
                    onChange={e => setLabForm({...labForm, targetLab: e.target.value})}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 font-semibold bg-white text-[#111827]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Laboratory Instructions & Clinical Notes</label>
                  <textarea
                    rows="2"
                    value={labForm.notes}
                    onChange={e => setLabForm({...labForm, notes: e.target.value})}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2 font-semibold bg-white text-[#111827]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-navy py-3 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Create Referral & Dispatch Sample
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: MULTILINGUAL BROADCAST ADVISORY */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 bg-[#0B2447]/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-[#D1D5DB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1D5DB]">
              <h3 className="font-bold text-[#111827] text-base flex items-center space-x-2">
                <Send className="w-5 h-5 text-[#E07B00]" />
                <span>Broadcast Regional Advisory Warning</span>
              </h3>
              <button onClick={() => setBroadcastModalOpen(false)} className="text-[#4B5563] hover:text-[#111827] font-bold p-1">✕</button>
            </div>

            {broadcastSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-[#15803D] mx-auto animate-bounce" />
                <h4 className="font-bold text-[#111827] text-sm">Regional Advisory Broadcast Sent!</h4>
                <p className="text-xs text-[#4B5563]">In-app banner notifications dispatched to registered farmers in Haveli Taluka.</p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Target Advisory Language</label>
                  <select
                    value={broadcastLang}
                    onChange={e => {
                      setBroadcastLang(e.target.value);
                      if (e.target.value === 'mr') setBroadcastMsg('सावधान: हवेली तालुक्यात लाळ्या खुरकूत प्रादुर्भाव. जनावरांचे विलगीकरण करा.');
                      else if (e.target.value === 'hi') setBroadcastMsg('सावधान: हवेली तालुका में खुरपका रोग प्रकोप। पशुओं को अलग रखें।');
                      else if (e.target.value === 'te') setBroadcastMsg('హెచ్చరిక: హవేలీ మండలంలో గాలికుంటు వ్యాధి ప్ర వ్యాప్తి. పశువులను వేరుగా ఉంచండి.');
                      else setBroadcastMsg('Advisory: FMD active alert in Haveli Taluka. Isolate affected animals immediately.');
                    }}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2 font-semibold bg-white text-[#111827]"
                  >
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111827]">Advisory Message Content</label>
                  <textarea
                    rows="3"
                    required
                    value={broadcastMsg}
                    onChange={e => setBroadcastMsg(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 font-semibold bg-white text-[#111827]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E07B00] hover:bg-[#D97706] text-white font-bold py-3 rounded-lg text-xs cursor-pointer transition"
                >
                  Send Outbreak Warning Broadcast
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
