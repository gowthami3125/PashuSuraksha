import React, { useState } from 'react';
import { FileText, Search, ShieldAlert, HelpCircle, WifiOff } from 'lucide-react';
import { diseasesDB } from '../data/diseasesData';
import { getTrans } from '../data/dictionary';
import { CACHED_OFFLINE_FAQS } from '../services/offlineSyncService';

export default function KnowledgeGuide({ searchQuery, setSearchQuery, lang = 'mr', dict = {} }) {
  const [internalQuery, setInternalQuery] = useState('');
  const activeQuery = (typeof searchQuery === 'string' ? searchQuery : internalQuery).toLowerCase().trim();
  const handleQueryChange = (val) => {
    if (typeof setSearchQuery === 'function') {
      setSearchQuery(val);
    }
    setInternalQuery(val);
  };

  const filteredDiseases = diseasesDB.filter(d => {
    if (!activeQuery) return true;
    const nameEn = (d.nameEn || '').toLowerCase();
    const nameHi = (d.nameHi || '').toLowerCase();
    const nameTe = (d.nameTe || '').toLowerCase();
    const nameMr = (d.nameMr || '').toLowerCase();
    const catEn = (d.categoryEn || '').toLowerCase();
    return nameEn.includes(activeQuery) || nameHi.includes(activeQuery) || nameTe.includes(activeQuery) || nameMr.includes(activeQuery) || catEn.includes(activeQuery);
  });

  const renderRiskBadge = (riskText) => {
    const text = riskText || '';
    const isHigh = text.includes('High') || text.includes('गंभीर') || text.includes('उच्च') || text.includes('తీవ్ర');
    const isMedium = text.includes('Medium') || text.includes('मध्यम') || text.includes('మధ్యస్థ');

    if (isHigh) {
      return (
        <span className="bg-[#DC2626] text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3 text-white" />
          <span>{text}</span>
        </span>
      );
    } else if (isMedium) {
      return (
        <span className="bg-[#D97706] text-[#111827] px-2.5 py-1 rounded text-[10px] font-bold flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3 text-[#111827]" />
          <span>{text}</span>
        </span>
      );
    } else {
      return (
        <span className="bg-[#15803D] text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3 text-white" />
          <span>{text || "Low Risk"}</span>
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="gov-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#111827] flex items-center space-x-3">
              <FileText className="w-7 h-7 text-[#0F2F5C]" />
              <span>{dict.knowledgeTitle}</span>
            </h2>
            <p className="text-xs text-[#4B5563] mt-1">Clinical guide and reference for major livestock diseases.</p>
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#4B5563]" />
            <input 
              type="text"
              placeholder={dict?.searchPlaceholder || 'Search disease (e.g. FMD, Anthrax)...'}
              value={typeof searchQuery === 'string' ? searchQuery : internalQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDiseases.map(disease => {
            const dName = getTrans(disease, 'name', lang);
            const dCategory = getTrans(disease, 'category', lang);
            const dRisk = getTrans(disease, 'risk', lang);
            const dPrevention = getTrans(disease, 'prevention', lang);
            const dTreatment = getTrans(disease, 'treatment', lang);

            return (
              <div key={disease.id} className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-6 space-y-4 hover:border-[#0F2F5C] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest">{dCategory}</span>
                    <h3 className="text-lg font-bold text-[#111827] mt-0.5">{dName}</h3>
                  </div>
                  {renderRiskBadge(dRisk)}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-white p-3.5 rounded-lg border border-[#D1D5DB]">
                    <h5 className="font-bold text-[#111827] mb-1">{dict.preventionLabel}</h5>
                    <p className="text-[#4B5563] whitespace-pre-line leading-relaxed font-medium">{dPrevention}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-[#D1D5DB]">
                    <h5 className="font-bold text-[#111827] mb-1">{dict.treatmentLabel}</h5>
                    <p className="text-[#4B5563] leading-relaxed font-medium">{dTreatment}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CACHED OFFLINE FAQ & ADVISORY (TASK 9) */}
        <div className="pt-6 border-t border-[#D1D5DB] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-[#0F2F5C]" />
                <span>Cached Offline Emergency FAQs</span>
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Always available in your phone's memory even when cellular data or Wi-Fi is completely disconnected.
              </p>
            </div>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
              <WifiOff className="w-3 h-3 text-amber-800" />
              <span>100% Offline Cached</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CACHED_OFFLINE_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-[#D1D5DB] rounded-lg p-4 space-y-2 shadow-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-[#111827] leading-snug">{faq.q}</h4>
                  <span className="bg-[#0F2F5C] text-white text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ml-2">
                    {faq.category}
                  </span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
