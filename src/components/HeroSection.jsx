import React from 'react';
import { ShieldAlert, ArrowRight, Stethoscope, MapPin, PhoneCall } from 'lucide-react';

export default function HeroSection({ dict, onNavigate }) {
  return (
    <div className="bg-[#0F2F5C] text-white rounded-2xl border border-[#0F2F5C] p-6 sm:p-8 md:p-10 space-y-6 shadow-sm">
      <div className="inline-flex items-center space-x-2 bg-[#0B2447] border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-bold">
        <ShieldAlert className="w-4 h-4 text-[#FF9933]" />
        <span>{dict.verifiedBadge || "Livestock Early Warning & Advisory System"}</span>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
          {dict.heroTitle || "Early Disease Detection & Response System"}
        </h2>

        <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-normal">
          {dict.heroSubtitle || "Empowering rural livestock owners with symptom checks, automated assistance, and veterinary locator."}
        </p>
      </div>

      {/* Action Buttons & 1962 Helpline */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('/triage')}
          className="flex items-center space-x-2 bg-white text-[#0F2F5C] hover:bg-slate-100 font-bold px-5 py-3 rounded-xl border border-white/20 transition cursor-pointer text-xs sm:text-sm shadow-sm"
        >
          <Stethoscope className="w-4 h-4 text-[#0F2F5C]" />
          <span>{dict.analyzeBtn || "Check symptoms"}</span>
          <ArrowRight className="w-4 h-4 text-[#0F2F5C]" />
        </button>

        <button
          onClick={() => onNavigate('/vets')}
          className="flex items-center space-x-2 bg-[#0B2447] text-white hover:bg-black font-bold px-5 py-3 rounded-xl border border-white/20 transition cursor-pointer text-xs sm:text-sm"
        >
          <MapPin className="w-4 h-4 text-white" />
          <span>{dict.findNearbyVetBtn || "Find a nearby vet"}</span>
        </button>

        <a
          href="tel:1962"
          className="flex items-center space-x-2 bg-[#DC2626] hover:bg-red-700 text-white font-bold px-4 py-3 rounded-xl transition cursor-pointer text-xs sm:text-sm shadow-sm"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{dict.helpline1962 || "Animal Helpline 1962"}</span>
        </a>
      </div>
    </div>
  );
}
