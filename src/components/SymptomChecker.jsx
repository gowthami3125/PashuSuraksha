import React, { useState } from 'react';
import { 
  Stethoscope, Mic, Camera, Search, CheckCircle, ChevronRight, ChevronLeft, 
  AlertTriangle, ShieldAlert, FileText, MapPin, Users, Skull, Clock, Info, Check, RefreshCw,
  Image as ImageIcon, Trash2, Zap, Video, Eye
} from 'lucide-react';
import { getTrans } from '../data/dictionary';
import { BODY_AREAS } from '../data/symptomsData';
import AIVisionSuggestionModal from './AIVisionSuggestionModal';

const CLINICAL_TEST_CASES = [
  {
    id: 'fmd_cattle',
    title: '1. FMD (Cattle)',
    animalId: 'cow',
    symptoms: ['fever', 'salivation', 'blisters_mouth', 'lameness'],
    sickCount: 3,
    deadCount: 0,
    durationDays: 2,
    location: 'Haveli, Pune - 411028',
    freeText: 'Cow has high fever, excessive stringy drooling and painful blisters on tongue and hooves.'
  },
  {
    id: 'anthrax_cattle',
    title: '2. Anthrax Suspect (Cattle)',
    animalId: 'cow',
    symptoms: ['sudden_death', 'fever', 'blood_stool'],
    sickCount: 2,
    deadCount: 1,
    durationDays: 1,
    location: 'Baramati, Pune - 413102',
    freeText: 'Cow died suddenly overnight with dark uncoagulated blood discharge from orifices.'
  },
  {
    id: 'ppr_goat',
    title: '3. PPR (Goat)',
    animalId: 'goat',
    symptoms: ['fever', 'diarrhea', 'respiratory', 'blisters_mouth'],
    sickCount: 4,
    deadCount: 0,
    durationDays: 3,
    location: 'Guntur, Andhra Pradesh - 522002',
    freeText: 'Goats have severe watery diarrhea, high fever, nasal crusts and mouth sores.'
  },
  {
    id: 'ranikhet_poultry',
    title: '4. Ranikhet / ND (Poultry)',
    animalId: 'poultry',
    symptoms: ['severe_gasping', 'diarrhea', 'convulsions'],
    sickCount: 15,
    deadCount: 4,
    durationDays: 2,
    location: 'Kolhapur, Maharashtra - 416003',
    freeText: 'Chickens gasping with open beaks, greenish loose droppings, twisting necks and sudden flock deaths.'
  },
  {
    id: 'fever_buffalo',
    title: '5. Non-Specific Fever (Buffalo)',
    animalId: 'buffalo',
    symptoms: ['fever'],
    sickCount: 1,
    deadCount: 0,
    durationDays: 1,
    location: 'Nashik, Maharashtra - 422001',
    freeText: 'Buffalo has elevated body temperature (>104F), lethargic but no blisters or loose dung.'
  }
];

