import React from 'react';
import { 
  ShieldAlert, ArrowRight, MapPin, User, Stethoscope, AlertCircle, 
  PhoneCall, Sparkles, Play, CheckCircle, Activity, WifiOff, FileText, 
  Clock, HeartHandshake, Phone
} from 'lucide-react';
import HeroSection from './HeroSection';

export default function HomeOverview({ 
  dict, 
  lang,
  onNavigate, 
  onOpenDemo
}) {
  return (
    <div className="space-y-10">
      {/* 1. HERO BANNER SECTION */}
      <HeroSection 
        dict={dict} 
        onNavigate={onNavigate}
      />

      {/* 2. INTERACTIVE DEMO WALKTHROUGH BANNER */}
      <div className="bg-gradient-to-r from-[#0F2F5C] via-[#0B2447] to-[#0F2F5C] text-white rounded-2xl p-6 border border-amber-400/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E07B00] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-black text-white">Interactive 1-Click Platform Demo Kit</h4>
              <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Guided Tour
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Experience the complete clinical cycle: voice symptom intake, AI differential pre-triage, 1962 emergency ambulance dispatch, duty vet review & offline PWA sync.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenDemo}
          className="bg-[#E07B00] hover:bg-[#c96e00] text-white font-black px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition cursor-pointer whitespace-nowrap shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Interactive Tour</span>
        </button>
      </div>

      {/* 3. CORE PLATFORM CAPABILITIES & FEATURES */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold text-[#0F2F5C] uppercase tracking-widest">
            {dict.platformFeatures || "Portal Capabilities"}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
            Comprehensive Livestock Healthcare & Surveillance Network
          </h3>
          <p className="text-xs text-[#4B5563]">
            Bridging rural livestock keepers with government veterinary polyclinics and rapid emergency units.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {/* Feature 1 */}
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#0F2F5C] transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0F2F5C] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111827]">AI Clinical Pre-Triage</h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Heuristic and differential symptom assessment for Foot & Mouth Disease, Lumpy Skin Disease, Anthrax, and PPR, transparently labeled with ethical vet confirmation safeguards.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#0F2F5C] transition">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111827]">1962 Emergency Ambulance</h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Automated danger-flag triggers instantly transmit GPS coordinates to District Mobile Veterinary Units (MVUs) for hyper-acute incidents and suspected outbreaks.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#0F2F5C] transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Verified Vet Tele-Consultations</h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Direct video consultations with verified VCI-registered veterinary officers, tamper-evident digital prescriptions, and laboratory specimen referrals.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#0F2F5C] transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#E07B00] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Containment Ring GIS Mapping</h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Automated 5 km Infected Zone and 10 km Surveillance Buffer perimeters, integrated with humidity and temperature meteorological vector forewarning.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#0F2F5C] transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803D] flex items-center justify-center font-bold">
              <WifiOff className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Offline-First Resilience</h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Service Worker offline shell with IndexedDB incident queue allows farmers to triage and log signs without connectivity, syncing automatically once signal resumes.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#0F2F5C] transition">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#111827] flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Multilingual Vernacular Voice</h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Full accessibility in English, Marathi, Hindi, and Telugu with local speech-to-text input and persistent A- / A / A+ font size scaling without text loss.
            </p>
          </div>
        </div>
      </div>

      {/* 4. HOW IT WORKS SECTION (3 Simple Steps) */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold text-[#0F2F5C] uppercase tracking-widest">{dict.howItWorksProcess || "3-Step Process"}</span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">{dict.howItWorksTitle || "How PashuSuraksha Works in 3 Simple Steps"}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5 space-y-3 shadow-xs">
            <div className="relative h-36 rounded-xl overflow-hidden bg-[#F3F4F6] border border-[#D1D5DB] flex items-center justify-center">
              <div className="text-center p-4 space-y-1">
                <span className="text-3xl">🐄</span>
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{dict.step ? `${dict.step} 1` : "Step 1"}</p>
                <p className="text-[10px] text-gray-500">{dict.step1PhotoPlaceholder || "Livestock Species & Signs Selection"}</p>
              </div>
              <span className="absolute top-3 left-3 bg-[#0F2F5C] text-white font-extrabold text-xs w-7 h-7 rounded-full flex items-center justify-center">
                1
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">{dict.step1Title || "1. Check Animal Symptoms"}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {dict.step1Desc || "Select your animal and describe symptoms by tapping or speaking in your preferred language."}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5 space-y-3 shadow-xs">
            <div className="relative h-36 rounded-xl overflow-hidden bg-[#F3F4F6] border border-[#D1D5DB] flex items-center justify-center">
              <div className="text-center p-4 space-y-1">
                <span className="text-3xl">📋</span>
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{dict.step ? `${dict.step} 2` : "Step 2"}</p>
                <p className="text-[10px] text-gray-500">{dict.step2PhotoPlaceholder || "Precautionary Containment Guidance"}</p>
              </div>
              <span className="absolute top-3 left-3 bg-[#0F2F5C] text-white font-extrabold text-xs w-7 h-7 rounded-full flex items-center justify-center">
                2
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">{dict.step2Title || "2. Receive Precautionary Guidance"}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {dict.step2Desc || "Get instant general containment guidelines and immediate care steps for your herd."}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-5 space-y-3 shadow-xs">
            <div className="relative h-36 rounded-xl overflow-hidden bg-[#F3F4F6] border border-[#D1D5DB] flex items-center justify-center">
              <div className="text-center p-4 space-y-1">
                <span className="text-3xl">👨‍⚕️</span>
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{dict.step ? `${dict.step} 3` : "Step 3"}</p>
                <p className="text-[10px] text-gray-500">{dict.step3PhotoPlaceholder || "Veterinary Officer & Hospital Locator"}</p>
              </div>
              <span className="absolute top-3 left-3 bg-[#0F2F5C] text-white font-extrabold text-xs w-7 h-7 rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">{dict.step3Title || "3. Connect with Nearby Vet"}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {dict.step3Desc || "Find nearby veterinary hospitals or request a consultation from a licensed officer."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 1962 EMERGENCY HELPLINE CALLOUT BANNER */}
      <div className="bg-red-50 border-2 border-[#DC2626]/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <span className="bg-[#DC2626] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              24x7 Government Helpline
            </span>
            <h4 className="text-xl font-black text-[#111827]">
              National Animal Emergency Response: Dial 1962
            </h4>
            <p className="text-xs text-[#4B5563] max-w-xl">
              Free toll-free emergency call service for acute livestock distress, sudden high mortality, or suspected contagious outbreaks. Connects to the nearest Mobile Veterinary Unit (MVU).
            </p>
          </div>
        </div>

        <a 
          href="tel:1962"
          className="bg-[#DC2626] hover:bg-red-700 text-white font-black px-6 py-3.5 rounded-xl text-sm flex items-center space-x-2 transition cursor-pointer shadow-md whitespace-nowrap shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Call 1962 Toll-Free</span>
        </a>
      </div>

      {/* 6. LIVESTOCK CENSUS NUMBERS BAND */}
      <div className="bg-[#0F2F5C] text-white rounded-2xl p-6 sm:p-8 space-y-4 border border-[#0F2F5C] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/20 pb-3 gap-2">
          <div>
            <h3 className="text-base font-bold text-white">{dict.censusBannerTitle || "Livestock Census & Population Coverage"}</h3>
            <p className="text-xs text-gray-200">{dict.censusBannerSubtitle || "Official figures from 20th Livestock Census (data.gov.in)"}</p>
          </div>
          <span className="bg-[#0B2447] text-gray-200 text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
            {dict.censusSource || "Source: Ministry of Fisheries, Animal Husbandry & Dairying"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#0B2447] p-4 rounded-xl border border-white/10 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">3.30 Cr</span>
            <p className="text-[11px] text-gray-300 font-semibold">{dict.censusCattleMH || "Cattle & Buffaloes (MH)"}</p>
          </div>

          <div className="bg-[#0B2447] p-4 rounded-xl border border-white/10 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">1.06 Cr</span>
            <p className="text-[11px] text-gray-300 font-semibold">{dict.censusSheepMH || "Sheep & Goats (MH)"}</p>
          </div>

          <div className="bg-[#0B2447] p-4 rounded-xl border border-white/10 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">4.60 Cr</span>
            <p className="text-[11px] text-gray-300 font-semibold">{dict.censusCattleAP || "Cattle & Buffaloes (AP)"}</p>
          </div>

          <div className="bg-[#0B2447] p-4 rounded-xl border border-white/10 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">1962</span>
            <p className="text-[11px] text-gray-300 font-semibold">{dict.censusHelpline || "Animal Helpline"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
