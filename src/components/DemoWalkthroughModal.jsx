import React, { useState } from 'react';
import { 
  Sparkles, X, ChevronRight, ChevronLeft, Stethoscope, Camera, ShieldAlert, 
  Video, MapPin, WifiOff, FileText, CheckCircle, ArrowRight, Play, ExternalLink,
  Layers, Radio, HelpCircle, Activity, Award
} from 'lucide-react';

export default function DemoWalkthroughModal({
  isOpen,
  onClose,
  navigateTo,
  onSwitchRole,
  setShowEmergencyModal,
  setEmergencyContextData,
  forceOfflineDemo,
  setForceOfflineDemo
}) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const walkthroughSteps = [
    {
      step: 1,
      badge: 'Step 1 of 6: Farmer Intake',
      title: 'Farmer Symptom Intake & 2G/3G Lesion Capture',
      icon: Stethoscope,
      iconColor: 'text-[#0F2F5C]',
      iconBg: 'bg-blue-100',
      summary: 'Empowers rural livestock keepers with voice-guided intake in Marathi, Hindi, Telugu, and English, paired with client-side compressed clinical lesion uploads.',
      highlights: [
        'Voice Speech-to-Text in regional dialects (Web Speech API / Marathi audio)',
        'Clinical camera capture auto-compressed (<200 KB) for remote 2G/3G connectivity',
        'Intuitive multi-symptom selector with species-specific danger indicators'
      ],
      actionLabel: '1-Click Launch Farmer Triage',
      actionHandler: () => {
        if (onSwitchRole) onSwitchRole('farmer');
        navigateTo('/triage');
        onClose();
      }
    },
    {
      step: 2,
      badge: 'Step 2 of 6: AI Pre-Triage',
      title: 'AI Pre-Triage Engine & Ethical Guardrails',
      icon: Activity,
      iconColor: 'text-[#E07B00]',
      iconBg: 'bg-amber-100',
      summary: 'Heuristic & Bayesian clinical ranking aligned with ICAR / DAHD disease taxonomy. Computes differential confidence without prescribing unapproved drugs to farmers.',
      highlights: [
        'Mandatory ethical banner: "AI suggestion — a vet will confirm"',
        'Multi-disease differential analysis (FMD, LSD, Anthrax, PPR, BQ)',
        'Automatic risk stratification (Low / Moderate / High / Urgent 1962)'
      ],
      actionLabel: '1-Click View Diagnostic Results',
      actionHandler: () => {
        navigateTo('/results');
        onClose();
      }
    },
    {
      step: 3,
      badge: 'Step 3 of 6: Emergency Response',
      title: '1962 Mobile Veterinary Unit (MVU) Ambulance Dispatch',
      icon: ShieldAlert,
      iconColor: 'text-[#DC2626]',
      iconBg: 'bg-red-100',
      summary: 'Automated red-alert trigger when hyper-acute danger signs are identified (e.g. sudden death, blood from orifices, severe respiratory distress).',
      highlights: [
        'Live GPS coordinates transmitted to District Emergency Operations',
        'Direct toll-free 1962 call launcher with pre-filled case incident summary',
        'Immediate quarantine containment instructions for the livestock keeper'
      ],
      actionLabel: '1-Click Trigger 1962 Emergency',
      actionHandler: () => {
        if (setEmergencyContextData && setShowEmergencyModal) {
          setEmergencyContextData({
            isUrgent: true,
            riskLevel: 'URGENT',
            diseaseName: 'Foot and Mouth Disease (FMD)',
            species: 'Cattle (Cow)',
            symptoms: ['High fever (>104°F)', 'Drooling stringy saliva', 'Tongue & hoof vesicular blisters'],
            matchedSymptoms: ['severe_distress'],
            message: 'Urgent interactive demonstration case: Anandrao Patil (9822012345), Haveli, Pune.'
          });
          setShowEmergencyModal(true);
        }
        onClose();
      }
    },
    {
      step: 4,
      badge: 'Step 4 of 6: Veterinary Portal',
      title: 'Veterinary Officer Queue, Tele-Consult & E-Prescriptions',
      icon: Video,
      iconColor: 'text-purple-700',
      iconBg: 'bg-purple-100',
      summary: 'Licensed veterinary officers review clinical queue, inspect high-res lesion photos, conduct live video consultations, and issue validated digital prescriptions.',
      highlights: [
        'Patient Queue with status/district/pathology multi-filters and search',
        'Inspect compressed lesion photos at full resolution with zoom lens',
        'Issue tamper-evident e-prescriptions with weight-based dosage guidance',
        'Escalate suspected index cases to District Disease Investigation Section (DIS)'
      ],
      actionLabel: '1-Click Open Vet Patient Queue',
      actionHandler: () => {
        if (onSwitchRole) onSwitchRole('vet');
        navigateTo('/vet/queue');
        onClose();
      }
    },
    {
      step: 5,
      badge: 'Step 5 of 6: Biosecurity Surveillance',
      title: 'Containment Zone Mapping & Vector Forewarning',
      icon: MapPin,
      iconColor: 'text-[#0F2F5C]',
      iconBg: 'bg-blue-100',
      summary: 'Interactive GIS visualization with 5 km Infected Rings, 10 km Surveillance Buffers, ICAR-NIVEDI advisory integration, and meteorological vector forecasts.',
      highlights: [
        'Interactive OpenStreetMap Leaflet layers for active disease epicenters',
        'District & Taluka containment perimeter monitoring with verified lab tags',
        'Monsoon humidity & temperature vector risk index (Culicoides / biting flies)'
      ],
      actionLabel: '1-Click Explore Outbreak Map',
      actionHandler: () => {
        navigateTo('/outbreak');
        onClose();
      }
    },
    {
      step: 6,
      badge: 'Step 6 of 6: Offline Resilience',
      title: 'Offline-First PWA Shell & Background Sync Outbox',
      icon: WifiOff,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      summary: 'Designed for rural connectivity drops. PWA Service Worker caches core assets while clinical reports are queued in IndexedDB and replayed once 2G/3G signal returns.',
      highlights: [
        'Complete offline triage flow with local rule-based inference',
        'IndexedDB Outbox stores photos and case details locally without loss',
        'Automatic background replay and sync when network status changes to online'
      ],
      actionLabel: forceOfflineDemo ? '1-Click Switch Back to Online' : '1-Click Simulate Offline Mode',
      actionHandler: () => {
        if (setForceOfflineDemo) {
          setForceOfflineDemo(!forceOfflineDemo);
        }
        navigateTo('/history');
        onClose();
      }
    }
  ];

  const curr = walkthroughSteps[activeStep];
  const StepIcon = curr.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#D1D5DB] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#0F2F5C] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E07B00] text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base tracking-tight">Interactive Platform Demo & Architecture Walkthrough</h3>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  1-Click Kit
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Experience PashuSuraksha from rural farmer triage to district veterinary escalation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition"
            title="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] px-5 py-3 flex items-center justify-between gap-1 overflow-x-auto">
          {walkthroughSteps.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeStep === idx
                  ? 'bg-[#0F2F5C] text-white shadow-xs'
                  : 'text-[#4B5563] hover:bg-gray-200'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                activeStep === idx ? 'bg-[#E07B00] text-white' : 'bg-gray-300 text-gray-700'
              }`}>
                {s.step}
              </span>
              <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Current Step Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-xl ${curr.iconBg} ${curr.iconColor} flex items-center justify-center shrink-0`}>
              <StepIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#E07B00] uppercase tracking-wider block">
                {curr.badge}
              </span>
              <h4 className="text-lg font-black text-[#111827]">{curr.title}</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">{curr.summary}</p>
            </div>
          </div>

          {/* Key Architecture Highlights */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Core Technical & Clinical Highlights:
            </span>
            <ul className="space-y-1.5">
              {curr.highlights.map((h, i) => (
                <li key={i} className="text-xs text-[#111827] flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 1-Click Interactive Action Button */}
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Live Interactive Trigger</span>
              <p className="text-xs font-semibold text-[#111827]">Instantly simulate this workflow in the application</p>
            </div>
            <button
              type="button"
              onClick={curr.actionHandler}
              className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center space-x-2 shadow-xs transition"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#E07B00]" />
              <span>{curr.actionLabel}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#F9FAFB] border-t border-[#E5E7EB] px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#4B5563] hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-bold text-[#6B7280]">
            Step {activeStep + 1} of {walkthroughSteps.length}
          </span>

          {activeStep < walkthroughSteps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(walkthroughSteps.length - 1, prev + 1))}
              className="flex items-center space-x-1 bg-[#0F2F5C] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0B2447] cursor-pointer transition"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center space-x-1 bg-[#15803D] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-800 cursor-pointer transition"
            >
              <span>Finish Tour</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
