import React, { useState, useEffect, useRef } from 'react';
import {
  Stethoscope, Mic, Volume2, Copy, Check, CheckCircle, AlertTriangle, ShieldAlert,
  Activity, FileText, MapPin, Globe, Wifi, WifiOff, User, Phone, Video, Plus, Trash2, Search,
  Calendar, Syringe, Send, Clock, ChevronRight, Filter, ArrowRight, Lock, LogOut, RefreshCw,
  ClipboardList, Building2, X, MessageSquare, Upload, FilePlus, FlaskConical, UserCheck, BadgeCheck,
  Camera
} from 'lucide-react';

import { t, getTrans } from './data/dictionary';
import { initialAnimalsList } from './data/animalsData';
import { initialSymptomsList } from './data/symptomsData';
import { parseSymptomsFromText, calculateTriageDiagnosis } from './services/triageEngine';

import Header from './components/Header';
import Footer from './components/Footer';
import HomeOverview from './components/HomeOverview';
import SymptomChecker from './components/SymptomChecker';
import DiagnosticResults from './components/DiagnosticResults';
import VetLocator from './components/VetLocator';
import KnowledgeGuide from './components/KnowledgeGuide';
import OutbreakDashboard from './components/OutbreakDashboard';
import HistoryLog from './components/HistoryLog';
import LiveVetConsultation from './components/LiveVetConsultation';
import AdminVetApprovals from './components/AdminVetApprovals';
import FloatingSahayakChat from './components/FloatingSahayakChat';
import FarmerConsultations from './components/FarmerConsultations';
import CameraModal from './components/CameraModal';
import VoiceModal from './components/VoiceModal';
import ClinicalMediaViewerModal from './components/ClinicalMediaViewerModal';
import Emergency1962Modal from './components/Emergency1962Modal';
import HerdAndVaccination from './components/HerdAndVaccination';
import AlertsBanner from './components/AlertsBanner';
import ModelCard from './components/ModelCard';
import GovSurveillanceDashboard from './components/GovSurveillanceDashboard';
import VetOfficerQueue from './components/VetOfficerQueue';
import DemoWalkthroughModal from './components/DemoWalkthroughModal';
import { queueOfflineReport, syncOfflineReports, getOfflineReportsQueue } from './services/offlineSyncService';
import { getActiveSession, clearActiveSession, createSession, getStoredVets } from './services/authService';
import { speakCustomText, stopAudioPlayback } from './services/audioSpeaker';
import AuthPortal from './components/AuthPortal';
import AdminLogin from './components/AdminLogin';
import AdminUsersList from './components/AdminUsersList';

const INITIAL_VACCINATION_SCHEDULE = [
  { id: 'VAC-01', disease: 'Foot & Mouth Disease (FMD)', vaccine: 'FMD Vaccine', frequency: 'Every 6 Months', targetSpecies: 'Cattle, Buffalo, Sheep, Goat', eligibility: 'Animals > 4 Months Old' },
  { id: 'VAC-02', disease: 'Brucellosis', vaccine: 'Brucella abortus S19', frequency: 'Once in Lifetime', targetSpecies: 'Female Calves (4 - 8 Months)', eligibility: 'Female Calves' },
  { id: 'VAC-03', disease: 'Peste des Petits Ruminants (PPR)', vaccine: 'PPR Live Vaccine', frequency: 'Every 3 Years', targetSpecies: 'Sheep & Goats', eligibility: 'Goats/Sheep > 3 Months Old' },
  { id: 'VAC-04', disease: 'Lumpy Skin Disease (LSD)', vaccine: 'Goat Pox Vaccine', frequency: 'Annual Booster', targetSpecies: 'Cattle & Buffalo', eligibility: 'All Healthy Cows/Buffaloes' }
];

