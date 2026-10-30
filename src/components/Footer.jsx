import React from 'react';
import { Lock } from 'lucide-react';

export default function Footer({ dict = {}, onNavigate }) {
  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <footer className="bg-[#0F2F5C] border-t border-[#0B2447] text-gray-300 py-8 px-4 mt-12 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="space-y-1 max-w-2xl">
          <p className="font-bold text-white text-sm">PashuSuraksha — Livestock Health & Response System</p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {dict.sourceNote || "Advisory supports, and does not replace, a qualified veterinarian. Call 1962 for immediate veterinary assistance."}
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2.5">
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 text-slate-300 font-semibold text-xs">
            <span className="hover:text-white cursor-pointer transition" onClick={() => handleNav('/')}>Home</span>
            <span className="hover:text-white cursor-pointer transition" onClick={() => handleNav('/guide')}>Disease Guide</span>
            <span className="hover:text-white cursor-pointer transition" onClick={() => handleNav('/vets')}>Nearby Vets</span>
            <span className="hover:text-white cursor-pointer transition" onClick={() => handleNav('/outbreak')}>Outbreak Map</span>
          </div>

          {/* User Requirement: Explicit small line asking "Are you an admin?" */}
          <div className="text-[11px] text-slate-400 flex items-center justify-center md:justify-end space-x-1.5 pt-1 border-t border-white/10 w-full md:w-auto">
            <span>Are you an admin?</span>
            <button 
              type="button"
              onClick={() => handleNav('/admin/login')}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer inline-flex items-center space-x-1 transition"
              title="Animal Husbandry Department Admin Console"
            >
              <Lock className="w-3 h-3 inline mr-0.5 text-amber-400" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
