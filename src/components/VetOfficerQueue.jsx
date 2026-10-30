import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, Search, Filter, ShieldAlert, ArrowUpRight, Radio, AlertTriangle, 
  CheckCircle, Camera, Video, FileText, Send, X, Building2, MapPin, RefreshCw, 
  User, Phone, Check, ChevronRight, Layers, Bell, Share2, Sparkles, Clock, AlertOctagon
} from 'lucide-react';

export default function VetOfficerQueue({
  doctorQueue = [],
  setDoctorQueue,
  navigateTo,
  setSelectedViewingCase,
  setRxForm,
  setEmergencyContextData,
  setShowEmergencyModal,
  dict = {},
  lang = 'en',
  currentVetUser
}) {
  // Filters State
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PENDING, URGENT, ESCALATED, REVIEWED
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [diseaseFilter, setDiseaseFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Escalation Modal State
  const [escalatingCase, setEscalatingCase] = useState(null);
  const [escalationLevel, setEscalationLevel] = useState('District Disease Investigation Section (DIS)');
  const [escalationReason, setEscalationReason] = useState('Suspected Notifiable Index Outbreak — Ring Quarantine & Verification Required');
  const [sampleTypes, setSampleTypes] = useState(['Epithelial scrapings / vesicular fluid', 'Blood swab']);
  const [officerNotes, setOfficerNotes] = useState('');
  const [escalationSuccessMsg, setEscalationSuccessMsg] = useState('');

  // Advisory Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTargetState, setBroadcastTargetState] = useState('Maharashtra');
  const [broadcastTargetDistrict, setBroadcastTargetDistrict] = useState('Pune');
  const [broadcastTargetTaluka, setBroadcastTargetTaluka] = useState('Haveli');
  const [broadcastCategory, setBroadcastCategory] = useState('FMD_QUARANTINE');
  const [broadcastMsgEn, setBroadcastMsgEn] = useState(
    'URGENT BIOSECURITY ADVISORY: Suspected Foot & Mouth Disease (FMD) index cases identified in Haveli block. Isolate all cloven-hoofed cattle and buffaloes immediately. Halt inter-village cattle grazing and market transport. Apply 4% sodium carbonate wash in animal sheds. Report fresh salivation/lesions to 1962.'
  );
  const [broadcastMsgMr, setBroadcastMsgMr] = useState(
    'तातडीचा जैव-सुरक्षा सल्ला: हवेली तालुक्यात लाळ-खुरकत (FMD) संसर्ग आढळून आला आहे. आजारी जनावरे तात्काळ वेगळी करा. जनावरांचे बाजार आणि सार्वजनिक चराई बंद ठेवा. गोठ्यामध्ये ४% सोडियम कार्बोनेट फवारा. अधिक मदतीसाठी १९६२ वर संपर्क करा.'
  );
  const [broadcastChannels, setBroadcastChannels] = useState(['sms', 'app', 'panchayat']);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState('');

  // Unique lists for filter dropdowns
  const availableDistricts = useMemo(() => {
    const set = new Set();
    doctorQueue.forEach(c => {
      if (c.location) {
        const parts = c.location.split(',').map(s => s.trim());
        if (parts.length >= 2) set.add(parts[1]);
        else if (parts.length >= 1) set.add(parts[0]);
      }
      if (c.district) set.add(c.district);
    });
    return ['ALL', ...Array.from(set)];
  }, [doctorQueue]);

  const availableDiseases = useMemo(() => {
    const set = new Set();
    doctorQueue.forEach(c => {
      if (c.predictedDisease) set.add(c.predictedDisease);
    });
    return ['ALL', ...Array.from(set)];
  }, [doctorQueue]);

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return doctorQueue.filter(item => {
      // 1. Status Filter
      if (statusFilter === 'PENDING' && item.status !== 'PENDING') return false;
      if (statusFilter === 'URGENT' && !item.isUrgent && item.urgency !== 'High' && item.riskLevel !== 'High Risk') return false;
      if (statusFilter === 'ESCALATED' && item.status !== 'ESCALATED') return false;
      if (statusFilter === 'REVIEWED' && item.status !== 'REVIEWED' && item.status !== 'PRESCRIBED') return false;

      // 2. District Filter
      if (districtFilter !== 'ALL') {
        const loc = (item.location || '') + ' ' + (item.district || '');
        if (!loc.toLowerCase().includes(districtFilter.toLowerCase())) return false;
      }

      // 3. Disease Filter
      if (diseaseFilter !== 'ALL') {
        if (item.predictedDisease !== diseaseFilter) return false;
      }

      // 4. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = item.id?.toLowerCase().includes(q);
        const matchName = item.farmerName?.toLowerCase().includes(q);
        const matchMobile = item.farmerMobile?.toLowerCase().includes(q);
        const matchLoc = item.location?.toLowerCase().includes(q);
        const matchDisease = item.predictedDisease?.toLowerCase().includes(q);
        const matchSymptoms = item.symptoms?.some(s => s.toLowerCase().includes(q));
        if (!matchId && !matchName && !matchMobile && !matchLoc && !matchDisease && !matchSymptoms) {
          return false;
        }
      }

      return true;
    });
  }, [doctorQueue, statusFilter, districtFilter, diseaseFilter, searchQuery]);

  // Statistics
  const totalCount = doctorQueue.length;
  const pendingCount = doctorQueue.filter(c => c.status === 'PENDING').length;
  const urgentCount = doctorQueue.filter(c => c.isUrgent || c.urgency === 'High' || c.riskLevel === 'High Risk').length;
  const escalatedCount = doctorQueue.filter(c => c.status === 'ESCALATED').length;

  // Handle Case Escalation Submission
  const handleConfirmEscalation = (e) => {
    e.preventDefault();
    if (!escalatingCase) return;

    const escalatedCaseId = escalatingCase.id;
    const nowStr = new Date().toLocaleString();

    setDoctorQueue(prev => prev.map(c => {
      if (c.id === escalatedCaseId) {
        const prevTimeline = c.statusTimeline || [];
        return {
          ...c,
          status: 'ESCALATED',
          escalatedTo: escalationLevel,
          escalationReason,
          sampleTypes,
          officerNotes,
          escalatedBy: currentVetUser?.name || 'Dr. S. K. Kulkarni (Taluka Vet Officer)',
          escalatedAt: nowStr,
          statusTimeline: [
            ...prevTimeline,
            {
              step: prevTimeline.length + 1,
              title: `Escalated to ${escalationLevel}`,
              desc: `Reason: ${escalationReason}. Recommended samples: ${sampleTypes.join(', ')}. Officer notes: ${officerNotes || 'Immediate field specimen verification dispatched.'}`,
              time: nowStr,
              status: 'active'
            }
          ]
        };
      }
      return c;
    }));

    setEscalationSuccessMsg(`Case ${escalatedCaseId} successfully escalated to ${escalationLevel}. Rapid Response Team dispatched.`);
    setTimeout(() => {
      setEscalatingCase(null);
      setEscalationSuccessMsg('');
    }, 2500);
  };

  // Handle Advisory Broadcast Dispatch
  const handleDispatchBroadcast = (e) => {
    e.preventDefault();
    const newAdvisory = {
      id: `ADV-${Date.now()}`,
      category: broadcastCategory,
      state: broadcastTargetState,
      district: broadcastTargetDistrict,
      taluka: broadcastTargetTaluka,
      messageEn: broadcastMsgEn,
      messageMr: broadcastMsgMr,
      channels: broadcastChannels,
      dispatchedBy: currentVetUser?.name || 'Dr. S. K. Kulkarni',
      timestamp: new Date().toLocaleString()
    };

    // Store in localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('pashu_regional_advisories') || '[]');
      localStorage.setItem('pashu_regional_advisories', JSON.stringify([newAdvisory, ...existing]));
      window.dispatchEvent(new CustomEvent('pashu-regional-advisory', { detail: newAdvisory }));
    } catch (err) {
      console.warn('Failed to store advisory:', err);
    }

    setBroadcastSuccessNotice(
      `Biosecurity Advisory dispatched to all registered farmers in ${broadcastTargetTaluka} Taluka (${broadcastTargetDistrict} District) via ${broadcastChannels.join(', ').toUpperCase()}!`
    );

    setTimeout(() => {
      setShowBroadcastModal(false);
      setBroadcastSuccessNotice('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Officer Header & Control Strip */}
      <div className="bg-white rounded-xl border border-[#D1D5DB] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#0F2F5C] text-white flex items-center justify-center font-bold">
                <ClipboardList className="w-5 h-5 text-[#E07B00]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#111827] flex items-center space-x-2">
                  <span>{dict.patientQueueTitle || 'Veterinary Officer Patient & Triage Queue'}</span>
                </h2>
                <p className="text-xs text-[#4B5563]">
                  Duty Officer: <strong className="text-[#0F2F5C]">{currentVetUser?.name || 'Dr. S. K. Kulkarni (VCI-MH-2021-0842)'}</strong> &bull; {currentVetUser?.district || 'Pune'} District Polyclinic
                </p>
              </div>
            </div>
          </div>

          {/* Broadcast & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="bg-[#E07B00] hover:bg-[#c96e00] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-2 shadow-sm transition"
              title="Broadcast regional biosecurity advisory to registered farmers in taluka"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Area Advisory Broadcast</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setDistrictFilter('ALL');
                setDiseaseFilter('ALL');
                setSearchQuery('');
              }}
              className="bg-white hover:bg-gray-50 text-[#4B5563] border border-[#D1D5DB] px-3 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 transition"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E5E7EB]">
          <div 
            onClick={() => setStatusFilter('ALL')}
            className={`p-3 rounded-lg border cursor-pointer transition ${
              statusFilter === 'ALL' ? 'bg-[#0F2F5C]/10 border-[#0F2F5C]' : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-gray-100'
            }`}
          >
            <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block">Total Inflow</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-[#111827]">{totalCount}</span>
              <Layers className="w-4 h-4 text-[#0F2F5C]" />
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('PENDING')}
            className={`p-3 rounded-lg border cursor-pointer transition ${
              statusFilter === 'PENDING' ? 'bg-amber-50 border-[#E07B00]' : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-gray-100'
            }`}
          >
            <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block">Pending Review</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-[#B45309]">{pendingCount}</span>
              <Clock className="w-4 h-4 text-[#E07B00]" />
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('URGENT')}
            className={`p-3 rounded-lg border cursor-pointer transition ${
              statusFilter === 'URGENT' ? 'bg-red-50 border-[#DC2626]' : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-gray-100'
            }`}
          >
            <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider block">Urgent 1962 Cases</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-[#DC2626]">{urgentCount}</span>
              <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('ESCALATED')}
            className={`p-3 rounded-lg border cursor-pointer transition ${
              statusFilter === 'ESCALATED' ? 'bg-purple-50 border-purple-600' : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-gray-100'
            }`}
          >
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Escalated to DIS</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-black text-purple-700">{escalatedCount}</span>
              <ArrowUpRight className="w-4 h-4 text-purple-700" />
            </div>
          </div>
        </div>

        {/* Multi-Filter Bar (Section 4.F) */}
        <div className="bg-[#F3F4F6] p-4 rounded-xl border border-[#D1D5DB] space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Case ID, Farmer Name, Mobile, Village, or Symptoms..."
                className="w-full bg-white border border-[#D1D5DB] rounded-lg pl-9 pr-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[#9CA3AF] hover:text-[#111827]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* District Filter Dropdown */}
            <div className="w-full sm:w-48">
              <select
                value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C] cursor-pointer"
              >
                <option value="ALL">All Districts</option>
                {availableDistricts.filter(d => d !== 'ALL').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Disease Filter Dropdown */}
            <div className="w-full sm:w-60">
              <select
                value={diseaseFilter}
                onChange={e => setDiseaseFilter(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C] cursor-pointer"
              >
                <option value="ALL">All Pathologies / Diseases</option>
                {availableDiseases.filter(d => d !== 'ALL').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-[#4B5563] flex items-center space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>
            {[
              { id: 'ALL', label: 'All Cases' },
              { id: 'PENDING', label: '⏳ Pending Review' },
              { id: 'URGENT', label: '🚨 Urgent 1962' },
              { id: 'ESCALATED', label: '⚡ Escalated to DIS' },
              { id: 'REVIEWED', label: '✅ Reviewed / Prescribed' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setStatusFilter(p.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  statusFilter === p.id
                    ? 'bg-[#0F2F5C] text-white shadow-xs'
                    : 'bg-white text-[#4B5563] border border-[#D1D5DB] hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case List Display */}
      <div className="space-y-4">
        {filteredQueue.length === 0 ? (
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-12 text-center space-y-3">
            <ClipboardList className="w-12 h-12 text-[#9CA3AF] mx-auto" />
            <h4 className="text-base font-bold text-[#111827]">No Cases Found Matching Your Filters</h4>
            <p className="text-xs text-[#4B5563] max-w-sm mx-auto">
              Try resetting your district, status, or search keywords to view incoming farmer triage reports.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setDistrictFilter('ALL');
                setDiseaseFilter('ALL');
                setSearchQuery('');
              }}
              className="bg-[#0F2F5C] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
            >
              Show All Cases
            </button>
          </div>
        ) : (
          filteredQueue.map(c => {
            const isEscalated = c.status === 'ESCALATED';
            const isPrescribed = c.status === 'PRESCRIBED' || c.status === 'REVIEWED';
            const isHighRisk = c.isUrgent || c.urgency === 'High' || c.riskLevel === 'High Risk';

            return (
              <div 
                key={c.id} 
                className={`bg-white border rounded-xl p-5 space-y-4 shadow-xs transition hover:shadow-md ${
                  isHighRisk 
                    ? 'border-l-4 border-l-[#DC2626] border-[#D1D5DB]' 
                    : isEscalated
                    ? 'border-l-4 border-l-purple-600 border-[#D1D5DB]'
                    : 'border-[#D1D5DB]'
                }`}
              >
                {/* Top Row: Case Header, Species, & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F3F4F6]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#0F2F5C] bg-[#0F2F5C]/10 px-2.5 py-0.5 rounded border border-[#0F2F5C]/30">
                      {c.id}
                    </span>
                    <span className="text-xs font-bold text-[#111827] bg-[#F3F4F6] px-2.5 py-0.5 rounded">
                      🐾 {c.species || 'Cattle (Cow)'}
                    </span>
                    <span className="text-[11px] text-[#4B5563] flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>{c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM'}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isEscalated && (
                      <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Escalated to DIS</span>
                      </span>
                    )}
                    {isPrescribed && (
                      <span className="bg-green-100 text-green-800 border border-green-300 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Prescribed</span>
                      </span>
                    )}
                    {isHighRisk && (
                      <span className="bg-[#DC2626] text-white text-xs font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>{c.riskLevel || 'High Risk'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Farmer Details & Suspected Disease */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Farmer Contact</span>
                    <h4 className="font-bold text-sm text-[#111827] mt-0.5">{c.farmerName}</h4>
                    <p className="text-xs text-[#0F2F5C] font-semibold flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{c.farmerMobile}</span>
                    </p>
                    <p className="text-xs text-[#4B5563] flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#E07B00]" />
                      <span>{c.location || 'Haveli, Pune'}</span>
                    </p>
                  </div>

                  <div className="md:col-span-2 bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                        AI Pre-Triage Assessment (ICAR Align)
                      </span>
                      <span className="text-[10px] bg-amber-100 text-[#B45309] font-bold px-1.5 py-0.2 rounded">
                        AI suggestion — a vet will confirm
                      </span>
                    </div>
                    <p className="text-xs text-[#111827]">
                      Suspected Pathology: <strong className="text-[#DC2626] text-sm">{c.predictedDisease}</strong>
                    </p>
                    <p className="text-xs text-[#4B5563]">
                      Reported Symptoms: <span className="font-semibold text-[#111827]">{c.symptoms ? c.symptoms.join(', ') : 'High Fever, Oral Ulcers, Salivation'}</span>
                    </p>
                  </div>
                </div>

                {/* Escalation Context Banner (if already escalated) */}
                {isEscalated && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-1 text-xs">
                    <div className="flex items-center space-x-1.5 text-purple-900 font-bold">
                      <Building2 className="w-4 h-4 text-purple-700" />
                      <span>Escalated to: {c.escalatedTo}</span>
                    </div>
                    <p className="text-purple-800 text-[11px]">
                      <strong>Reason:</strong> {c.escalationReason}
                    </p>
                    {c.sampleTypes && (
                      <p className="text-purple-800 text-[11px]">
                        <strong>Specimen Protocol:</strong> {c.sampleTypes.join(', ')}
                      </p>
                    )}
                    {c.officerNotes && (
                      <p className="text-purple-700 text-[11px] italic">
                        &quot;{c.officerNotes}&quot; — {c.escalatedBy}
                      </p>
                    )}
                  </div>
                )}

                {/* Attached Clinical Photo / 2G-3G Compression Payload (Section 6) */}
                {(c.photoUrl || c.attachedMedia) && (
                  <div className="bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        onClick={() => setSelectedViewingCase && setSelectedViewingCase(c)}
                        className="w-16 h-16 bg-black rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-[#0F2F5C]/40 cursor-pointer hover:border-[#0F2F5C] transition group relative"
                        title="Click to inspect lesion photo at 100% zoom"
                      >
                        {c.videoUrl || c.attachedMedia?.type === 'video' ? (
                          <video src={c.videoUrl || c.attachedMedia?.videoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img 
                            src={c.photoUrl || c.attachedMedia?.dataUrl} 
                            alt="Clinical Lesion" 
                            className="w-full h-full object-cover group-hover:scale-105 transition" 
                          />
                        )}
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">
                          Zoom
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center space-x-1.5 font-bold text-[#111827]">
                          <Camera className="w-3.5 h-3.5 text-[#0F2F5C]" />
                          <span>Farmer Lesion Photo Attached</span>
                          <span className="bg-green-100 text-[#15803D] text-[10px] px-1.5 py-0.2 rounded font-bold">2G/3G Ready</span>
                        </div>
                        <p className="text-[11px] text-[#4B5563]">
                          Payload: <strong className="text-[#0F2F5C]">{c.attachedMedia?.compressedSize || c.photoMeta?.compressedSize || '158 KB'}</strong> (Original: {c.attachedMedia?.originalSize || c.photoMeta?.originalSize || '3.1 MB'})
                        </p>
                        <p className="text-[10px] text-[#6B7280]">Inspected under client-side canvas compression safeguard</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedViewingCase && setSelectedViewingCase(c)}
                      className="bg-white hover:bg-gray-50 text-[#0F2F5C] border border-[#D1D5DB] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Inspect Photo</span>
                    </button>
                  </div>
                )}

                {/* Duty Action Button Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F3F4F6]">
                  {/* Video Call */}
                  <button 
                    type="button"
                    onClick={() => navigateTo('/vet/consultations')} 
                    className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Start Video Call</span>
                  </button>

                  {/* Write Prescription */}
                  <button 
                    type="button"
                    onClick={() => {
                      if (setRxForm) {
                        setRxForm({
                          caseId: c.id,
                          farmerName: c.farmerName,
                          farmerMobile: c.farmerMobile,
                          diagnosis: c.predictedDisease,
                          medicinesText: '1. Potassium Permanganate (1:1000) oral wash\n2. Meloxicam Oral Suspension 0.5 mg/kg\n3. Supportive multivitamins (Vit A, D3, E)',
                          advice: 'Isolate animal immediately. Provide soft green fodder and lukewarm water. Clean stall with 4% sodium carbonate wash.'
                        });
                      }
                      navigateTo('/vet/prescriptions');
                    }} 
                    className="bg-white hover:bg-gray-50 text-[#0F2F5C] border border-[#D1D5DB] px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Write Prescription</span>
                  </button>

                  {/* 1962 Emergency Ambulance Dispatch */}
                  {isHighRisk && (
                    <button
                      type="button"
                      onClick={() => {
                        if (setEmergencyContextData && setShowEmergencyModal) {
                          setEmergencyContextData({
                            isUrgent: true,
                            riskLevel: 'URGENT',
                            diseaseName: c.predictedDisease,
                            species: c.species || 'Cow',
                            symptoms: [c.predictedDisease + ' severe acute danger signs'],
                            matchedSymptoms: ['severe_distress'],
                            message: `Urgent duty officer escalation for case ${c.id}: ${c.farmerName} (${c.farmerMobile}), Location: ${c.location}.`
                          });
                          setShowEmergencyModal(true);
                        }
                      }}
                      className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-xs transition"
                      title="Dispatch 1962 Mobile Veterinary Unit Ambulance"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                      <span>🚨 1962 MVU Dispatch</span>
                    </button>
                  )}

                  {/* Case Escalation Button (Village -> Taluka -> District DIS) */}
                  <button
                    type="button"
                    onClick={() => {
                      setEscalatingCase(c);
                      setOfficerNotes(`Priority investigation for ${c.farmerName} (${c.location}). Contagious signs observed.`);
                    }}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-xs transition ml-auto"
                    title="Escalate case to District Disease Investigation Section (DIS)"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>⚡ Escalate to DIS</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. CASE ESCALATION MODAL (Village -> Taluka -> District DIS -> State CADRAD) */}
      {/* ========================================================================= */}
      {escalatingCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-purple-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#111827]">Escalate Case to Disease Investigation Section</h3>
                  <p className="text-xs text-[#6B7280]">Official hierarchy routing & laboratory sample dispatch</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEscalatingCase(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {escalationSuccessMsg ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-[#15803D] mx-auto" />
                <h4 className="font-bold text-sm">{escalationSuccessMsg}</h4>
                <p className="text-xs text-green-700">Notification transmitted to District Animal Husbandry Officer.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmEscalation} className="space-y-4">
                {/* Case Reference Details */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 text-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-[#0F2F5C]">
                    <span>Case: {escalatingCase.id}</span>
                    <span className="text-[#DC2626]">{escalatingCase.predictedDisease}</span>
                  </div>
                  <p className="text-[#4B5563]">
                    <strong>Farmer:</strong> {escalatingCase.farmerName} ({escalatingCase.farmerMobile})
                  </p>
                  <p className="text-[#4B5563]">
                    <strong>Location:</strong> {escalatingCase.location || 'Haveli, Pune'} &bull; <strong>Species:</strong> {escalatingCase.species || 'Cattle'}
                  </p>
                </div>

                {/* Target Hierarchy Level */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111827] block">
                    Escalation Target Tier:
                  </label>
                  <select
                    value={escalationLevel}
                    onChange={e => setEscalationLevel(e.target.value)}
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs font-bold text-[#111827] focus:outline-none focus:border-purple-600 cursor-pointer"
                  >
                    <option value="Block / Taluka Veterinary Polyclinic">Tier 1: Block / Taluka Veterinary Polyclinic</option>
                    <option value="District Disease Investigation Section (DIS)">Tier 2: District Disease Investigation Section (DIS)</option>
                    <option value="State Central Disease Investigation Laboratory (CADRAD / Pune)">Tier 3: State Central Disease Investigation Laboratory (CADRAD / Pune)</option>
                    <option value="ICAR - National Institute of Veterinary Epidemiology (NIVEDI)">Tier 4: National Surveillance (ICAR - NIVEDI Bengaluru)</option>
                  </select>
                </div>

                {/* Reason for Escalation */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111827] block">
                    Official Escalation Reason:
                  </label>
                  <select
                    value={escalationReason}
                    onChange={e => setEscalationReason(e.target.value)}
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs font-bold text-[#111827] focus:outline-none focus:border-purple-600 cursor-pointer"
                  >
                    <option value="Suspected Notifiable Index Outbreak — Ring Quarantine & Verification Required">
                      Suspected Notifiable Index Outbreak — Ring Quarantine & Verification
                    </option>
                    <option value="Acute Cluster Mortality (>20% herd affected within 48 hours)">
                      Acute Cluster Mortality (&gt;20% herd affected within 48 hours)
                    </option>
                    <option value="Confirmatory RT-PCR / Serology Specimen Collection">
                      Confirmatory RT-PCR / Serology Specimen Collection
                    </option>
                    <option value="Atypical Clinical Manifestation / Diagnostic Discordance">
                      Atypical Clinical Manifestation / Diagnostic Discordance
                    </option>
                    <option value="Zoonotic Hazard Precaution (Anthrax / Brucellosis / Rabies)">
                      Zoonotic Hazard Precaution (Anthrax / Brucellosis / Rabies)
                    </option>
                  </select>
                </div>

                {/* Laboratory Specimen Checklist */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111827] block">
                    Diagnostic Specimens to be Sampled & Cold-Chained:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'Epithelial scrapings / vesicular fluid',
                      'Blood swab in sterile vacutainer',
                      'Serum for paired antibody titer',
                      'Nasal / deep pharyngeal swab'
                    ].map(st => {
                      const isChecked = sampleTypes.includes(st);
                      return (
                        <label 
                          key={st} 
                          className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition ${
                            isChecked ? 'bg-purple-50 border-purple-400 font-bold text-purple-900' : 'bg-white border-[#E5E7EB] text-[#4B5563]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSampleTypes(prev => 
                                isChecked ? prev.filter(x => x !== st) : [...prev, st]
                              );
                            }}
                            className="rounded text-purple-600 focus:ring-0"
                          />
                          <span className="text-[11px]">{st}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Officer Directives & Dispatch Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111827] block">
                    Duty Officer Directives & Field Instructions:
                  </label>
                  <textarea
                    rows={2}
                    value={officerNotes}
                    onChange={e => setOfficerNotes(e.target.value)}
                    placeholder="Enter instructions for Mobile Investigation Officer..."
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-purple-600"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setEscalatingCase(null)}
                    className="px-4 py-2 border border-[#D1D5DB] rounded-lg text-xs font-bold text-[#4B5563] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-sm"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Confirm Escalation & Transmit</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AREA ADVISORY BROADCAST MODAL (Taluka / Mandal / District Level)      */}
      {/* ========================================================================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-amber-300 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#E07B00] flex items-center justify-center">
                  <Radio className="w-5 h-5 font-bold animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#111827]">Area Biosecurity Advisory Broadcast</h3>
                  <p className="text-xs text-[#6B7280]">Dispatch instant containment alerts to registered farmers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {broadcastSuccessNotice ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-[#15803D] mx-auto" />
                <h4 className="font-bold text-sm">{broadcastSuccessNotice}</h4>
                <p className="text-xs text-green-700">Broadcasting network triggered. In-app banner updated.</p>
              </div>
            ) : (
              <form onSubmit={handleDispatchBroadcast} className="space-y-4">
                {/* Target Jurisdiction */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">State:</label>
                    <select
                      value={broadcastTargetState}
                      onChange={e => {
                        setBroadcastTargetState(e.target.value);
                        if (e.target.value === 'Andhra Pradesh') {
                          setBroadcastTargetDistrict('Krishna');
                          setBroadcastTargetTaluka('Tenali');
                        } else {
                          setBroadcastTargetDistrict('Pune');
                          setBroadcastTargetTaluka('Haveli');
                        }
                      }}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2 text-xs font-bold text-[#111827]"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">District:</label>
                    <input
                      type="text"
                      value={broadcastTargetDistrict}
                      onChange={e => setBroadcastTargetDistrict(e.target.value)}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2 text-xs font-bold text-[#111827]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      {broadcastTargetState === 'Andhra Pradesh' || broadcastTargetState === 'Telangana' ? 'Mandal:' : 'Taluka:'}
                    </label>
                    <input
                      type="text"
                      value={broadcastTargetTaluka}
                      onChange={e => setBroadcastTargetTaluka(e.target.value)}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2 text-xs font-bold text-[#111827]"
                    />
                  </div>
                </div>

                {/* Advisory Template Preset */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111827] block">
                    Disease Containment Preset:
                  </label>
                  <select
                    value={broadcastCategory}
                    onChange={e => {
                      const cat = e.target.value;
                      setBroadcastCategory(cat);
                      if (cat === 'FMD_QUARANTINE') {
                        setBroadcastMsgEn('URGENT BIOSECURITY ADVISORY: Suspected Foot & Mouth Disease (FMD) index cases identified in Haveli block. Isolate all cloven-hoofed cattle and buffaloes immediately. Halt inter-village cattle grazing and market transport. Apply 4% sodium carbonate wash in animal sheds. Report fresh salivation/lesions to 1962.');
                        setBroadcastMsgMr('तातडीचा जैव-सुरक्षा सल्ला: हवेली तालुक्यात लाळ-खुरकत (FMD) संसर्ग आढळून आला आहे. आजारी जनावरे तात्काळ वेगळी करा. जनावरांचे बाजार आणि सार्वजनिक चराई बंद ठेवा. गोठ्यामध्ये ४% सोडियम कार्बोनेट फवारा. अधिक मदतीसाठी १९६२ वर संपर्क करा.');
                      } else if (cat === 'LSD_VECTOR') {
                        setBroadcastMsgEn('LUMPY SKIN DISEASE (LSD) VECTOR ALERT: Elevated humidity causing surge in biting flies (Culicoides). Spray sheds with permitted ectoparasiticide (Deltamethrin). Inspect cattle skin for nodular lumps daily. Vaccinate healthy herd with Goat Pox Vaccine.');
                        setBroadcastMsgMr('लम्पी त्वचा रोग (LSD) कीटक इशारा: गोठ्यामध्ये गोचीड व माशांचा प्रादुर्भाव रोखण्यासाठी औषध फवारा. जनावरांच्या अंगावर गाठी आल्यास त्वरित वेगळे करा. निरोगी जनावरांचे गोटपॉक्स लसीकरण करून घ्या.');
                      } else if (cat === 'ANTHRAX_ALERT') {
                        setBroadcastMsgEn('CRITICAL ANTHRAX EMERGENCY: Sudden livestock death reported with un-clotted blood from orifices. DO NOT open carcass. Strict 6-feet deep lime burial mandatory. Notify DIS rapid team immediately.');
                        setBroadcastMsgMr('अँथ्रॅक्स (काळपुळी) अति-दक्षता इशारा: जनावराचा अचानक मृत्यू झाल्यास शवविच्छेदन करू नका. ६ फूट खोल खड्ड्यात चुना टाकून पुरणे बंधनकारक आहे. तातडीने १९६२ वर कळवा.');
                      }
                    }}
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs font-bold text-[#111827] cursor-pointer"
                  >
                    <option value="FMD_QUARANTINE">Foot & Mouth Disease (FMD) — 5km Ring Quarantine Notice</option>
                    <option value="LSD_VECTOR">Lumpy Skin Disease (LSD) — Monsoon Vector & Ectoparasite Alert</option>
                    <option value="ANTHRAX_ALERT">Anthrax Hazard Precaution — Strict Carcass Burial Protocol</option>
                  </select>
                </div>

                {/* Multi-Lingual Message Editor */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#4B5563] block">English Message Text:</label>
                    <textarea
                      rows={2}
                      value={broadcastMsgEn}
                      onChange={e => setBroadcastMsgEn(e.target.value)}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2 text-xs text-[#111827] focus:outline-none focus:border-[#E07B00]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#4B5563] block">मराठी / प्रादेशिक संदेश (Marathi / Regional):</label>
                    <textarea
                      rows={2}
                      value={broadcastMsgMr}
                      onChange={e => setBroadcastMsgMr(e.target.value)}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2 text-xs text-[#111827] focus:outline-none focus:border-[#E07B00]"
                    />
                  </div>
                </div>

                {/* Dispatch Channels */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111827] block">Dispatch Delivery Channels:</label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      { id: 'sms', label: '📱 SMS & WhatsApp Blast' },
                      { id: 'app', label: '🔔 In-App Emergency Banner' },
                      { id: 'panchayat', label: '📢 Gram Panchayat Notice' }
                    ].map(ch => {
                      const isChecked = broadcastChannels.includes(ch.id);
                      return (
                        <label 
                          key={ch.id} 
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                            isChecked ? 'bg-amber-50 border-[#E07B00] font-bold text-[#E07B00]' : 'bg-white border-[#E5E7EB] text-[#4B5563]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setBroadcastChannels(prev => 
                                isChecked ? prev.filter(x => x !== ch.id) : [...prev, ch.id]
                              );
                            }}
                            className="rounded text-[#E07B00] focus:ring-0"
                          />
                          <span>{ch.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2 border border-[#D1D5DB] rounded-lg text-xs font-bold text-[#4B5563] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#E07B00] hover:bg-[#c96e00] text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Area Broadcast</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