export default function SymptomChecker({ 
  selectedAnimal, setSelectedAnimal, 
  selectedSymptoms, toggleSymptom, setSelectedSymptoms, 
  animalsList, symptomsList, 
  voiceTranscript, setVoiceTranscript, parseAndSelectSymptomsFromText, 
  openVoiceTriageModal, setShowImageModal, photoDetectionNote, setPhotoDetectionNote,
  sickCount, setSickCount,
  deadCount, setDeadCount,
  durationDays, setDurationDays,
  location, setLocation,
  freeTextDescription, setFreeTextDescription,
  otherPerArea, setOtherPerArea,
  attachedMedia, setAttachedMedia,
  handleWizardSubmit,
  lang, dict 
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptomSearchQuery, setSymptomSearchQuery] = useState('');
  const [activeBodyAreaTab, setActiveBodyAreaTab] = useState('all');
  const [showVisionModal, setShowVisionModal] = useState(false);

  const handleLoadTestCase = (tc) => {
    setSelectedAnimal(tc.animalId);
    setSelectedSymptoms(tc.symptoms);
    setSickCount(tc.sickCount);
    setDeadCount(tc.deadCount);
    setDurationDays(tc.durationDays);
    setLocation(tc.location);
    setFreeTextDescription(tc.freeText);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selected animal object
  const selectedAnimalObj = (animalsList && animalsList.find(a => a.id === selectedAnimal)) || (animalsList && animalsList[0]) || { nameEn: 'Livestock', icon: '🐄' };
  const isPetSelected = selectedAnimalObj?.category === 'pet';

  // Filter symptoms by search query & body area tab
  const filteredSymptoms = (symptomsList || []).filter(s => {
    const label = (getTrans(s, 'label', lang) || s?.labelEn || '').toLowerCase();
    const query = (symptomSearchQuery || '').trim().toLowerCase();
    const matchesSearch = !query || 
      label.includes(query) || 
      (Array.isArray(s.keywords) && s.keywords.some(k => (k || '').toString().toLowerCase().includes(query)));
    
    const matchesTab = activeBodyAreaTab === 'all' || s.bodyArea === activeBodyAreaTab;
    return matchesSearch && matchesTab;
  });

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAnimal) return;
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateOtherForArea = (areaId, value) => {
    setOtherPerArea(prev => ({
      ...prev,
      [areaId]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR WITH WIZARD STEPPERS */}
      <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest block">
              {dict.step || 'Step'} {currentStep} {dict.of || 'of'} 4 — {currentStep === 1 ? (dict.step1SelectSpecies || 'Select Species') : currentStep === 2 ? (dict.step2ObservedSymptoms || 'Observed Symptoms') : currentStep === 3 ? (dict.step3IncidentDetails || 'Incident Details') : (dict.step4ReviewSubmit || 'Review & Submit')}
            </span>
            <h2 className="text-xl font-bold text-[#111827] flex items-center space-x-2 mt-0.5">
              <Stethoscope className="w-6 h-6 text-[#0F2F5C]" />
              <span>{dict.wizardTitle || "PashuSuraksha Symptom Check Wizard"}</span>
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={openVoiceTriageModal}
              className="flex items-center space-x-1.5 bg-[#F3F4F6] hover:bg-[#D1D5DB]/50 text-[#0F2F5C] font-bold px-3 py-1.5 rounded-lg border border-[#D1D5DB] transition text-xs cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-[#0F2F5C]" />
              <span>{dict.voiceBtn || 'Voice Mic'}</span>
            </button>

            <button 
              onClick={() => setShowImageModal(true)}
              className="flex items-center space-x-1.5 bg-[#F3F4F6] hover:bg-[#D1D5DB]/50 text-[#0F2F5C] font-bold px-3 py-1.5 rounded-lg border border-[#D1D5DB] transition text-xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#0F2F5C]" />
              <span>{dict.imageBtn || 'Upload Photo'}</span>
            </button>
          </div>
        </div>

        {/* STEP PROGRESS INDICATOR BAR */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: `1. ${dict.step1SelectSpecies || 'Animal'}` },
            { num: 2, label: `2. ${dict.step2ObservedSymptoms || 'Symptoms'}` },
            { num: 3, label: `3. ${dict.step3IncidentDetails || 'Details'}` },
            { num: 4, label: `4. ${dict.step4ReviewSubmit || 'Review'}` }
          ].map(s => (
            <div 
              key={s.num}
              onClick={() => { if (s.num < currentStep) setCurrentStep(s.num); }}
              className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                currentStep === s.num
                  ? 'border-2 border-[#0F2F5C] bg-[#0F2F5C] text-white'
                  : currentStep > s.num
                  ? 'border-[#D1D5DB] bg-[#F3F4F6] text-[#0F2F5C]'
                  : 'border-[#D1D5DB] bg-white text-[#4B5563]'
              }`}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* 1-CLICK VERIFICATION SCENARIOS (SECTION 17) */}
        <div className="pt-3 border-t border-[#D1D5DB]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-[#0F2F5C] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#E07B00]" />
              {dict.quickClinicalScenarios || "Quick Clinical Test Scenarios (1-Click Test):"}
            </span>
            <span className="text-[10px] text-[#4B5563]">1-Click load & test any of the 5 clinical mock cases</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CLINICAL_TEST_CASES.map(tc => (
              <button
                key={tc.id}
                type="button"
                onClick={() => handleLoadTestCase(tc)}
                className="px-2.5 py-1.5 bg-[#F3F4F6] hover:bg-[#0F2F5C] hover:text-white text-[#0F2F5C] border border-[#D1D5DB] rounded-md text-[11px] font-bold text-left transition flex items-center justify-between group cursor-pointer shadow-sm"
                title={`Load ${tc.title}`}
              >
                <span className="truncate">{tc.title}</span>
                <ChevronRight className="w-3 h-3 text-[#4B5563] group-hover:text-white flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {photoDetectionNote && (
        <div className="bg-[#F3F4F6] border border-[#D1D5DB] p-4 rounded-lg flex items-center justify-between text-xs font-bold text-[#111827]">
          <span>{photoDetectionNote}</span>
          <button onClick={() => setPhotoDetectionNote(null)} className="text-[#4B5563] hover:text-[#111827]">✕</button>
        </div>
      )}

      {/* STEP 1: ANIMAL SPECIES SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#111827]">{dict.selectAnimal || "Step 1: Choose Animal Species"}</h3>
            <p className="text-xs text-[#4B5563] mt-1">Select the affected species to tailor symptom lists and diagnostic models.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {animalsList.map(a => {
              const isSel = selectedAnimal === a.id;
              const name = getTrans(a, 'name', lang);
              const count = getTrans(a, 'count', lang);

              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAnimal(a.id)}
                  className={`flex flex-col items-center p-5 rounded-lg border text-center transition cursor-pointer ${
                    isSel 
                      ? 'border-2 border-[#0F2F5C] bg-[#F3F4F6] font-bold text-[#0F2F5C]' 
                      : 'border-[#D1D5DB] bg-white text-[#111827] hover:border-[#0F2F5C]'
                  }`}
                >
                  <span className="text-4xl mb-2">{a.icon}</span>
                  <span className="text-xs font-bold block">{name}</span>
                  <span className="text-[10px] text-[#4B5563] mt-1">{count}</span>
                </button>
              );
            })}
          </div>

          {/* PET COMPANION NOTICE */}
          {isPetSelected && (
            <div className="bg-[#F3F4F6] border-2 border-[#D97706] p-4 rounded-lg flex items-start space-x-3 text-xs text-[#111827]">
              <Info className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#D97706] text-sm mb-1">Companion Pet Selected ({selectedAnimalObj?.nameEn || 'Pet'})</span>
                <p className="text-[#4B5563]">
                  PashuSuraksha triage logic is optimized for rural livestock and poultry. For companion pets (dogs & cats), results provide immediate safety precautions and advice for consulting a local small-animal clinic.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[#D1D5DB]">
            <button
              onClick={handleNextStep}
              className="btn-navy px-6 py-2.5 rounded-lg text-xs flex items-center space-x-2 cursor-pointer"
            >
              <span>{dict.nextStepBtn || "Next Step"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SYMPTOMS SELECTION (GROUPED BY BODY AREA WITH SEARCH & OTHER) */}
      {currentStep === 2 && (
        <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#111827]">{dict.selectSymptoms || "Step 2: Choose Observed Symptoms"}</h3>
                <p className="text-xs text-[#4B5563] mt-1">
                  Select all symptoms visible on your {getTrans(selectedAnimalObj, 'name', lang) || selectedAnimalObj?.nameEn || 'Livestock'}. ({selectedSymptoms.length} selected)
                </p>
              </div>

              {selectedSymptoms.length > 0 && (
                <button 
                  onClick={() => setSelectedSymptoms([])}
                  className="text-xs font-bold text-[#4B5563] hover:text-[#111827] flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{dict.resetForm || "Clear All Selected"}</span>
                </button>
              )}
            </div>
          </div>

          {/* SEARCH & VOICE INPUT BOX */}
          <div className="bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB] space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                {dict.searchSymptomsPlaceholder ? dict.searchSymptomsPlaceholder.split('(')[0] : "Search or Type Symptoms"}
              </label>
            </div>
            
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-[#0F2F5C]" />
              <input 
                type="text"
                placeholder={dict.searchSymptomsPlaceholder || "Type symptom keywords (e.g. fever, drooling, blisters, coughing)..."}
                value={symptomSearchQuery}
                onChange={(e) => {
                  setSymptomSearchQuery(e.target.value);
                  parseAndSelectSymptomsFromText(e.target.value);
                }}
                className="w-full bg-white border border-[#D1D5DB] rounded-lg pl-10 pr-24 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />

              <button
                onClick={openVoiceTriageModal}
                className="absolute right-2 bg-[#0F2F5C] hover:bg-[#0B2447] text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center space-x-1 cursor-pointer"
              >
                <Mic className="w-3 h-3" />
                <span>{dict.voiceBtn || "Voice"}</span>
              </button>
            </div>
          </div>

          {/* BODY AREA CATEGORY TABS */}
          <div className="flex overflow-x-auto space-x-2 pb-2 border-b border-[#D1D5DB]">
            <button
              onClick={() => setActiveBodyAreaTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                activeBodyAreaTab === 'all'
                  ? 'bg-[#0F2F5C] text-white'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
              }`}
            >
              {dict.allBodyAreas || "All Body Areas"} ({symptomsList.length})
            </button>
            {BODY_AREAS.map(area => {
              const label = getTrans(area, 'label', lang);
              const areaCount = symptomsList.filter(s => s.bodyArea === area.id).length;
              return (
                <button
                  key={area.id}
                  onClick={() => setActiveBodyAreaTab(area.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                    activeBodyAreaTab === area.id
                      ? 'bg-[#0F2F5C] text-white'
                      : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
                  }`}
                >
                  {label} ({areaCount})
                </button>
              );
            })}
          </div>

          {/* SYMPTOMS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSymptoms.map(s => {
              const isSel = selectedSymptoms.includes(s.id);
              const label = getTrans(s, 'label', lang);

              return (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  className={`text-left p-3.5 rounded-lg border transition flex items-start justify-between cursor-pointer ${
                    s.isDanger
                      ? isSel
                        ? 'border-2 border-[#DC2626] bg-[#DC2626]/10 text-[#DC2626] font-bold'
                        : 'border-[#DC2626]/50 bg-white text-[#111827] hover:border-[#DC2626]'
                      : isSel 
                      ? 'border-2 border-[#0F2F5C] bg-[#F3F4F6] text-[#0F2F5C] font-bold' 
                      : 'border-[#D1D5DB] bg-white text-[#111827] hover:border-[#0F2F5C]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest block text-[#4B5563]">
                      {s.bodyArea}
                    </span>
                    <span className="text-xs font-bold flex items-center space-x-2">
                      <span className="text-base">{s.icon}</span>
                      <span>{label}</span>
                    </span>
                  </div>

                  <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 ${
                    isSel 
                      ? s.isDanger ? 'bg-[#DC2626] border-[#DC2626] text-white' : 'bg-[#0F2F5C] border-[#0F2F5C] text-white'
                      : 'border-[#D1D5DB] bg-white'
                  }`}>
                    {isSel && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* OTHER (TYPE OR SPEAK) FOR ACTIVE CATEGORY */}
          <div className="bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB] space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center space-x-1">
              <span>{dict.otherSpecify || "Other Symptoms in Plain Words (Type or Speak)"}</span>
            </h4>
            <p className="text-[11px] text-[#4B5563]">
              If a specific observation is missing from the buttons above, type or speak it below. It will be sent to the veterinary officer as free text.
            </p>
            <input 
              type="text"
              placeholder="e.g., tail twitching, unusual vocalization, swelling behind ears..."
              value={otherPerArea[activeBodyAreaTab] || ''}
              onChange={(e) => updateOtherForArea(activeBodyAreaTab, e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
            />
          </div>

          {/* DESCRIBE IN OWN WORDS FREE TEXT AREA */}
          <div className="bg-white p-4 rounded-lg border border-[#D1D5DB] space-y-2">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
              Describe full history in your own words (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide context (e.g. bought new animal from market 3 days ago, symptoms started yesterday morning)..."
              value={freeTextDescription}
              onChange={(e) => setFreeTextDescription(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-lg p-3 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
            />
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between pt-4 border-t border-[#D1D5DB]">
            <button
              onClick={handlePrevStep}
              className="bg-[#F3F4F6] hover:bg-[#D1D5DB]/50 text-[#111827] border border-[#D1D5DB] font-bold px-4 py-2.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{dict.prevStepBtn || "Back"}</span>
            </button>

            <button
              onClick={handleNextStep}
              className="btn-navy px-6 py-2.5 rounded-lg text-xs flex items-center space-x-2 cursor-pointer"
            >
              <span>{dict.nextStepBtn || "Next Step"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INCIDENT DETAILS FORM */}
      {currentStep === 3 && (
        <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#111827]">{dict.step3IncidentDetails || "Step 3: Incident & Location Details"}</h3>
            <p className="text-xs text-[#4B5563] mt-1">{dict.numSickAnimalsHint || "Provide numbers and location so veterinary officers can assess outbreak severity."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111827] flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#0F2F5C]" />
                <span>{dict.numSickAnimals || "Number of Sick Animals"}</span>
              </label>
              <input 
                type="number"
                min={1}
                value={sickCount}
                onChange={(e) => setSickCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-3 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />
              <p className="text-[10px] text-[#4B5563]">{dict.numSickAnimalsHint || "Specify total animals showing these symptoms in your herd."}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111827] flex items-center space-x-2">
                <Skull className="w-4 h-4 text-[#DC2626]" />
                <span>{dict.numDeadAnimals || "Number of Dead Animals"}</span>
              </label>
              <input 
                type="number"
                min={0}
                value={deadCount}
                onChange={(e) => setDeadCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-3 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />
              <p className="text-[10px] text-[#4B5563]">{dict.numDeadAnimalsHint || "Enter 0 if no animals have died."}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111827] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#0F2F5C]" />
                <span>{dict.durationDays || "Duration Since Symptoms Onset (Days)"}</span>
              </label>
              <input 
                type="number"
                min={1}
                value={durationDays}
                onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-3 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111827] flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#0F2F5C]" />
                <span>{dict.locationLabel || "Location / Village / PIN Code"}</span>
              </label>
              <input 
                type="text"
                placeholder="e.g. Village Baramati, Pune - 413102"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-3 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />
            </div>
          </div>

          {/* PHOTO / CAMERA / VIDEO ATTACHMENT CARD (SECTION 17 - TASK 6) */}
          <div className="space-y-3 pt-2 border-t border-[#D1D5DB]">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#111827] flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-[#0F2F5C]" />
                  <span>{dict.clinicalMediaLabel || "Clinical Photo or Video of Lesions (Auto-Compressed for Rural 2G/3G)"}</span>
                </label>
                <p className="text-[11px] text-[#4B5563]">{dict.clinicalMediaHint || "Take camera snapshot or upload media. High-clarity 1024px JPEG under 250 KB automatically transmitted to local vet."}</p>
              </div>
              {attachedMedia && (
                <button
                  type="button"
                  onClick={() => setAttachedMedia && setAttachedMedia(null)}
                  className="text-xs text-[#DC2626] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{dict.removeMediaBtn || "Remove Media"}</span>
                </button>
              )}
            </div>

            {attachedMedia ? (
              <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border border-[#D1D5DB]">
                    {attachedMedia.type === 'video' ? (
                      <video src={attachedMedia.videoUrl} className="w-full h-full object-cover" />
                    ) : (
                      <img src={attachedMedia.dataUrl} alt="Attached lesion" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-[#111827] truncate max-w-[200px]">{attachedMedia.name || 'lesion_photo.jpg'}</span>
                      <span className="bg-green-100 text-[#15803D] text-[10px] font-bold px-1.5 py-0.2 rounded">Compressed ✓</span>
                    </div>
                    <p className="text-[#4B5563] text-[11px]">
                      Original: <strong>{attachedMedia.originalSize}</strong> ➔ Compressed: <strong className="text-[#0F2F5C]">{attachedMedia.compressedSize}</strong> ({attachedMedia.reductionPercent > 0 ? `-${attachedMedia.reductionPercent}%` : 'Low-Bandwidth Optimized'})
                    </p>
                    <p className="text-[10px] text-[#4B5563]">Attached to incident for duty veterinary officer queue</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVisionModal(true)}
                    className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center space-x-1.5 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-yellow-300" />
                    <span>{dict.aiVisionSuggestionBtn || "AI Vision Suggestion"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="bg-white hover:bg-gray-50 text-[#0F2F5C] border border-[#D1D5DB] font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{dict.retakeChangeBtn || "Retake / Change"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="w-full py-4 bg-[#F3F4F6] hover:bg-gray-100 border-2 border-dashed border-[#0F2F5C]/40 hover:border-[#0F2F5C] rounded-xl text-xs font-bold text-[#0F2F5C] flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer transition shadow-xs"
              >
                <div className="p-2 bg-[#0F2F5C] text-white rounded-lg">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="block font-bold">{dict.mediaCaptureBtn || "Capture Camera Photo or Upload Media"}</span>
                  <span className="text-[10px] text-[#4B5563] font-normal">Supports live camera snapshot, photo file, or video clip (auto-compressed &lt;250 KB)</span>
                </div>
              </button>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-[#D1D5DB]">
            <button
              onClick={handlePrevStep}
              className="bg-[#F3F4F6] hover:bg-[#D1D5DB]/50 text-[#111827] border border-[#D1D5DB] font-bold px-4 py-2.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{dict.prevStepBtn || "Back"}</span>
            </button>

            <button
              onClick={handleNextStep}
              className="btn-navy px-6 py-2.5 rounded-lg text-xs flex items-center space-x-2 cursor-pointer"
            >
              <span>{dict.nextStepBtn || "Next Step"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW SUMMARY & SUBMIT */}
      {currentStep === 4 && (
        <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#111827]">{dict.step4ReviewSubmit || "Step 4: Review Submission Summary"}</h3>
            <p className="text-xs text-[#4B5563] mt-1">Verify details before generating the clinical triage result.</p>
          </div>

          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-3">
              <span className="text-xs font-bold text-[#4B5563] uppercase">{dict.step1SelectSpecies || "Species Selected"}</span>
              <span className="text-sm font-bold text-[#0F2F5C] flex items-center space-x-2">
                <span>{selectedAnimalObj?.icon || '🐄'}</span>
                <span>{getTrans(selectedAnimalObj, 'name', lang) || selectedAnimalObj?.nameEn || 'Livestock'}</span>
              </span>
            </div>

            <div className="border-b border-[#D1D5DB] pb-3 space-y-2">
              <span className="text-xs font-bold text-[#4B5563] uppercase block">{dict.step2ObservedSymptoms || "Selected Symptoms"} ({selectedSymptoms.length})</span>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.length > 0 ? (
                  selectedSymptoms.map(sId => {
                    const sym = symptomsList && symptomsList.find(s => s.id === sId);
                    return (
                      <span key={sId} className="bg-white border border-[#D1D5DB] text-[#111827] px-2.5 py-1 rounded text-xs font-bold">
                        {sym ? `${sym.icon || ''} ${getTrans(sym, 'label', lang) || sym.labelEn || sId}` : sId}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-[#4B5563] italic">No checklist symptoms selected (Using free text description)</span>
                )}
              </div>
            </div>

            {/* ATTACHED MEDIA ROW IN SUMMARY */}
            {attachedMedia && (
              <div className="border-b border-[#D1D5DB] pb-3 space-y-2">
                <span className="text-xs font-bold text-[#4B5563] uppercase block">{dict.clinicalMediaLabel || "Attached Clinical Media"}</span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#D1D5DB]">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-[#D1D5DB]">
                      {attachedMedia.type === 'video' ? (
                        <video src={attachedMedia.videoUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={attachedMedia.dataUrl} alt="Attached lesion" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-[#111827]">{attachedMedia.name}</p>
                      <p className="text-[11px] text-[#4B5563]">Payload: <strong className="text-[#0F2F5C]">{attachedMedia.compressedSize}</strong> (Original: {attachedMedia.originalSize})</p>
                      <span className="text-[10px] text-[#15803D] font-bold">✓ Ready for transmission to duty veterinary officer queue</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVisionModal(true)}
                    className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-xs transition flex-shrink-0"
                    title="Run AI Vision Lesion Check on attached media"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    <span>Run AI Lesion Check</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-[#D1D5DB] pb-3 text-xs">
              <div>
                <span className="text-[#4B5563] block font-bold">{dict.numSickAnimals || "Sick Count"}</span>
                <span className="font-bold text-[#111827] text-sm">{sickCount}</span>
              </div>
              <div>
                <span className="text-[#4B5563] block font-bold">{dict.numDeadAnimals || "Dead Count"}</span>
                <span className={`font-bold text-sm ${deadCount > 0 ? 'text-[#DC2626]' : 'text-[#111827]'}`}>{deadCount}</span>
              </div>
              <div>
                <span className="text-[#4B5563] block font-bold">{dict.durationDays || "Onset Duration"}</span>
                <span className="font-bold text-[#111827] text-sm">{durationDays}</span>
              </div>
              <div>
                <span className="text-[#4B5563] block font-bold">{dict.locationLabel || "Location"}</span>
                <span className="font-bold text-[#111827] text-sm">{location || 'Baramati, MH'}</span>
              </div>
            </div>

            {freeTextDescription && (
              <div className="space-y-1 text-xs">
                <span className="text-[#4B5563] font-bold block uppercase">Farmer Free Text History</span>
                <p className="bg-white p-3 rounded border border-[#D1D5DB] text-[#111827] italic">"{freeTextDescription}"</p>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-[#D1D5DB]">
            <button
              onClick={handlePrevStep}
              className="bg-[#F3F4F6] hover:bg-[#D1D5DB]/50 text-[#111827] border border-[#D1D5DB] font-bold px-4 py-2.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{dict.prevStepBtn || "Back"}</span>
            </button>

            <button
              onClick={handleWizardSubmit}
              className="btn-navy px-8 py-3 rounded-lg text-sm font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span>{dict.submitGenerateTriage || "Submit & Generate Triage Result"}</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Vision Diagnostic Suggestion Modal (Phase 4) */}
      <AIVisionSuggestionModal
        isOpen={showVisionModal}
        onClose={() => setShowVisionModal(false)}
        mediaDataUrl={attachedMedia?.dataUrl}
        species={selectedAnimal}
        reportedSigns={selectedSymptoms}
        onApplySuggestions={(analysis) => {
          if (analysis && analysis.candidateConditions?.[0]) {
            const newSymptoms = [];
            const candidateNames = (analysis.candidateConditions || []).map(c => c.name.toLowerCase());
            const detectedSignsText = (analysis.detectedSigns || []).join(' ').toLowerCase();

            if (candidateNames.some(c => c.includes('lumpy')) || detectedSignsText.includes('nodule')) {
              newSymptoms.push('skin_lesions', 'fever');
            }
            if (candidateNames.some(c => c.includes('foot and mouth') || c.includes('fmd')) || detectedSignsText.includes('salivat') || detectedSignsText.includes('blister')) {
              newSymptoms.push('blisters_mouth', 'salivation', 'lameness');
            }
            if (candidateNames.some(c => c.includes('mastitis')) || detectedSignsText.includes('udder')) {
              newSymptoms.push('swollen_udder', 'fever');
            }

            if (newSymptoms.length > 0 && setSelectedSymptoms) {
              setSelectedSymptoms(prev => Array.from(new Set([...prev, ...newSymptoms])));
            }

            const primaryCond = analysis.candidateConditions[0].name;
            setPhotoDetectionNote && setPhotoDetectionNote(
              `✨ AI Visual Suggestion: Detected signs for ${primaryCond} (${analysis.disclaimer || 'AI suggestion — a vet will confirm'}). Symptoms added.`
            );
          }
        }}
      />
    </div>
  );
}
