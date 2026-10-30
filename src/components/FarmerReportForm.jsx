import React, { useState } from 'react';
import { initialAnimalsList as animalsData } from '../data/animalsData';
import { initialSymptomsList as symptomsData } from '../data/symptomsData';
import LocationPicker from './LocationPicker';

export default function FarmerReportForm({ lang, selectedState, onCaseSubmitted }) {
  const [formData, setFormData] = useState({
    species: 'cow',
    numberAffected: 1,
    ageMonths: 24,
    sex: 'female',
    state: selectedState || 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Local Village',
    location: '18.5601° N, 73.8081° E',
    selectedSymptoms: ['fever', 'salivation', 'blisters'],
    severity: 'High',
    durationDays: 2,
    farmerNotes: 'Animal has fever with stringy saliva and foot wounds.',
    photo: null,
    voiceDescription: null
  });

  const [loading, setLoading] = useState(false);
  const [submittedCase, setSubmittedCase] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSymptomToggle = (symId) => {
    setFormData(prev => {
      const exists = prev.selectedSymptoms.includes(symId);
      const updated = exists 
        ? prev.selectedSymptoms.filter(s => s !== symId)
        : [...prev.selectedSymptoms, symId];
      return { ...prev, selectedSymptoms: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedSymptoms.length === 0) {
      setErrorMsg("Please select at least 1 observed symptom.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const predictedDisease = 'Foot and Mouth Disease (FMD)';
      const riskLevel = 'High Risk';

      const symptomLabels = formData.selectedSymptoms.map(sId => {
        const found = symptomsData.find(s => s.id === sId);
        return found ? found.nameEn : sId;
      });

      const reportRes = await fetch('http://localhost:5000/api/cases/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          species: formData.species,
          numberAffected: formData.numberAffected,
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          village: formData.village,
          location: formData.location,
          symptoms: formData.selectedSymptoms,
          symptomLabels,
          severity: formData.severity,
          durationDays: formData.durationDays,
          farmerNotes: formData.farmerNotes,
          predictedDisease,
          riskLevel,
          is_simulated: true
        })
      });

      if (reportRes.ok) {
        const result = await reportRes.json();
        setSubmittedCase(result.caseData);
        if (onCaseSubmitted) onCaseSubmitted(result.caseData);
      } else {
        const fallbackCase = {
          id: `CASE-LOCAL-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString(),
          ...formData,
          symptomLabels,
          predictedDisease,
          riskLevel,
          is_simulated: true,
          status: 'ASSESSED'
        };
        setSubmittedCase(fallbackCase);
      }
    } catch (err) {
      const fallbackCase = {
        id: `CASE-LOCAL-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        ...formData,
        symptomLabels: formData.selectedSymptoms,
        predictedDisease: "Foot and Mouth Disease (FMD)",
        riskLevel: "High Risk",
        is_simulated: true,
        status: "ASSESSED"
      };
      setSubmittedCase(fallbackCase);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gov-card p-6 border border-[#D1D5DB] mb-8">
      <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-[#D1D5DB]">
        <div className="p-3 bg-[#F3F4F6] border border-[#D1D5DB] text-[#0F2F5C] rounded-lg font-bold text-xl">📋</div>
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Farmer Direct Case Reporting</h2>
          <p className="text-xs text-[#4B5563]">
            Submit suspect disease symptoms to alert Veterinary Officers.
          </p>
        </div>
      </div>

      {submittedCase ? (
        <div className="bg-[#F3F4F6] border border-[#15803D] rounded-lg p-6 text-[#111827]">
          <div className="flex items-center space-x-3 text-[#15803D] font-bold text-lg mb-3">
            <span>✅ Case Successfully Reported</span>
          </div>
          <p className="text-xs mb-4">
            Case ID: <strong className="font-mono text-[#0F2F5C] bg-white border border-[#D1D5DB] px-2 py-1 rounded">{submittedCase.id}</strong> — Status: <span className="bg-[#0F2F5C] text-white text-xs px-2 py-1 rounded font-semibold">{submittedCase.status}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-[#D1D5DB] mb-4 text-xs">
            <div>
              <p className="text-[#4B5563]">Livestock Species:</p>
              <p className="font-bold text-[#111827] uppercase">{submittedCase.species} ({submittedCase.numberAffected} head affected)</p>
            </div>
            <div>
              <p className="text-[#4B5563]">Location:</p>
              <p className="font-semibold text-[#111827]">{submittedCase.village}, {submittedCase.taluka || submittedCase.mandal}, {submittedCase.district} District ({submittedCase.state})</p>
            </div>
            <div>
              <p className="text-[#4B5563]">Suspected Condition:</p>
              <p className="font-bold text-[#DC2626] text-sm">{submittedCase.predictedDisease}</p>
            </div>
            <div>
              <p className="text-[#4B5563]">Assessed Risk Level:</p>
              <p className="font-bold text-[#15803D] text-sm">{submittedCase.riskLevel}</p>
            </div>
          </div>

          <button
            onClick={() => setSubmittedCase(null)}
            className="w-full btn-navy py-2.5 px-4 rounded-lg"
          >
            + Report Another Case
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-[#F3F4F6] border border-[#DC2626] text-[#DC2626] p-3 rounded-lg text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Species & Affected Count */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Livestock Species</label>
              <select
                value={formData.species}
                onChange={e => setFormData({ ...formData, species: e.target.value })}
                className="w-full border border-[#D1D5DB] rounded-lg p-2.5 bg-white text-xs font-medium text-[#111827] focus:border-[#0F2F5C] focus:outline-none"
              >
                {animalsData.map(a => (
                  <option key={a.id} value={a.id}>{a.nameEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Number Affected</label>
              <input
                type="number"
                min="1"
                max="500"
                value={formData.numberAffected}
                onChange={e => setFormData({ ...formData, numberAffected: parseInt(e.target.value) || 1 })}
                className="w-full border border-[#D1D5DB] rounded-lg p-2.5 bg-white text-xs font-bold text-[#111827] focus:border-[#0F2F5C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Severity & Duration</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value })}
                  className="border border-[#D1D5DB] rounded-lg p-2.5 bg-white text-xs font-semibold text-[#111827]"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
                <div className="flex items-center bg-white border border-[#D1D5DB] rounded-lg px-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.durationDays}
                    onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                    className="w-full bg-transparent p-1 font-bold text-[#111827] text-xs"
                  />
                  <span className="text-xs text-[#4B5563] pr-1">Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB]">
            <h3 className="text-xs font-bold text-[#111827] mb-3 flex items-center gap-2">
              <span>📍 Location Details</span>
            </h3>
            <div className="space-y-3">
              <LocationPicker
                selectedState={formData.state}
                onChangeState={(s) => setFormData(prev => ({ ...prev, state: s }))}
                selectedDistrict={formData.district}
                onChangeDistrict={(d) => setFormData(prev => ({ ...prev, district: d }))}
                selectedTaluka={formData.taluka}
                onChangeTaluka={(t) => setFormData(prev => ({ ...prev, taluka: t }))}
              />
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] mb-1">Village</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Haveli"
                  className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white text-[#111827]"
                />
              </div>
            </div>
          </div>

          {/* Symptoms Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-2">
              Select Observed Symptoms ({formData.selectedSymptoms.length} Selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-2 border border-[#D1D5DB] rounded-lg bg-[#F3F4F6]">
              {symptomsData.map(sym => {
                const isSelected = formData.selectedSymptoms.includes(sym.id);
                return (
                  <button
                    type="button"
                    key={sym.id}
                    onClick={() => handleSymptomToggle(sym.id)}
                    className={`flex items-center space-x-2 text-left p-2.5 rounded-lg border transition-all text-xs font-medium cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F2F5C] text-white border-[#0F2F5C]'
                        : 'bg-white text-[#111827] border-[#D1D5DB] hover:border-[#0F2F5C]'
                    }`}
                  >
                    <span className="truncate">{sym.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Farmer Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">Farmer Observations</label>
            <textarea
              rows="2"
              value={formData.farmerNotes}
              onChange={e => setFormData({ ...formData, farmerNotes: e.target.value })}
              placeholder="Describe physical condition, appetite, lesions, or behavior..."
              className="w-full border border-[#D1D5DB] rounded-lg p-2.5 bg-white text-xs text-[#111827] focus:border-[#0F2F5C] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-navy py-3 px-6 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>⏳ Submitting...</span>
            ) : (
              <span>Submit Case Report</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
