import React, { useState } from 'react';
import { 
  Syringe, Plus, Calendar, AlertTriangle, CheckCircle2, 
  Clock, ShieldAlert, FileText, FlaskConical, Search, 
  Trash2, Edit3, ArrowRight, UserCheck, Check, Info, X
} from 'lucide-react';

export default function HerdAndVaccination({
  herd = [],
  setHerd,
  prescriptions = [],
  labReferrals = [],
  setLabReferrals,
  vaccinationSchedule = [],
  onNavigate,
  lang = 'en',
  dict = {}
}) {
  const [activeTab, setActiveTab] = useState('herd'); // 'herd', 'vaccination', 'treatments', 'labs'
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('ALL');

  // Add Animal Modal State
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    species: 'Cow',
    tagId: '',
    breed: 'Gir',
    count: 1,
    ageMonths: 24,
    healthStatus: 'Healthy',
    lastVaccine: 'FMD Vaccine',
    lastVaccineDate: '2026-03-10'
  });

  // Record Vaccination Modal State
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [vaccineForm, setVaccineForm] = useState({
    animalId: '',
    vaccineName: 'Foot & Mouth Disease (FMD)',
    administeredDate: new Date().toISOString().split('T')[0],
    nextDueDate: '2026-09-15',
    batchNo: 'NADCP-FMD-2026-B8',
    doctorOrParavet: 'Dr. S. K. Kulkarni (Vet Officer)'
  });

  // Handle Add Animal
  const handleAddAnimal = (e) => {
    e.preventDefault();
    const tag = newAnimal.tagId.trim() || `TAG-MH-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = {
      id: tag,
      name: newAnimal.name.trim() || `${newAnimal.species} (${tag})`,
      species: newAnimal.species,
      breed: newAnimal.breed,
      count: parseInt(newAnimal.count) || 1,
      ageMonths: parseInt(newAnimal.ageMonths) || 12,
      status: newAnimal.healthStatus,
      lastVaccine: newAnimal.lastVaccine,
      lastVaccineDate: newAnimal.lastVaccineDate,
      nextVaccineDue: '2026-09-10'
    };

    const updated = [created, ...herd];
    if (setHerd) {
      setHerd(updated);
    }
    try {
      localStorage.setItem('pashu_farmer_herd', JSON.stringify(updated));
    } catch (err) {}

    setShowAddAnimalModal(false);
    setNewAnimal({
      name: '',
      species: 'Cow',
      tagId: '',
      breed: 'Gir',
      count: 1,
      ageMonths: 24,
      healthStatus: 'Healthy',
      lastVaccine: 'FMD Vaccine',
      lastVaccineDate: '2026-03-10'
    });
  };

  // Handle Record Vaccine
  const handleRecordVaccine = (e) => {
    e.preventDefault();
    if (!vaccineForm.animalId) {
      alert('Please select an animal.');
      return;
    }

    const updated = herd.map(a => {
      if (a.id === vaccineForm.animalId) {
        return {
          ...a,
          lastVaccine: vaccineForm.vaccineName,
          lastVaccineDate: vaccineForm.administeredDate,
          nextVaccineDue: vaccineForm.nextDueDate,
          status: 'Vaccinated (Protected)'
        };
      }
      return a;
    });

    if (setHerd) {
      setHerd(updated);
    }
    try {
      localStorage.setItem('pashu_farmer_herd', JSON.stringify(updated));
    } catch (err) {}

    alert(`✅ Vaccination Recorded Successfully for Animal ${vaccineForm.animalId}! Next booster scheduled for ${vaccineForm.nextDueDate}.`);
    setShowVaccineModal(false);
  };

  // Handle Delete Animal
  const handleDeleteAnimal = (id) => {
    if (window.confirm(`Are you sure you want to remove animal ${id} from your registered herd?`)) {
      const updated = herd.filter(a => a.id !== id);
      if (setHerd) setHerd(updated);
      try {
        localStorage.setItem('pashu_farmer_herd', JSON.stringify(updated));
      } catch (err) {}
    }
  };

  // Filtered Herd
  const filteredHerd = herd.filter(a => {
    const matchesSpecies = speciesFilter === 'ALL' || a.species.toLowerCase() === speciesFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.breed && a.breed.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpecies && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#0F2F5C] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Livestock Asset & Health Ledger
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
              NADCP Integrated
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1 flex items-center space-x-2">
            <Syringe className="w-5 h-5 text-[#0F2F5C]" />
            <span>Herd Health, Vaccination & Diagnostic Referral Center</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Register ear-tagged livestock, schedule mandatory bi-annual boosters, and track state laboratory diagnostic samples.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddAnimalModal(true)}
            className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Livestock</span>
          </button>

          <button
            onClick={() => {
              if (herd.length > 0) {
                setVaccineForm(prev => ({ ...prev, animalId: herd[0].id }));
              }
              setShowVaccineModal(true);
            }}
            className="bg-[#E07B00] hover:bg-[#C96E00] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
          >
            <Syringe className="w-4 h-4" />
            <span>Record Vaccination</span>
          </button>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="bg-gray-100 p-1 rounded-xl flex space-x-1 text-xs font-bold border border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('herd')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer shrink-0 ${
            activeTab === 'herd' ? 'bg-white text-[#0F2F5C] shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🐄 Registered Herd ({herd.length})
        </button>
        <button
          onClick={() => setActiveTab('vaccination')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'vaccination' ? 'bg-white text-[#0F2F5C] shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Vaccination Due Reminders & Calendar</span>
        </button>
        <button
          onClick={() => setActiveTab('treatments')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'treatments' ? 'bg-white text-[#0F2F5C] shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Prescription Treatment History ({prescriptions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'labs' ? 'bg-white text-[#0F2F5C] shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Diagnostic Lab Referrals ({labReferrals.length})</span>
        </button>
      </div>

      {/* TAB 1: HERD DIRECTORY */}
      {activeTab === 'herd' && (
        <div className="space-y-4">
          
          {/* Controls bar: Search & Species Filter */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by tag ID, animal name or breed..."
                className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F2F5C]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-gray-600">Species:</span>
              <select
                value={speciesFilter}
                onChange={e => setSpeciesFilter(e.target.value)}
                className="bg-[#F3F4F6] border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-bold focus:outline-none"
              >
                <option value="ALL">All Species</option>
                <option value="cow">Cattle / Cow</option>
                <option value="buffalo">Buffalo</option>
                <option value="goat">Goat</option>
                <option value="sheep">Sheep</option>
                <option value="poultry">Poultry</option>
              </select>
            </div>
          </div>

          {/* Herd Cards Grid */}
          {filteredHerd.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center space-y-3">
              <Syringe className="w-10 h-10 text-gray-400 mx-auto opacity-50" />
              <h4 className="font-bold text-gray-800 text-sm">No Livestock Found</h4>
              <p className="text-xs text-gray-500">No animals match your search filter. Register your herd above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHerd.map(animal => (
                <div key={animal.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3 hover:border-blue-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[#0F2F5C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {animal.id}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1">
                        {animal.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {animal.species} • {animal.breed || 'Indigenous'} ({animal.ageMonths || 24} mos)
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      animal.status === 'Healthy' || animal.status.includes('Vaccinated')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {animal.status}
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] border border-gray-100 rounded-lg p-2.5 text-xs space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Last Vaccine:</span>
                      <strong className="text-gray-800">{animal.lastVaccine || 'FMD Vaccine'}</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Vaccinated On:</span>
                      <strong className="text-gray-700">{animal.lastVaccineDate || '2026-03-10'}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-gray-200">
                      <span className="text-gray-500">Next Booster Due:</span>
                      <strong className="text-emerald-700 font-bold">{animal.nextVaccineDue || '2026-09-10'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => {
                        setVaccineForm(prev => ({ ...prev, animalId: animal.id }));
                        setShowVaccineModal(true);
                      }}
                      className="text-[#0F2F5C] hover:text-blue-900 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Syringe className="w-3.5 h-3.5" />
                      <span>Update Vaccine</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAnimal(animal.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                      title="Remove Animal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: VACCINATION DUE CALENDAR & REMINDERS */}
      {activeTab === 'vaccination' && (
        <div className="space-y-6">
          
          {/* Due Booster Alerts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-red-600 font-bold uppercase">Overdue Boosters</span>
                <h4 className="font-extrabold text-sm text-red-900">0 Overdue Animals</h4>
                <p className="text-[10px] text-red-700">All registered stock within safe window</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-amber-700 font-bold uppercase">Due in 30 Days</span>
                <h4 className="font-extrabold text-sm text-amber-900">FMD Bi-Annual Booster</h4>
                <p className="text-[10px] text-amber-800">Cattle scheduled for September cycle</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Herd Protection Rate</span>
                <h4 className="font-extrabold text-sm text-emerald-900">100% Fully Immunized</h4>
                <p className="text-[10px] text-emerald-800">Brucellosis & FMD covered</p>
              </div>
            </div>
          </div>

          {/* Official Comprehensive Vaccination Schedule Table (DAHD / NADCP) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Official National Livestock Vaccination Calendar
                </h3>
                <p className="text-xs text-gray-500">
                  DAHD / Ministry of Fisheries, Animal Husbandry & Dairying (Govt of India) Mandatory Protocols
                </p>
              </div>
              <span className="bg-[#0F2F5C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Free Under NADCP
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0F2F5C] text-white uppercase text-[10px] tracking-wider">
                    <th className="p-3 rounded-l-lg">Target Disease</th>
                    <th className="p-3">Vaccine Name</th>
                    <th className="p-3">Dosage & Frequency</th>
                    <th className="p-3">Target Species</th>
                    <th className="p-3 rounded-r-lg">Eligible Age & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vaccinationSchedule.map(vac => (
                    <tr key={vac.id} className="hover:bg-blue-50/50 transition">
                      <td className="p-3 font-bold text-[#0F2F5C]">{vac.disease}</td>
                      <td className="p-3 font-semibold text-gray-900">{vac.vaccine}</td>
                      <td className="p-3 text-emerald-700 font-bold">{vac.frequency}</td>
                      <td className="p-3 text-gray-700">{vac.targetSpecies}</td>
                      <td className="p-3 text-[11px] text-gray-500">{vac.eligibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PRESCRIPTION TREATMENT HISTORY */}
      {activeTab === 'treatments' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Doctor Prescriptions & Field Treatments</h3>
              <p className="text-xs text-gray-500">
                Official clinical e-prescriptions issued to your livestock by registered veterinary officers.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('/consultations')}
              className="text-[#0F2F5C] hover:text-blue-900 text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Consultations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center space-y-2">
              <FileText className="w-10 h-10 text-gray-400 mx-auto opacity-50" />
              <h4 className="font-bold text-gray-800 text-sm">No Prescriptions Issued Yet</h4>
              <p className="text-xs text-gray-500">When a Veterinary Officer writes a prescription, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.map(rx => (
                <div key={rx.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold bg-[#0F2F5C] text-white px-2 py-0.5 rounded">
                        {rx.id}
                      </span>
                      <span className="font-bold text-xs text-gray-900">Case: {rx.caseId}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">{rx.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Doctor / Hospital:</span>
                      <p className="font-bold text-gray-900">{rx.doctorName} ({rx.license})</p>
                      <p className="text-[11px] text-gray-500">{rx.hospital}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Diagnosis:</span>
                      <p className="font-bold text-[#0F2F5C]">{rx.diagnosis}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                    <span className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Prescribed Medicines:</span>
                    <pre className="text-[11px] text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                      {rx.medicinesText}
                    </pre>
                  </div>

                  {rx.advice && (
                    <p className="text-[11px] text-gray-600 italic">
                      Doctor's Advice: "{rx.advice}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DIAGNOSTIC LAB REFERRALS & TRACKING */}
      {activeTab === 'labs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Diagnostic Laboratory Sample Referrals</h3>
              <p className="text-xs text-gray-500">
                Track blood, swab, and milk sample referrals sent to government disease investigation laboratories.
              </p>
            </div>
            <span className="bg-[#0F2F5C] text-white text-xs font-bold px-3 py-1 rounded-full">
              {labReferrals.length} Active Lab Orders
            </span>
          </div>

          <div className="space-y-3">
            {labReferrals.map(lab => (
              <div key={lab.id} className="bg-white border-2 border-blue-100 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-[#0F2F5C] text-white px-2 py-0.5 rounded">
                      {lab.id}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900">{lab.testRequested}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    lab.priority === 'URGENT' ? 'bg-[#DC2626] text-white' : 'bg-[#0F2F5C] text-white'
                  }`}>
                    {lab.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Specimen / Sample:</span>
                    <strong className="text-gray-900">{lab.sampleType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Diagnostic Lab:</span>
                    <strong className="text-[#0F2F5C]">{lab.laboratory}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Testing Progress:</span>
                    <strong className={lab.status.includes('COMPLETED') ? 'text-emerald-700' : 'text-[#E07B00]'}>
                      {lab.status}
                    </strong>
                  </div>
                </div>

                {lab.notes && (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-950">
                    <span className="font-bold block mb-0.5">Clinical Pathology Directive:</span>
                    <span>{lab.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD ANIMAL MODAL */}
      {showAddAnimalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#0F2F5C]" />
                <span>Register Animal in Herd</span>
              </h3>
              <button onClick={() => setShowAddAnimalModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAnimal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ear Tag ID / Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. IN-MH-PUN-4921"
                  value={newAnimal.tagId}
                  onChange={e => setNewAnimal({ ...newAnimal, tagId: e.target.value })}
                  className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Species</label>
                  <select
                    value={newAnimal.species}
                    onChange={e => setNewAnimal({ ...newAnimal, species: e.target.value })}
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                  >
                    <option value="Cow">Cow / Cattle</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Poultry">Poultry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Breed</label>
                  <input
                    type="text"
                    placeholder="e.g. Gir, Murrah"
                    value={newAnimal.breed}
                    onChange={e => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Animal Name / Tag Descriptor</label>
                <input
                  type="text"
                  placeholder="e.g. Lakshmi, Gauri"
                  value={newAnimal.name}
                  onChange={e => setNewAnimal({ ...newAnimal, name: e.target.value })}
                  className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Age (Months)</label>
                  <input
                    type="number"
                    value={newAnimal.ageMonths}
                    onChange={e => setNewAnimal({ ...newAnimal, ageMonths: e.target.value })}
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Health Status</label>
                  <select
                    value={newAnimal.healthStatus}
                    onChange={e => setNewAnimal({ ...newAnimal, healthStatus: e.target.value })}
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Quarantined">Quarantined</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnimalModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white px-5 py-2 rounded-lg font-bold cursor-pointer"
                >
                  Save Animal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD VACCINE MODAL */}
      {showVaccineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
                <Syringe className="w-4 h-4 text-[#E07B00]" />
                <span>Record Administered Vaccine</span>
              </h3>
              <button onClick={() => setShowVaccineModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordVaccine} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Animal</label>
                <select
                  value={vaccineForm.animalId}
                  onChange={e => setVaccineForm({ ...vaccineForm, animalId: e.target.value })}
                  className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-bold"
                >
                  {herd.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.species} • {a.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vaccine Name</label>
                <select
                  value={vaccineForm.vaccineName}
                  onChange={e => setVaccineForm({ ...vaccineForm, vaccineName: e.target.value })}
                  className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                >
                  <option value="Foot & Mouth Disease (FMD) Vaccine">Foot & Mouth Disease (FMD)</option>
                  <option value="Haemorrhagic Septicaemia (HS) Vaccine">Haemorrhagic Septicaemia (HS)</option>
                  <option value="Black Quarter (BQ) Vaccine">Black Quarter (BQ)</option>
                  <option value="Brucellosis S19 Vaccine">Brucellosis S19 (Calfhood)</option>
                  <option value="Lumpy Skin Disease (Goat Pox) Vaccine">LSD Goat Pox Booster</option>
                  <option value="PPR Live Vaccine">Peste des Petits Ruminants (PPR)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date Administered</label>
                  <input
                    type="date"
                    value={vaccineForm.administeredDate}
                    onChange={e => setVaccineForm({ ...vaccineForm, administeredDate: e.target.value })}
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Next Booster Due</label>
                  <input
                    type="date"
                    value={vaccineForm.nextDueDate}
                    onChange={e => setVaccineForm({ ...vaccineForm, nextDueDate: e.target.value })}
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Batch No / Cold Chain Lot</label>
                <input
                  type="text"
                  value={vaccineForm.batchNo}
                  onChange={e => setVaccineForm({ ...vaccineForm, batchNo: e.target.value })}
                  className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Administering Veterinary Officer / Paravet</label>
                <input
                  type="text"
                  value={vaccineForm.doctorOrParavet}
                  onChange={e => setVaccineForm({ ...vaccineForm, doctorOrParavet: e.target.value })}
                  className="w-full bg-[#F3F4F6] border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowVaccineModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E07B00] hover:bg-[#C96E00] text-white px-5 py-2 rounded-lg font-bold cursor-pointer"
                >
                  Confirm & Update Herd
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