export default function App() {
  // 1. ROUTING & PATH STATE MANAGEMENT
  const [currentPath, setCurrentPath] = useState(() => {
    const raw = window.location.pathname || '/';
    return raw.toLowerCase();
  });

  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('pashu_lang');
      if (saved && ['en', 'mr', 'hi', 'te'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'en'; // Default English as requested by user
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('pashu_lang', newLang);
    } catch (e) {}
  };

  const [guardWarning, setGuardWarning] = useState('');

  // Active Session & User Roles
  const [userSession, setUserSession] = useState(() => getActiveSession());
  const [activeRole, setActiveRole] = useState(() => {
    const sess = getActiveSession();
    return sess?.role || null;
  });

  // Farmer User & Profile State
  const [farmerUser, setFarmerUser] = useState(() => {
    try {
      const sess = getActiveSession();
      if (sess?.role === 'farmer' && sess.user) return sess.user;
      const saved = localStorage.getItem('pashu_current_farmer');
      return saved ? JSON.parse(saved) : { name: 'Anandrao Patil', mobile: '9822012345', village: 'Haveli', district: 'Pune', state: 'Maharashtra' };
    } catch (e) {
      return { name: 'Anandrao Patil', mobile: '9822012345', village: 'Haveli', district: 'Pune', state: 'Maharashtra' };
    }
  });

  // Safe History Initialization from LocalStorage
  const [triageHistory, setTriageHistory] = useState(() => {
    try {
      const sess = getActiveSession();
      const mob = (sess?.role === 'farmer' && sess.user?.mobile) ? sess.user.mobile : (farmerUser?.mobile || '9822012345');
      const saved = localStorage.getItem(`pashu_history_${mob}`);
      if (saved) return JSON.parse(saved);
      if (mob === '9822012345') {
        const legacy = localStorage.getItem('pashu_triage_history');
        if (legacy) return JSON.parse(legacy);
      } else {
        return [];
      }
    } catch (e) {
      console.warn("[History] Failed to parse saved triage history from localStorage:", e);
    }
    return [
      {
        id: 'CASE-2026-881',
        timestamp: new Date().toLocaleDateString() + ' 10:30 AM',
        animalId: 'cow',
        animalName: 'Cattle / Cow',
        animalIcon: '🐄',
        symptomsLabels: ['High Fever (>104°F)', 'Drooling', 'Mouth Blisters'],
        symptomIds: ['fever', 'salivation', 'blisters_mouth'],
        detectedDiseaseEn: 'Foot and Mouth Disease (FMD)',
        confidence: 'High Pattern Match',
        riskLevel: 'High',
        location: 'Haveli, Pune',
        status: 'IN_REVIEW',
        statusTimeline: [
          {
            step: 1,
            title: 'Incident Submitted',
            desc: 'Clinical symptoms and incident details logged by farmer',
            time: new Date().toLocaleDateString() + ' 10:30 AM',
            status: 'completed'
          },
          {
            step: 2,
            title: 'Automated AI Pre-Triage',
            desc: 'Foot and Mouth Disease (High Risk Alert)',
            time: new Date().toLocaleDateString() + ' 10:31 AM',
            status: 'completed'
          },
          {
            step: 3,
            title: 'Transmitted to Local Vet Queue',
            desc: 'Assigned to Dr. S. K. Kulkarni (Haveli Dispensary)',
            time: new Date().toLocaleDateString() + ' 10:35 AM',
            status: 'active'
          },
          {
            step: 4,
            title: 'Veterinary Action & Prescriptions',
            desc: 'Awaiting officer tele-consultation and e-prescription',
            time: 'Pending',
            status: 'pending'
          }
        ],
        incidentDetails: {
          animalId: 'cow',
          sickCount: 3,
          deadCount: 0,
          durationDays: 2,
          location: 'Haveli, Pune',
          caseId: 'CASE-2026-881'
        },
        triageData: {
          riskLevel: 'High',
          riskBadge: 'High Risk Alert',
          title: 'Foot and Mouth Disease (FMD) Suspected',
          matchedConditions: [
            {
              id: 'fmd',
              nameEn: 'Foot and Mouth Disease (FMD)',
              categoryEn: 'Viral Infection',
              confidenceLabel: 'High Pattern Match',
              matchedSymptomsNames: ['High Fever (>104°F)', 'Drooling', 'Mouth Blisters'],
              preventionEn: '• Isolate animal immediately.\n• Disinfect stall with sodium carbonate.',
              treatmentEn: '• Offer soft green fodder.\n• Consult local veterinary officer.'
            }
          ],
          recommendedActions: ['Isolate affected cow.', 'Contact local Veterinary Officer.']
        }
      }
    ];
  });

  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('pashu_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("[History] Failed to parse chat history from localStorage:", e);
    }
    return [
      { id: 'c-welcome', sender: 'ai', text: 'Hello! I am Sahayak, your veterinary Q&A assistant.' }
    ];
  });

  const [sahayakOpen, setSahayakOpen] = useState(false);
  const [sahayakExternalPrompt, setSahayakExternalPrompt] = useState(null);

  // 1962 Emergency Mode State (Task 8)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyContextData, setEmergencyContextData] = useState(null);

  // Offline Mode & Sync State (Task 9)
  const [isBrowserOnline, setIsBrowserOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [forceOfflineDemo, setForceOfflineDemo] = useState(false);
  const [textSize, setTextSizeState] = useState(() => {
    try {
      const saved = localStorage.getItem('pashu_text_size');
      if (saved && ['sm', 'md', 'lg'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'md';
  });

  const setTextSize = (newSize) => {
    if (['sm', 'md', 'lg'].includes(newSize)) {
      setTextSizeState(newSize);
      try {
        localStorage.setItem('pashu_text_size', newSize);
      } catch (e) {}
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    root.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  const [offlineQueueCount, setOfflineQueueCount] = useState(() => {
    try {
      return getOfflineReportsQueue().length;
    } catch (e) {
      return 0;
    }
  });
  const currentNetworkStatus = isBrowserOnline && !forceOfflineDemo;

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);
    const handleQueueChange = (e) => setOfflineQueueCount(e?.detail?.count ?? getOfflineReportsQueue().length);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('pashu-offline-queue-changed', handleQueueChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pashu-offline-queue-changed', handleQueueChange);
    };
  }, []);

  const handleSyncNow = async () => {
    const result = await syncOfflineReports((syncedReport) => {
      setTriageHistory(prev => {
        if (prev.some(h => h.id === syncedReport.id)) return prev;
        return [syncedReport, ...prev];
      });
    });
    setOfflineQueueCount(result.remainingCount);
    alert(`✅ Offline Sync Complete: ${result.syncedCount} queued report(s) successfully synchronized.`);
  };

  // Vet Officers State
  const [pendingVets, setPendingVets] = useState(() => {
    try {
      const all = getStoredVets();
      return all.filter(v => v.status === 'pending');
    } catch (e) {
      return [];
    }
  });
  const [approvedVets, setApprovedVets] = useState(() => {
    try {
      const all = getStoredVets();
      return all.filter(v => v.status === 'approved');
    } catch (e) {
      return [];
    }
  });
  const [currentVetUser, setCurrentVetUser] = useState(() => {
    const sess = getActiveSession();
    if (sess?.role === 'vet') return sess.user;
    const vets = getStoredVets();
    return vets.find(v => v.status === 'approved') || vets[0];
  });
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Shared Data
  const [doctorQueue, setDoctorQueue] = useState([
    {
      id: 'CASE-2026-901',
      farmerName: 'Anandrao Patil',
      farmerMobile: '9822012345',
      location: 'Haveli, Pune, Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      species: 'Cattle (Cow)',
      predictedDisease: 'Foot and Mouth Disease (FMD)',
      urgency: 'High',
      riskLevel: 'High Risk',
      is_simulated: true,
      symptoms: ['High Fever', 'Salivation', 'Mouth Blisters'],
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80',
      attachedMedia: {
        type: 'image',
        dataUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80',
        originalSize: '3.1 MB',
        compressedSize: '158 KB',
        reductionPercent: 95,
        width: 1024,
        height: 768,
        name: 'tongue_and_hoof_blister_fmd.jpg',
        mimeType: 'image/jpeg',
        capturedAt: '10:30 AM'
      },
      photoMeta: {
        originalSize: '3.1 MB',
        compressedSize: '158 KB',
        mimeType: 'image/jpeg'
      }
    },
    {
      id: 'CASE-2026-902',
      farmerName: 'Ramesh Jagtap',
      farmerMobile: '9822088776',
      location: 'Karad, Satara, Maharashtra',
      district: 'Satara',
      taluka: 'Karad',
      species: 'Dairy Cow (Gir)',
      predictedDisease: 'Lumpy Skin Disease (LSD)',
      urgency: 'High',
      riskLevel: 'High Risk',
      isUrgent: true,
      is_simulated: true,
      symptoms: ['Cutaneous Nodules', 'High Fever (>103°F)', 'Enlarged Prescapular Lymph Nodes'],
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'PENDING',
      photoUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
      attachedMedia: {
        type: 'image',
        dataUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
        originalSize: '2.8 MB',
        compressedSize: '142 KB',
        reductionPercent: 95,
        width: 1024,
        height: 768,
        name: 'skin_nodules_lsd.jpg',
        mimeType: 'image/jpeg',
        capturedAt: '09:15 AM'
      }
    },
    {
      id: 'CASE-2026-903',
      farmerName: 'Balaji Rao',
      farmerMobile: '9440112233',
      location: 'Tenali, Guntur, Andhra Pradesh',
      district: 'Guntur',
      taluka: 'Tenali',
      species: 'Sheep (Nellore Brown)',
      predictedDisease: 'Peste des Petits Ruminants (PPR)',
      urgency: 'Medium',
      riskLevel: 'Moderate Risk',
      is_simulated: true,
      symptoms: ['Nasal Discharge', 'Erosive Oral Lesions', 'Severe Watery Diarrhea'],
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'PRESCRIBED'
    },
    {
      id: 'CASE-2026-904',
      farmerName: 'Suresh Shinde',
      farmerMobile: '9822033445',
      location: 'Baramati, Pune, Maharashtra',
      district: 'Pune',
      taluka: 'Baramati',
      species: 'Bullock (Khillari)',
      predictedDisease: 'Anthrax (Sudden Bleeding)',
      urgency: 'High',
      riskLevel: 'Critical Emergency',
      isUrgent: true,
      is_simulated: true,
      symptoms: ['Sudden High Fever', 'Bleeding from Natural Orifices', 'Rapid Collapse'],
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'ESCALATED',
      escalatedTo: 'District Disease Investigation Section (DIS)',
      escalationReason: 'Suspected Notifiable Index Outbreak — Ring Quarantine & Verification Required',
      sampleTypes: ['Blood swab in sterile vacutainer', 'Peritoneal smear'],
      officerNotes: 'Field investigation team dispatched with protective PPE. Carcass burial protocol enforced.',
      escalatedBy: 'Dr. S. K. Kulkarni',
      escalatedAt: new Date(Date.now() - 7200000).toLocaleString()
    },
    {
      id: 'CASE-2026-905',
      farmerName: 'Tukaram Kadam',
      farmerMobile: '9822055667',
      location: 'Sangamner, Ahmednagar, Maharashtra',
      district: 'Ahmednagar',
      taluka: 'Sangamner',
      species: 'Buffalo (Murrah)',
      predictedDisease: 'Brucellosis',
      urgency: 'Medium',
      riskLevel: 'Moderate Risk',
      is_simulated: true,
      symptoms: ['Late-Term Abortion', 'Retained Placenta', 'Carpal Hygroma'],
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'PENDING'
    }
  ]);

  const [farmerHerd, setFarmerHerd] = useState(() => {
    try {
      const sess = getActiveSession();
      const mob = (sess?.role === 'farmer' && sess.user?.mobile) ? sess.user.mobile : (farmerUser?.mobile || '9822012345');
      const saved = localStorage.getItem(`pashu_herd_${mob}`);
      if (saved) return JSON.parse(saved);
      if (mob === '9822012345') {
        const legacy = localStorage.getItem('pashu_farmer_herd');
        if (legacy) return JSON.parse(legacy);
      } else {
        return [];
      }
    } catch (e) {}
    return [
      { id: 'TAG-101', name: 'Gowri', species: 'Cow (HF Cross)', age: '3 Years', gender: 'Female', lastVaccine: 'FMD Vaccine', lastVaccineDate: '2025-11-15', nextDue: '2026-05-15', status: 'Vaccinated', is_simulated: true },
      { id: 'TAG-102', name: 'Kapila', species: 'Buffalo', age: '4 Years', gender: 'Female', lastVaccine: 'Brucellosis S19', lastVaccineDate: '2024-08-10', nextDue: 'Completed', status: 'Vaccinated', is_simulated: true }
    ];
  });

  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('pashu_prescriptions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'RX-2026-101',
        caseId: 'CASE-2026-901',
        farmerMobile: '9822012345',
        farmerName: 'Anandrao Patil',
        doctorName: 'Dr. S. K. Kulkarni',
        license: 'VCI-MH-2021-0842',
        qualification: 'M.V.Sc (Epidemiology)',
        hospital: 'Haveli Taluka Veterinary Polyclinic, Pune',
        diagnosis: 'Foot and Mouth Disease (FMD) — Vesicular Phase',
        medicinesText: '1. Potassium Permanganate (1:1000 dilution) — Wash oral sores and hooves twice daily.\n2. Boroglycerine paint — Apply gently over tongue blisters after feeding.\n3. Meloxicam Oral Suspension 0.5 mg/kg — For fever & pain relief for 3 days.\n4. Vitamin A + B-Complex liquid supplement — 30ml orally once daily for 5 days.',
        advice: 'Keep affected cattle strictly isolated in shaded stall. Provide soft nutritious green fodder, gruel (dalia) and lukewarm water. Do NOT let animal walk on rough stones. Disinfect shed with 4% sodium carbonate.',
        timestamp: new Date().toLocaleDateString() + ' 04:30 PM',
        status: 'ACTIVE'
      }
    ];
  });

  const [consultationSlots, setConsultationSlots] = useState(() => {
    try {
      const sess = getActiveSession();
      const mob = (sess?.role === 'farmer' && sess.user?.mobile) ? sess.user.mobile : (farmerUser?.mobile || '9822012345');
      const saved = localStorage.getItem(`pashu_consultations_${mob}`);
      if (saved) return JSON.parse(saved);
      if (mob === '9822012345') {
        const legacy = localStorage.getItem('pashu_consultations');
        if (legacy) return JSON.parse(legacy);
      } else {
        return [];
      }
    } catch (e) {}
    return [
      {
        id: 'SLOT-2026-441',
        caseId: 'CASE-2026-901',
        doctorName: 'Dr. S. K. Kulkarni',
        degree: 'M.V.Sc (Epidemiology)',
        clinic: 'Haveli Taluka Veterinary Dispensary, Pune',
        farmerName: 'Anandrao Patil',
        farmerMobile: '9822012345',
        scheduledDate: 'Tomorrow',
        scheduledTime: '11:30 AM',
        mode: 'Live Video Tele-Consultation',
        status: 'CONFIRMED',
        notes: 'Follow-up clinical assessment for bovine vesicular stomatitis / FMD.'
      },
      {
        id: 'SLOT-2026-442',
        caseId: 'CASE-2026-881',
        doctorName: 'Dr. Ramesh Deshmukh',
        degree: 'B.V.Sc & A.H.',
        clinic: 'Baramati Veterinary Hospital, Pune',
        farmerName: 'Anandrao Patil',
        farmerMobile: '9822012345',
        scheduledDate: 'Friday',
        scheduledTime: '03:00 PM',
        mode: 'On-Site Dispensary Visit',
        status: 'SCHEDULED',
        notes: 'Clinical sampling & blood smear review.'
      }
    ];
  });

  const [labReferrals, setLabReferrals] = useState([
    {
      id: 'LAB-REF-401',
      caseId: 'CASE-2026-901',
      farmerName: 'Anandrao Patil',
      sampleType: 'Vesicular fluid swab & epithelial scrapings',
      testRequested: 'FMD Viral Antigen ELISA & RT-PCR Serotyping',
      laboratory: 'State Disease Investigation Section (DIS), Aundh, Pune',
      dateSent: '2026-09-26',
      status: 'UNDER_ANALYSIS',
      priority: 'URGENT',
      notes: 'Cold-chain preserved sample dispatched via authorized courier.'
    },
    {
      id: 'LAB-REF-388',
      caseId: 'CASE-2026-881',
      farmerName: 'Balasaheb Shinde',
      sampleType: 'Whole blood in EDTA + fixed blood smears',
      testRequested: 'Giemsa staining for Blood Protozoa (Theileria / Babesia)',
      laboratory: 'District Veterinary Polyclinic Pathology Unit, Pune',
      dateSent: '2026-09-24',
      status: 'COMPLETED — NEGATIVE',
      priority: 'ROUTINE',
      notes: 'Blood smear examined under 100x oil immersion. No intracellular piroplasms detected.'
    }
  ]);
  const [rxForm, setRxForm] = useState({ caseId: 'CASE-2026-901', farmerMobile: '9822012345', farmerName: 'Anandrao Patil', diagnosis: 'Foot and Mouth Disease (FMD)', medicinesText: '1. Potassium Permanganate (1:1000) oral wash twice daily\n2. Boroglycerine paint for mouth lesions\n3. Meloxicam Oral Suspension 0.5 mg/kg for 3 days', advice: 'Isolate animal immediately. Provide soft green fodder and lukewarm water.' });
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);

  // Dynamic Animals & Symptoms State
  const [animalsList, setAnimalsList] = useState(initialAnimalsList);
  const [symptomsList, setSymptomsList] = useState(initialSymptomsList);

  // Triage Wizard State
  const [triageAnimal, setTriageAnimal] = useState('cow');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['fever', 'salivation']);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [photoDetectionNote, setPhotoDetectionNote] = useState(null);
  const [sickCount, setSickCount] = useState(1);
  const [deadCount, setDeadCount] = useState(0);
  const [durationDays, setDurationDays] = useState(1);
  const [location, setLocation] = useState('Baramati, Pune');
  const [freeTextDescription, setFreeTextDescription] = useState('');
  const [otherPerArea, setOtherPerArea] = useState({});
  const [triageResult, setTriageResult] = useState(() => {
    try {
      const saved = localStorage.getItem('pashu_last_triage_result');
      if (saved) return JSON.parse(saved);
      const sess = getActiveSession();
      const mob = sess?.user?.mobile || farmerUser?.mobile || '9822012345';
      const hist = localStorage.getItem(`pashu_history_${mob}`);
      if (hist) {
        const parsed = JSON.parse(hist);
        if (parsed[0]?.triageData) return parsed[0].triageData;
      }
    } catch (e) {}
    return null;
  });

  // Voice Subsystem State & Web Speech Audio Refs (Task 8)
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micVolumeLevel, setMicVolumeLevel] = useState(0);
  const [micErrorNotice, setMicErrorNotice] = useState(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const micStreamRef = useRef(null);
  const volumeIntervalRef = useRef(null);

  // Helper to stop microphone volume analysis
  const stopVolumeMetering = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setMicVolumeLevel(0);
  };

  // Helper to start real-time microphone volume analysis
  const startVolumeMetering = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      volumeIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const volume = Math.min(100, Math.round((avg / 128) * 100));
        setMicVolumeLevel(volume);
      }, 100);
    } catch (err) {
      console.warn("Audio meter setup notice:", err);
    }
  };

  // Web Speech API STT Toggle across 4 languages
  const handleMicToggle = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      stopVolumeMetering();
      setIsListening(false);
      return;
    }

    setMicErrorNotice(null);
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicErrorNotice(dict.voiceUnsupported || "Speech recognition is not supported in this browser. Please type symptoms or use quick phrases.");
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang === 'mr' ? 'mr-IN' : lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        startVolumeMetering();
      };

      rec.onresult = (event) => {
        let aggregatedText = '';
        for (let i = 0; i < event.results.length; i++) {
          aggregatedText += event.results[i][0].transcript + ' ';
        }
        const cleaned = aggregatedText.trim();
        setVoiceTranscript(cleaned);
        const matched = parseSymptomsFromText(cleaned, symptomsList);
        if (matched.length > 0) {
          setSelectedSymptoms(prev => Array.from(new Set([...prev, ...matched])));
        }
      };

      rec.onerror = (event) => {
        console.warn("Speech recognition error:", event);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setMicErrorNotice(dict.micPermissionDenied || "Microphone access blocked. Please enable mic permissions in your browser bar.");
        } else if (event.error === 'no-speech') {
          // Normal silence, don't crash
        } else {
          setMicErrorNotice(`Speech recognition notice: ${event.error || 'Check microphone'}`);
        }
        stopVolumeMetering();
        setIsListening(false);
      };

      rec.onend = () => {
        stopVolumeMetering();
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setMicErrorNotice(dict.voiceUnsupported || "Unable to start speech recognition.");
      stopVolumeMetering();
      setIsListening(false);
    }
  };

  const handleQuickPhraseSelect = (phrase) => {
    const text = getTrans(phrase, 'text', lang) || phrase.textEn;
    setVoiceTranscript(text);
    if (phrase.syms && phrase.syms.length > 0) {
      setSelectedSymptoms(prev => Array.from(new Set([...prev, ...phrase.syms])));
    }
    // Preview speech audio in selected language
    speakCustomText(text, lang);
  };

  const finishVoiceRecordingAndTriage = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    stopVolumeMetering();
    setIsListening(false);
    setShowVoiceModal(false);
  };

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState(null);
  const [selectedViewingCase, setSelectedViewingCase] = useState(null);

  // Sync session on mount & route change
  useEffect(() => {
    const session = getActiveSession();
    setUserSession(session);
    setActiveRole(session?.role || null);
    try {
      const all = getStoredVets();
      setPendingVets(all.filter(v => v.status === 'pending'));
      setApprovedVets(all.filter(v => v.status === 'approved'));
    } catch (e) {}
  }, [currentPath]);

  // Seamless 1-Click Role Switcher (For Demo Walkthrough & Testing)
  const handleSwitchRole = (newRole) => {
    setGuardWarning('');
    if (newRole === 'vet') {
      const all = getStoredVets();
      const vetObj = all.find(v => v.status === 'approved') || currentVetUser || approvedVets[0];
      createSession(vetObj, 'vet');
      setUserSession(getActiveSession());
      setActiveRole('vet');
      navigateTo('/vet/queue');
    } else if (newRole === 'admin') {
      const adminObj = { name: 'Animal Husbandry Admin', role: 'admin' };
      createSession(adminObj, 'admin');
      setUserSession(getActiveSession());
      setActiveRole('admin');
      navigateTo('/admin/vets');
    } else if (newRole === 'farmer') {
      createSession(farmerUser, 'farmer');
      setUserSession(getActiveSession());
      setActiveRole('farmer');
      navigateTo('/triage');
    } else {
      clearActiveSession();
      setUserSession(null);
      setActiveRole(null);
      navigateTo('/');
    }
  };

  // Route Navigation & Strict Role Route Guards
  const navigateTo = (rawPath) => {
    setGuardWarning('');
    const path = (rawPath || '/').toLowerCase();
    const currentSession = getActiveSession();
    const currentRole = currentSession?.role || null;

    // 1. ADMIN ROUTES GUARD (/admin/* except /admin/login)
    if (path.startsWith('/admin') && path !== '/admin/login') {
      if (currentRole !== 'admin') {
        setGuardWarning('Access restricted: Please log in with administrator credentials.');
        window.history.pushState({}, '', '/admin/login');
        setCurrentPath('/admin/login');
        return;
      }
    }

    // 2. VET ROUTES GUARD (/vet/*, /officer/*, /queue, etc. NOT /vets which is public/farmer locator)
    const isVetRoute = (
      path.startsWith('/vet/') ||
      path === '/vet' ||
      path === '/vet-officer' ||
      path.startsWith('/officer') ||
      path === '/queue' ||
      path === '/referrals' ||
      path === '/profile' ||
      path === '/surveillance' ||
      path.startsWith('/gov/surveillance')
    );
    if (isVetRoute) {
      if (currentRole !== 'vet') {
        setGuardWarning('Access restricted: Please log in as a veterinary officer to access the clinical console.');
        window.history.pushState({}, '', '/login');
        setCurrentPath('/login');
        return;
      }
    }

    // 3. FARMER ROUTES GUARD (/triage, /checker, /results, /history, /farmer/*, etc.)
    const isFarmerRoute = (
      path === '/triage' ||
      path === '/checker' ||
      path === '/symptom-check' ||
      path.startsWith('/triage') ||
      path === '/results' ||
      path === '/diagnostic-results' ||
      path === '/emergency' ||
      path === '/1962' ||
      path === '/emergency-1962' ||
      path === '/history' ||
      path === '/farmer/history' ||
      path === '/my-history' ||
      path.startsWith('/farmer') ||
      path === '/consultations' ||
      path === '/vaccination' ||
      path === '/vaccinations' ||
      path === '/herd'
    );
    if (isFarmerRoute) {
      if (currentRole !== 'farmer') {
        setGuardWarning('Access restricted: Please log in as a farmer to access this feature.');
        window.history.pushState({}, '', '/login');
        setCurrentPath('/login');
        return;
      }
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Browser back/forward listener
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath((window.location.pathname || '/').toLowerCase());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Clear history handler
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your saved triage history and chat logs?")) {
      setTriageHistory([]);
      setChatHistory([]);
      try {
        const mob = farmerUser?.mobile || '9822012345';
        localStorage.removeItem(`pashu_history_${mob}`);
        localStorage.removeItem('pashu_triage_history');
        localStorage.removeItem('pashu_chat_history');
      } catch (e) {
        console.error("Failed to clear localStorage history:", e);
      }
    }
  };

  // Login Success Handler
  const handleLoginSuccess = (session, role) => {
    setUserSession(session);
    setActiveRole(role);
    setGuardWarning('');

    if (role === 'farmer') {
      const farmer = session.user;
      setFarmerUser(farmer);
      try {
        localStorage.setItem('pashu_current_farmer', JSON.stringify(farmer));
        const cleanMob = farmer.mobile;
        const savedHist = localStorage.getItem(`pashu_history_${cleanMob}`);
        setTriageHistory(savedHist ? JSON.parse(savedHist) : []);

        const savedConsult = localStorage.getItem(`pashu_consultations_${cleanMob}`);
        setConsultationSlots(savedConsult ? JSON.parse(savedConsult) : []);

        const savedHerd = localStorage.getItem(`pashu_herd_${cleanMob}`);
        setFarmerHerd(savedHerd ? JSON.parse(savedHerd) : []);
      } catch (e) {
        console.warn('Error loading farmer data:', e);
      }
      navigateTo('/triage');
    } else if (role === 'vet') {
      setCurrentVetUser(session.user);
      navigateTo('/vet/queue');
    } else if (role === 'admin') {
      navigateTo('/admin/vets');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    clearActiveSession();
    setUserSession(null);
    setActiveRole(null);
    setGuardWarning('');
    navigateTo('/');
  };

  const dict = t[lang] || t.en;

  // ROUTE ALIAS RESOLUTION ENGINE (Prevents Blank Screen Render Exceptions)
  const renderCurrentView = () => {
    const p = currentPath;

    // 0a. Public Auth Portal
    if (p === '/login' || p === '/auth') {
      return (
        <AuthPortal
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          dict={dict}
          lang={lang}
          userSession={userSession}
        />
      );
    }

    // 0b. Official Admin Login
    if (p === '/admin/login') {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
        />
      );
    }

    // 0c. Admin Users Registry
    if (p === '/admin/users') {
      if (activeRole !== 'admin') {
        return (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigateTo}
          />
        );
      }
      return (
        <AdminUsersList
          onNavigate={navigateTo}
        />
      );
    }

    // 0d. Admin Approvals
    if (p === '/admin/vets' || p === '/admin' || p === '/admin/approvals') {
      if (activeRole !== 'admin') {
        return (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigateTo}
          />
        );
      }
      return (
        <AdminVetApprovals
          pendingVets={pendingVets}
          setPendingVets={setPendingVets}
          approvedVets={approvedVets}
          setApprovedVets={setApprovedVets}
          dict={dict}
          lang={lang}
        />
      );
    }

    // 0e. Farmer Route Guards Check
    const isFarmerRoute = (
      p === '/triage' ||
      p === '/checker' ||
      p === '/symptom-check' ||
      p.startsWith('/triage') ||
      p === '/results' ||
      p === '/diagnostic-results' ||
      p === '/emergency' ||
      p === '/1962' ||
      p === '/emergency-1962' ||
      p === '/history' ||
      p === '/farmer/history' ||
      p === '/my-history' ||
      p.startsWith('/farmer') ||
      p === '/consultations' ||
      p === '/vaccination' ||
      p === '/vaccinations' ||
      p === '/herd'
    );
    if (isFarmerRoute && activeRole !== 'farmer') {
      return (
        <AuthPortal
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          initialRole="farmer"
          dict={dict}
          lang={lang}
          userSession={userSession}
        />
      );
    }

    // 0f. Vet Route Guards Check (NOT /vets which is public/farmer locator)
    const isVetRoute = (
      p.startsWith('/vet/') ||
      p === '/vet' ||
      p === '/vet-officer' ||
      p.startsWith('/officer') ||
      p === '/queue' ||
      p === '/referrals' ||
      p === '/profile' ||
      p === '/surveillance' ||
      p.startsWith('/gov/surveillance')
    );
    if (isVetRoute && activeRole !== 'vet') {
      return (
        <AuthPortal
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          initialRole="vet"
          dict={dict}
          lang={lang}
          userSession={userSession}
        />
      );
    }

    // 1. Symptom Check
    if (p === '/triage' || p === '/checker' || p === '/symptom-check' || p.startsWith('/triage')) {
      return (
        <SymptomChecker
          dict={dict}
          lang={lang}
          selectedAnimal={triageAnimal}
          setSelectedAnimal={setTriageAnimal}
          selectedSymptoms={selectedSymptoms}
          toggleSymptom={(sId) => {
            setSelectedSymptoms(prev => 
              prev.includes(sId) ? prev.filter(i => i !== sId) : [...prev, sId]
            );
          }}
          setSelectedSymptoms={setSelectedSymptoms}
          animalsList={animalsList}
          symptomsList={symptomsList}
          voiceTranscript={voiceTranscript}
          setVoiceTranscript={setVoiceTranscript}
          parseAndSelectSymptomsFromText={(txt) => {
            const matched = parseSymptomsFromText(txt, symptomsList);
            if (matched.length > 0) {
              setSelectedSymptoms(prev => Array.from(new Set([...prev, ...matched])));
            }
          }}
          openVoiceTriageModal={() => setShowVoiceModal(true)}
          setShowImageModal={setShowCameraModal}
          photoDetectionNote={photoDetectionNote}
          setPhotoDetectionNote={setPhotoDetectionNote}
          sickCount={sickCount}
          setSickCount={setSickCount}
          deadCount={deadCount}
          setDeadCount={setDeadCount}
          durationDays={durationDays}
          setDurationDays={setDurationDays}
          location={location}
          setLocation={setLocation}
          freeTextDescription={freeTextDescription}
          setFreeTextDescription={setFreeTextDescription}
          otherPerArea={otherPerArea}
          setOtherPerArea={setOtherPerArea}
          attachedMedia={attachedMedia}
          setAttachedMedia={setAttachedMedia}
          handleWizardSubmit={() => {
            const diag = calculateTriageDiagnosis({
              animalId: triageAnimal,
              symptomIds: selectedSymptoms,
              customText: freeTextDescription,
              sickCount,
              deadCount,
              durationDays,
              location
            });
            setTriageResult(diag);
            try {
              localStorage.setItem('pashu_last_triage_result', JSON.stringify(diag));
            } catch (e) {}

            // Save to Triage History
            const selectedAnimalObj = animalsList.find(a => a.id === triageAnimal);
            const now = new Date();
            const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isUrgent = diag.riskLevel === 'URGENT' || diag.riskLevel === 'High';
            
            const newHistRecord = {
              id: `CASE-${Date.now().toString().slice(-6)}`,
              timestamp: timeStr,
              animalId: triageAnimal,
              animalName: selectedAnimalObj?.nameEn || triageAnimal,
              animalIcon: selectedAnimalObj?.icon || '🐄',
              symptomsLabels: selectedSymptoms.map(sId => symptomsList.find(s => s.id === sId)?.labelEn || sId),
              symptomIds: selectedSymptoms,
              detectedDiseaseEn: diag.matchedConditions[0]?.nameEn || 'Clinical Assessment',
              confidence: diag.matchedConditions[0]?.confidenceLabel || 'Pattern Alignment',
              riskLevel: diag.riskLevel,
              location: location || 'Baramati, Pune',
              status: isUrgent ? 'EMERGENCY_TRIAGED' : 'IN_REVIEW',
              attachedMedia: attachedMedia,
              photoUrl: attachedMedia?.dataUrl || attachedMedia?.videoUrl,
              videoUrl: attachedMedia?.videoUrl,
              statusTimeline: [
                {
                  step: 1,
                  title: 'Incident Submitted',
                  desc: 'Clinical symptoms and incident details logged by farmer',
                  time: timeStr,
                  status: 'completed'
                },
                {
                  step: 2,
                  title: 'Automated AI Pre-Triage',
                  desc: `${diag.matchedConditions[0]?.nameEn || 'Symptom analysis'} (${diag.riskLevel} Risk)`,
                  time: timeStr,
                  status: 'completed'
                },
                {
                  step: 3,
                  title: 'Transmitted to Local Vet Queue',
                  desc: `Dispatched to ${location || 'Baramati'} Veterinary Officer`,
                  time: timeStr,
                  status: isUrgent ? 'urgent' : 'active'
                },
                {
                  step: 4,
                  title: 'Veterinary Action & Prescriptions',
                  desc: isUrgent ? 'Emergency 1962 alert flagged; awaiting on-site visit' : 'Awaiting officer tele-consultation and e-prescription',
                  time: 'Pending',
                  status: 'pending'
                }
              ],
              incidentDetails: {
                animalId: triageAnimal,
                sickCount,
                deadCount,
                durationDays,
                location: location || 'Baramati, Pune',
                caseId: `CASE-${Date.now().toString().slice(-6)}`
              },
              triageData: diag
            };

            const updatedHistory = [newHistRecord, ...triageHistory];
            setTriageHistory(updatedHistory);
            try {
              const mob = farmerUser?.mobile || '9822012345';
              localStorage.setItem(`pashu_history_${mob}`, JSON.stringify(updatedHistory));
              localStorage.setItem('pashu_triage_history', JSON.stringify(updatedHistory));
              if (!currentNetworkStatus) {
                queueOfflineReport(newHistRecord);
                setOfflineQueueCount(prev => prev + 1);
              }
            } catch (e) {
              console.error("Error saving triage history:", e);
            }

            // Immediately transmit case with attached photo/video into Doctor's Patient Queue
            const newDoctorCase = {
              id: newHistRecord.id,
              farmerName: farmerUser?.name || 'Anandrao Patil',
              farmerMobile: farmerUser?.mobile || '9822012345',
              location: location || 'Baramati, Pune',
              species: selectedAnimalObj?.nameEn || triageAnimal,
              predictedDisease: diag.matchedConditions[0]?.nameEn || 'Clinical Assessment',
              urgency: diag.riskLevel,
              riskLevel: diag.riskLevel,
              is_simulated: false,
              symptoms: selectedSymptoms.map(sId => symptomsList.find(s => s.id === sId)?.labelEn || sId),
              timestamp: now.toISOString(),
              status: 'PENDING',
              attachedMedia: attachedMedia,
              photoUrl: attachedMedia?.dataUrl || attachedMedia?.videoUrl,
              videoUrl: attachedMedia?.videoUrl,
              photoMeta: attachedMedia ? {
                originalSize: attachedMedia.originalSize,
                compressedSize: attachedMedia.compressedSize,
                mimeType: attachedMedia.mimeType
              } : null
            };
            setDoctorQueue(prev => [newDoctorCase, ...prev]);

            navigateTo('/results');
          }}
        />
      );
    }

    // 2. Diagnostic Results
    if (p === '/results' || p === '/diagnostic-results') {
      return (
        <DiagnosticResults
          triageData={triageResult}
          lang={lang}
          dict={dict}
          selectedState={farmerUser?.state || 'Maharashtra'}
          onNavigate={navigateTo}
          onOpenSahayakWithContext={(tData) => {
            const diseaseTitle = tData?.primaryDiagnosis?.nameEn || tData?.diseaseName || 'Foot and Mouth Disease (FMD)';
            setSahayakExternalPrompt(`How to isolate and manage livestock with suspected ${diseaseTitle}?`);
            setSahayakOpen(true);
          }}
          onOpenEmergency1962={(tData) => {
            setEmergencyContextData(tData || triageResult);
            setShowEmergencyModal(true);
          }}
        />
      );
    }

    // 2b. Emergency 1962 Dedicated Console Route (Task 8)
    if (p === '/emergency' || p === '/1962' || p === '/emergency-1962') {
      return (
        <DiagnosticResults
          triageData={triageResult || {
            isUrgent: true,
            riskLevel: 'URGENT',
            diseaseName: 'Foot and Mouth Disease (FMD)',
            species: farmerUser?.primaryLivestock || 'Cow',
            symptoms: ['High fever', 'Mouth vesicles', 'Excessive frothy salivation', 'Severe lameness'],
            matchedSymptoms: ['fever', 'salivation', 'blisters_mouth', 'lameness'],
            message: 'Emergency 1962 condition flagged: acute distress and rapid contagion risk.'
          }}
          lang={lang}
          dict={dict}
          selectedState={farmerUser?.state || 'Maharashtra'}
          onNavigate={navigateTo}
          onOpenSahayakWithContext={(tData) => {
            const diseaseTitle = tData?.primaryDiagnosis?.nameEn || tData?.diseaseName || 'Foot and Mouth Disease (FMD)';
            setSahayakExternalPrompt(`How to isolate and manage livestock with suspected ${diseaseTitle}?`);
            setSahayakOpen(true);
          }}
          onOpenEmergency1962={(tData) => {
            setEmergencyContextData(tData || triageResult);
            setShowEmergencyModal(true);
          }}
        />
      );
    }

    // 3. Nearby Vets / Vet Locator
    if (p === '/vets' || p === '/locator' || p === '/nearby-vets') {
      return (
        <VetLocator
          dict={dict}
          lang={lang}
          onNavigate={navigateTo}
        />
      );
    }

    // 4. Disease Guide
    if (p === '/guide' || p === '/knowledge' || p === '/disease-guide') {
      return (
        <KnowledgeGuide
          dict={dict}
          lang={lang}
        />
      );
    }

    // 5. Outbreak Status / Map / Surveillance
    // 5. Outbreak Status / GIS Quarantine Map
    if (p === '/outbreak' || p === '/map' || p === '/outbreak-status' || p === '/outbreak-map') {
      return (
        <OutbreakDashboard
          selectedState={farmerUser?.state || 'Maharashtra'}
          setSelectedState={(newState) => setFarmerUser(prev => ({ ...prev, state: newState }))}
          dict={dict}
          lang={lang}
        />
      );
    }

    // 5b. Government Surveillance & Epidemic Command Dashboard
    if (p === '/surveillance' || p === '/gov/surveillance' || p === '/vet/surveillance' || p === '/officer/surveillance') {
      return (
        <GovSurveillanceDashboard
          lang={lang}
          selectedState={farmerUser?.state || 'Maharashtra'}
          currentVetUser={currentVetUser}
        />
      );
    }

    // 6. History Logs (Supports /history, /farmer/history, /vet/history)
    if (p === '/history' || p === '/farmer/history' || p === '/vet/history' || p === '/my-history') {
      return (
        <HistoryLog
          triageHistory={triageHistory}
          chatHistory={chatHistory}
          vetConsultHistory={doctorQueue}
          activeRole={activeRole}
          handleClearHistory={handleClearHistory}
          handleReopenReport={(record) => {
            if (record && record.triageData) {
              setTriageResult(record.triageData);
              try {
                localStorage.setItem('pashu_last_triage_result', JSON.stringify(record.triageData));
              } catch (e) {}
              navigateTo('/results');
            }
          }}
          onNavigate={navigateTo}
          lang={lang}
          dict={dict}
        />
      );
    }

    // 7. Farmer Consultations & Prescriptions
    if (p === '/consultations' || p === '/farmer/consultations' || p === '/farmer/prescriptions') {
      return (
        <FarmerConsultations
          consultations={consultationSlots}
          prescriptions={prescriptions}
          onNavigate={navigateTo}
          dict={dict}
          lang={lang}
          farmerUser={farmerUser}
        />
      );
    }

    // 8. Farmer Vaccination & Herd (Task 9)
    if (p === '/vaccination' || p === '/vaccinations' || p === '/farmer/vaccinations' || p === '/herd' || p === '/farmer/herd') {
      return (
        <HerdAndVaccination
          herd={farmerHerd}
          setHerd={setFarmerHerd}
          prescriptions={prescriptions}
          labReferrals={labReferrals}
          setLabReferrals={setLabReferrals}
          vaccinationSchedule={INITIAL_VACCINATION_SCHEDULE}
          onNavigate={navigateTo}
          lang={lang}
          dict={dict}
        />
      );
    }

    // 9. Vet Queue & Officer Dashboard
    if (
      p === '/vet/queue' || 
      p === '/queue' || 
      p === '/vet' || 
      p === '/officer' || 
      p === '/vet-officer' || 
      p === '/vet/dashboard' || 
      p === '/officer/queue'
    ) {
      return (
        <VetOfficerQueue
          doctorQueue={doctorQueue}
          setDoctorQueue={setDoctorQueue}
          navigateTo={navigateTo}
          setSelectedViewingCase={setSelectedViewingCase}
          setRxForm={setRxForm}
          setEmergencyContextData={setEmergencyContextData}
          setShowEmergencyModal={setShowEmergencyModal}
          dict={dict}
          lang={lang}
          currentVetUser={currentVetUser}
        />
      );
    }

    // 10. Vet Video Consultations
    if (
      p === '/vet/consultations' || 
      p === '/vet/video' || 
      p === '/officer/consultations' || 
      p === '/vet/call'
    ) {
      return (
        <LiveVetConsultation
          dict={dict}
          lang={lang}
          doctorQueue={doctorQueue}
          onInspectPhoto={(caseObj) => setSelectedViewingCase(caseObj)}
        />
      );
    }

    // 11. Vet Prescriptions
    if (
      p === '/vet/prescriptions' || 
      p === '/officer/prescriptions' || 
      (p === '/prescriptions' && activeRole !== 'farmer')
    ) {
      return (
        <div className="bg-white rounded-lg border border-[#D1D5DB] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D1D5DB] pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Veterinary Officer Portal</span>
              <h3 className="font-bold text-[#111827] text-lg flex items-center space-x-2 mt-0.5">
                <FileText className="w-5 h-5 text-[#0F2F5C]" />
                <span>Write Official Digital Prescription (Rx)</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('/consultations')}
              className="text-xs font-bold text-[#0F2F5C] hover:underline flex items-center space-x-1"
            >
              <span>View Farmer Prescription Screen ➜</span>
            </button>
          </div>

          {/* Quick Pre-fill from Queue */}
          <div className="bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB] space-y-2">
            <span className="text-xs font-bold text-[#0F2F5C] block">Quick Pre-fill from Pending Patient Queue:</span>
            <div className="flex flex-wrap gap-2">
              {doctorQueue.map(q => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setRxForm({
                      caseId: q.id,
                      farmerName: q.farmerName,
                      farmerMobile: q.farmerMobile,
                      diagnosis: q.predictedDisease,
                      medicinesText: '1. Potassium Permanganate (1:1000) oral wash\n2. Meloxicam Oral Suspension 0.5 mg/kg\n3. Supportive multivitamins',
                      advice: 'Isolate animal immediately. Provide soft green fodder and lukewarm water.'
                    });
                  }}
                  className="bg-white hover:bg-[#0F2F5C] hover:text-white text-[#111827] border border-[#D1D5DB] text-xs px-3 py-1.5 rounded-md font-semibold transition cursor-pointer"
                >
                  {q.id} — {q.farmerName} ({q.species})
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              const newRxId = `RX-2026-${100 + prescriptions.length + 1}`;
              const now = new Date();
              const timeStr = now.toLocaleDateString() + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              const newRx = {
                id: newRxId,
                caseId: rxForm.caseId || 'CASE-2026-901',
                farmerMobile: rxForm.farmerMobile || farmerUser?.mobile || '9822012345',
                farmerName: rxForm.farmerName || farmerUser?.name || 'Anandrao Patil',
                doctorName: currentVetUser?.name || 'Dr. S. K. Kulkarni',
                license: currentVetUser?.licenseNumber || 'VCI-MH-2021-0842',
                qualification: currentVetUser?.degree || 'M.V.Sc (Epidemiology)',
                hospital: `${currentVetUser?.district || 'Pune'} Veterinary Polyclinic`,
                diagnosis: rxForm.diagnosis,
                medicinesText: rxForm.medicinesText,
                advice: rxForm.advice || 'Keep animal in clean shaded stall. Isolate from healthy herd.',
                timestamp: timeStr,
                status: 'ACTIVE'
              };

              const updated = [newRx, ...prescriptions];
              setPrescriptions(updated);
              try {
                localStorage.setItem('pashu_prescriptions', JSON.stringify(updated));
              } catch (err) {}

              // Update case in queue
              setDoctorQueue(prev => prev.map(c => c.id === newRx.caseId ? { ...c, status: 'PRESCRIBED', rxId: newRx.id } : c));
              
              alert(`✅ Prescription ${newRxId} Issued Successfully!\nIt is now immediately available in the Farmer's "My Consultations" portal.`);
              setRxForm({ caseId: '', farmerMobile: '', farmerName: '', diagnosis: '', medicinesText: '', advice: '' });
              navigateTo('/consultations');
            }}
            className="space-y-4 max-w-2xl bg-[#F3F4F6] p-6 rounded-lg border border-[#D1D5DB]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Case Reference ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CASE-2026-901"
                  value={rxForm.caseId}
                  onChange={e => setRxForm({ ...rxForm, caseId: e.target.value })}
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs text-[#111827] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Farmer Name & Mobile</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandrao Patil"
                  value={rxForm.farmerName}
                  onChange={e => setRxForm({ ...rxForm, farmerName: e.target.value })}
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs text-[#111827]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Confirmed Clinical Diagnosis</label>
              <input
                type="text"
                required
                placeholder="e.g. Foot and Mouth Disease (FMD) — Vesicular Phase"
                value={rxForm.diagnosis}
                onChange={e => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs text-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Prescribed Medicines & Dosage Schedule</label>
              <textarea
                rows="4"
                required
                placeholder="Enter itemized medications, dosage, frequency, and duration..."
                value={rxForm.medicinesText}
                onChange={e => setRxForm({ ...rxForm, medicinesText: e.target.value })}
                className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs text-[#111827] font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Doctor's Biosecurity & Dietary Advice</label>
              <textarea
                rows="2"
                placeholder="Instructions on isolation, feeding, disinfection, and quarantine..."
                value={rxForm.advice}
                onChange={e => setRxForm({ ...rxForm, advice: e.target.value })}
                className="w-full bg-white border border-[#D1D5DB] rounded-lg p-2.5 text-xs text-[#111827]"
              />
            </div>

            <button type="submit" className="btn-navy w-full py-3 rounded-lg text-xs font-bold cursor-pointer shadow-sm">
              Issue Official Digital Prescription (Rx)
            </button>
          </form>
        </div>
      );
    }

    // 12. Vet Referrals
    if (p === '/vet/referrals' || p === '/referrals' || p === '/officer/referrals') {
      return (
        <div className="bg-white rounded-lg border border-[#D1D5DB] p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#D1D5DB] pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Diagnostics & Surveillance</span>
              <h3 className="font-bold text-[#111827] text-base flex items-center space-x-2 mt-0.5">
                <FlaskConical className="w-5 h-5 text-[#0F2F5C]" />
                <span>Laboratory Sample Referrals & Diagnostic Tracking</span>
              </h3>
            </div>
            <span className="bg-[#0F2F5C] text-white text-xs font-bold px-3 py-1 rounded-full">
              {labReferrals.length} Active Lab Orders
            </span>
          </div>

          <div className="space-y-4">
            {labReferrals.map(lab => (
              <div key={lab.id} className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0F2F5C] bg-white px-2 py-0.5 rounded border border-[#D1D5DB]">{lab.id}</span>
                    <h4 className="font-bold text-sm text-[#111827] mt-1">{lab.testRequested}</h4>
                    <p className="text-xs text-[#4B5563]">Case Ref: <strong>{lab.caseId}</strong> — Farmer: <strong>{lab.farmerName}</strong></p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${lab.priority === 'URGENT' ? 'bg-[#DC2626] text-white' : 'bg-[#0F2F5C] text-white'}`}>
                    {lab.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-[#D1D5DB] text-xs">
                  <div>Sample: <strong className="text-[#111827]">{lab.sampleType}</strong></div>
                  <div>Lab: <strong className="text-[#0F2F5C]">{lab.laboratory}</strong></div>
                  <div>Status: <strong className={lab.status.includes('COMPLETED') ? 'text-[#15803D]' : 'text-[#E07B00]'}>{lab.status}</strong></div>
                </div>

                {lab.notes && (
                  <p className="text-[11px] text-[#4B5563] italic">"{lab.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 13. Vet Profile
    if (p === '/vet/profile' || p === '/profile' || p === '/officer/profile') {
      const vet = currentVetUser || approvedVets[0] || {
        name: 'Dr. S. K. Kulkarni',
        degree: 'M.V.Sc (Veterinary Epidemiology & Preventive Medicine)',
        specialization: 'Livestock Disease Surveillance & Biosecurity',
        licenseNumber: 'VCI-MH-2021-0842',
        mobile: '9822012345',
        district: 'Pune',
        state: 'Maharashtra',
        status: 'approved'
      };

      return (
        <div className="bg-white rounded-lg border border-[#D1D5DB] p-6 space-y-6 max-w-2xl">
          <div className="border-b border-[#D1D5DB] pb-3">
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Official Directory</span>
            <h3 className="font-bold text-[#111827] text-lg flex items-center space-x-2 mt-0.5">
              <BadgeCheck className="w-5 h-5 text-[#0F2F5C]" />
              <span>Veterinary Officer Professional Profile</span>
            </h3>
          </div>

          <div className="bg-[#F3F4F6] p-5 rounded-lg border border-[#D1D5DB] space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-2">
              <span className="text-[#4B5563]">Doctor Full Name:</span>
              <strong className="text-[#111827] text-sm">{vet.name}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-2">
              <span className="text-[#4B5563]">Academic Qualification:</span>
              <strong className="text-[#111827]">{vet.degree}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-2">
              <span className="text-[#4B5563]">Clinical Specialization:</span>
              <strong className="text-[#111827]">{vet.specialization}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-2">
              <span className="text-[#4B5563]">Veterinary Council Registration:</span>
              <strong className="font-mono text-[#0F2F5C] bg-white px-2 py-0.5 rounded border border-[#D1D5DB]">{vet.licenseNumber}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-2">
              <span className="text-[#4B5563]">Official Mobile Helpline:</span>
              <strong className="text-[#111827] font-mono">{vet.mobile}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-2">
              <span className="text-[#4B5563]">Jurisdiction:</span>
              <strong className="text-[#111827]">{vet.district}, {vet.state}</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#4B5563]">Department Authorization:</span>
              <span className="bg-green-100 text-[#15803D] font-bold px-2 py-0.5 rounded text-[11px]">✓ Verified Government Duty Officer</span>
            </div>
          </div>
        </div>
      );
    }


    // 15. Model Card & Independent Validation Harness (Phase 4)
    if (p === '/model-card' || p === '/model' || p === '/validation' || p === '/harness' || p === '/evaluation') {
      return (
        <ModelCard
          lang={lang}
          onNavigate={navigateTo}
        />
      );
    }

    // Default Fallback: Home Overview (Prevents Blank Screen Exception!)
    return (
      <HomeOverview
        dict={dict}
        lang={lang}
        onNavigate={navigateTo}
        farmerUser={farmerUser}
        setFarmerUser={setFarmerUser}
        approvedVets={approvedVets}
        pendingVets={pendingVets}
        currentVetUser={currentVetUser}
        setCurrentVetUser={setCurrentVetUser}
        onOpenDemo={() => setShowDemoModal(true)}
      />
    );
  };

  return (
    <div className={`min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col font-sans app-text-${textSize}`}>
      <Header
        lang={lang}
        setLang={setLang}
        textSize={textSize}
        setTextSize={setTextSize}
        currentNetworkStatus={currentNetworkStatus}
        forceOfflineDemo={forceOfflineDemo}
        setForceOfflineDemo={setForceOfflineDemo}
        dict={dict}
        userSession={userSession}
        onLogout={handleLogout}
        onNavigate={navigateTo}
        currentPath={currentPath}
        onSwitchRole={handleSwitchRole}
        onOpenDemo={() => setShowDemoModal(true)}
      />

      {/* Location-Based Outbreak & Containment Alerts Banner (Phase 3) */}
      <AlertsBanner
        farmerUser={farmerUser}
        lang={lang}
        dict={dict}
        onNavigate={navigateTo}
      />

      {/* Offline Mode & Auto-Sync Alert Banner (Task 9) */}
      {!currentNetworkStatus && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-xs border-b border-amber-600">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            <span>{dict.offlineBannerText || "⚡ Offline Mode Active: Running from local device cache. Disease Guide, Sahayak KB, and Offline Reporting enabled."}</span>
          </div>
          {offlineQueueCount > 0 && (
            <span className="bg-black text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded font-bold">
              {offlineQueueCount} {dict.reportsInOutbox || "report(s) in offline outbox"}
            </span>
          )}
        </div>
      )}

      {currentNetworkStatus && offlineQueueCount > 0 && (
        <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-xs border-b border-emerald-800 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>{dict.onlineBannerText ? dict.onlineBannerText.replace('{count}', offlineQueueCount) : `Internet Connected: You have ${offlineQueueCount} unsynced report(s) waiting in offline queue.`}</span>
          </div>
          <button
            onClick={handleSyncNow}
            className="bg-white text-emerald-900 hover:bg-emerald-50 px-3.5 py-1 rounded-lg text-xs font-black cursor-pointer shadow-sm transition"
          >
            {dict.syncReportsNow || "⚡ Sync Reports Now"}
          </button>
        </div>
      )}

      {/* Guard Authorization Warning Banner */}
      {guardWarning && (
        <div className="bg-[#DC2626] text-white text-xs font-bold p-3 text-center flex items-center justify-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span>{guardWarning}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {renderCurrentView()}
      </main>

      {/* Global Floating Sahayak Assistant (Task 7) */}
      <FloatingSahayakChat
        dict={dict}
        lang={lang}
        farmerUser={farmerUser}
        isOpen={sahayakOpen}
        setIsOpen={setSahayakOpen}
        externalPrompt={sahayakExternalPrompt}
        onClearExternalPrompt={() => setSahayakExternalPrompt(null)}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
      />

      {/* 1962 Emergency Mode Multi-Path Modal (Task 8) */}
      <Emergency1962Modal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        triageData={emergencyContextData || triageResult}
        farmerUser={farmerUser}
        selectedState={farmerUser?.state || 'Maharashtra'}
        lang={lang}
        dict={dict}
      />

      {/* Voice-Based Symptom Assistant Modal (Task 8) */}
      <VoiceModal
        showVoiceModal={showVoiceModal}
        setShowVoiceModal={setShowVoiceModal}
        isListening={isListening}
        voiceTranscript={voiceTranscript}
        setVoiceTranscript={setVoiceTranscript}
        micVolumeLevel={micVolumeLevel}
        micErrorNotice={micErrorNotice}
        handleMicToggle={handleMicToggle}
        finishVoiceRecordingAndTriage={finishVoiceRecordingAndTriage}
        handleQuickPhraseSelect={handleQuickPhraseSelect}
        selectedSymptoms={selectedSymptoms}
        symptomsList={symptomsList}
        lang={lang}
        dict={dict}
        parseAndSelectSymptomsFromText={(txt) => {
          const matched = parseSymptomsFromText(txt, symptomsList);
          if (matched.length > 0) {
            setSelectedSymptoms(prev => Array.from(new Set([...prev, ...matched])));
          }
        }}
        onLanguageChange={setLang}
      />

      {/* Photo, Camera & Video Lesion Capture Modal (Task 6 & Task 10) */}
      <CameraModal
        showImageModal={showCameraModal}
        setShowImageModal={setShowCameraModal}
        species={triageAnimal}
        reportedSigns={selectedSymptoms}
        onMediaCaptured={(media) => {
          setAttachedMedia(media);
          setPhotoDetectionNote(`Attached clinical photo (${media.compressedSize}, -${media.reductionPercent}%). Transmitted with incident.`);
        }}
        onApplyVisionSuggestions={(analysis) => {
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

          if (newSymptoms.length > 0) {
            setSelectedSymptoms(prev => Array.from(new Set([...prev, ...newSymptoms])));
          }

          const primaryCond = analysis.candidateConditions?.[0]?.name || 'Clinical Lesions';
          setPhotoDetectionNote(`✨ AI Visual Suggestion: Detected indicators for ${primaryCond} (${analysis.disclaimer || 'AI suggestion — a vet will confirm'}). Signs added to report.`);
        }}
        lang={lang}
        dict={dict}
      />

      {/* Clinical Media Inspection Modal for Vet Officer */}
      <ClinicalMediaViewerModal
        isOpen={!!selectedViewingCase}
        onClose={() => setSelectedViewingCase(null)}
        caseData={selectedViewingCase}
        onWritePrescription={(c) => {
          setRxForm({
            caseId: c.id,
            farmerName: c.farmerName,
            farmerMobile: c.farmerMobile,
            diagnosis: c.predictedDisease,
            medicinesText: '1. Potassium Permanganate (1:1000) oral wash\n2. Meloxicam Oral Suspension 0.5 mg/kg\n3. Supportive multivitamins',
            advice: 'Isolate animal immediately. Provide soft green fodder and lukewarm water.'
          });
          navigateTo('/vet/prescriptions');
        }}
        onStartVideoCall={() => navigateTo('/vet/consultations')}
      />

      {/* 1-Click Interactive Demo Walkthrough Modal (Section 14) */}
      <DemoWalkthroughModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        navigateTo={navigateTo}
        onSwitchRole={handleSwitchRole}
        setShowEmergencyModal={setShowEmergencyModal}
        setEmergencyContextData={setEmergencyContextData}
        forceOfflineDemo={forceOfflineDemo}
        setForceOfflineDemo={setForceOfflineDemo}
      />

      <Footer
        dict={dict}
        lang={lang}
        onNavigate={navigateTo}
      />
    </div>
  );
}
