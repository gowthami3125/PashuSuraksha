import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldAlert, Stethoscope, PhoneCall, Download, Printer, 
  MapPin, HelpCircle, MessageSquare, AlertTriangle, CheckCircle, ExternalLink,
  Navigation, Skull, Smartphone, FileText, Volume2, VolumeX, X
} from 'lucide-react';
import { getTrans } from '../data/dictionary';
import { getTop3NearestVets } from '../data/vetDirectory';
import { speakAdvisoryText, speakCustomText, stopAudioPlayback } from '../services/audioSpeaker';

export default function DiagnosticResults({ 
  triageData, 
  lang, 
  dict, 
  selectedState, 
  onNavigate, 
  onOpenSahayakWithContext,
  onOpenEmergency1962
}) {
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [speakingConditionId, setSpeakingConditionId] = useState(null);
  const [voiceNotice, setVoiceNotice] = useState(null);

  // Stop playback when component unmounts or language changes
  useEffect(() => {
    return () => {
      stopAudioPlayback();
    };
  }, [lang]);

  if (!triageData) {
    return (
      <div className="bg-white border border-[#D1D5DB] rounded-lg p-8 text-center space-y-4">
        <Activity className="w-12 h-12 text-[#4B5563] mx-auto opacity-40" />
        <h3 className="text-lg font-bold text-[#111827]">{dict.resultsTitle || "Assessment & General Guidance"}</h3>
        <p className="text-xs text-[#4B5563]">Please complete the Symptom Check wizard to view your clinical evaluation.</p>
        <button 
          onClick={() => onNavigate('/triage')}
          className="btn-navy px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer inline-flex items-center space-x-2"
        >
          <Stethoscope className="w-4 h-4" />
          <span>{dict.analyzeBtn || "Start Symptom Check"}</span>
        </button>
      </div>
    );
  }

  const {
    isPetNotice,
    petType,
    riskLevel,
    riskBadge,
    title,
    summary,
    matchedConditions = [],
    followUpQuestions = [],
    recommendedActions = [],
    incidentDetails = {}
  } = triageData;

  const nearestVets = getTop3NearestVets(selectedState || 'Maharashtra');

  // Render Risk Badge according to Section 9 Dark Blue & White specs
  const renderRiskBadge = () => {
    if (riskLevel === 'URGENT' || riskLevel === 'High') {
      return (
        <span className="bg-[#DC2626] text-white px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center space-x-2 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-white flex-shrink-0" />
          <span>{riskBadge || 'URGENT EMERGENCY'}</span>
        </span>
      );
    } else if (riskLevel === 'Medium') {
      return (
        <span className="bg-[#D97706] text-[#111827] px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center space-x-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-[#111827] flex-shrink-0" />
          <span>{riskBadge || 'Medium Risk'}</span>
        </span>
      );
    } else {
      return (
        <span className="bg-[#15803D] text-white px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center space-x-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
          <span>{riskBadge || 'Low Risk'}</span>
        </span>
      );
    }
  };

  const handleTogglePlayMainAdvisory = () => {
    if (isSpeakingAudio && !speakingConditionId) {
      stopAudioPlayback(setIsSpeakingAudio);
      return;
    }

    setSpeakingConditionId(null);
    const firstCond = matchedConditions[0];
    if (firstCond) {
      speakAdvisoryText(firstCond, lang, setIsSpeakingAudio, (status) => {
        if (status && status.hasNativeVoice === false) {
          setVoiceNotice(dict.nativeVoiceMissing || "Regional voice pack is not installed on this OS; using system fallback voice.");
        }
      });
    } else if (summary || title) {
      speakCustomText(`${title || ''}. ${summary || ''}`, lang, setIsSpeakingAudio, (status) => {
        if (status && status.hasNativeVoice === false) {
          setVoiceNotice(dict.nativeVoiceMissing || "Regional voice pack is not installed on this OS; using system fallback voice.");
        }
      });
    }
  };

  const handleSpeakCondition = (condition, cIdx) => {
    const targetId = condition.id || cIdx;
    if (speakingConditionId === targetId) {
      stopAudioPlayback(setIsSpeakingAudio);
      setSpeakingConditionId(null);
      return;
    }

    setSpeakingConditionId(targetId);
    speakAdvisoryText(condition, lang, (speaking) => {
      setIsSpeakingAudio(speaking);
      if (!speaking) setSpeakingConditionId(null);
    }, (status) => {
      if (status && status.hasNativeVoice === false) {
        setVoiceNotice(dict.nativeVoiceMissing || "Regional voice pack is not installed on this OS; using system fallback voice.");
      }
    });
  };

  const handleDownloadPdf = () => {
    const pdfUrl = `http://localhost:5000/api/pdf/report`;
    const payload = {
      animalId: incidentDetails.animalId,
      riskLevel,
      matchedConditions,
      incidentDetails,
      timestamp: new Date().toLocaleString()
    };

    fetch(pdfUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(html => {
      // 1. Trigger genuine file download
      try {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `PashuSuraksha_Triage_Report_${incidentDetails?.animalId || 'Livestock'}_${Date.now()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } catch (e) {
        console.warn('File download triggered via fallback', e);
      }

      // 2. Open print view window
      try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => printWindow.print(), 500);
        }
      } catch (e) {
        window.print();
      }
    })
    .catch(() => {
      // Offline fallback: print current page
      window.print();
    });
  };

  return (
    <div className="space-y-6">
      {/* PET NOTICE BANNER IF PET ANIMAL SELECTED */}
      {isPetNotice && (
        <div className="bg-white border-2 border-[#D97706] rounded-lg p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-[#D97706]" />
            <h3 className="text-base font-bold text-[#111827]">{title}</h3>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed font-medium">{triageData.message}</p>
        </div>
      )}

      {/* EMERGENCY 1962 MULTI-PATH ESCALATION CONSOLE (TASK 8) */}
      {(riskLevel === 'URGENT' || riskLevel === 'High' || triageData.isUrgent) && (
        <div className="bg-[#B91C1C] text-white p-5 rounded-xl space-y-4 shadow-lg border-2 border-red-400">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <ShieldAlert className="w-7 h-7 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                    🚨 1962 Emergency Escalation Required
                  </h4>
                  <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    {riskLevel}
                  </span>
                </div>
                <p className="text-xs text-red-100 mt-0.5">
                  Severe danger signs detected. One-tap escalation available across all three emergency paths:
                </p>
              </div>
            </div>

            {onOpenEmergency1962 && (
              <button
                onClick={() => onOpenEmergency1962(triageData)}
                className="bg-white hover:bg-gray-100 text-[#B91C1C] font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shrink-0"
              >
                <span>⚡ Open Emergency Console</span>
              </button>
            )}
          </div>

          {/* Three Instant One-Tap Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-red-700/60">
            {/* Path 1: Direct Call */}
            <a
              href="tel:1962"
              className="bg-red-800 hover:bg-red-900 border border-red-400/40 p-3 rounded-xl flex items-center space-x-3 transition cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <PhoneCall className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-red-200 font-bold uppercase tracking-wider">Path 1: Voice</span>
                <span className="block text-xs font-bold text-white">Call 1962 Helpline</span>
              </div>
            </a>

            {/* Path 2: SMS Fallback */}
            <a
              href={`sms:1962?body=${encodeURIComponent(
                `1962 EMERGENCY DISPATCH\nCASE: ${triageData.diseaseName || 'Suspected Contagious Epidemic'}\nSPECIES: ${triageData.species || 'Cattle'}\nLOC: ${selectedState}\nSTATUS: URGENT MVU AMBULANCE REQUESTED`
              )}`}
              className="bg-red-800 hover:bg-red-900 border border-red-400/40 p-3 rounded-xl flex items-center space-x-3 transition cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-red-200 font-bold uppercase tracking-wider">Path 2: 2G / Weak Signal</span>
                <span className="block text-xs font-bold text-white">Trigger 1962 SMS</span>
              </div>
            </a>

            {/* Path 3: Offline Dispatch Note */}
            <button
              onClick={() => {
                if (onOpenEmergency1962) {
                  onOpenEmergency1962(triageData);
                } else {
                  alert("Generating 1962 Offline Dispatch Note...");
                }
              }}
              className="bg-red-800 hover:bg-red-900 border border-red-400/40 p-3 rounded-xl flex items-center space-x-3 transition cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="block text-[10px] text-red-200 font-bold uppercase tracking-wider">Path 3: Zero Network</span>
                <span className="block text-xs font-bold text-white">Offline Dispatch Slip</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ANTHRAX CRITICAL BIOSECURITY NOTICE */}
      {triageData.anthraxWarning && (
        <div className="bg-[#7F1D1D] border-2 border-red-500 text-white p-5 rounded-lg space-y-3 shadow-md">
          <div className="flex items-center space-x-3">
            <Skull className="w-8 h-8 text-amber-300 flex-shrink-0 animate-pulse" />
            <div>
              <h4 className="font-bold text-sm tracking-wide text-amber-200 uppercase">
                Critical Bio-Security Order: Suspected Anthrax Event
              </h4>
              <p className="text-xs text-white/95 mt-1 font-semibold leading-relaxed">
                {triageData.anthraxWarning}
              </p>
            </div>
          </div>
          <div className="bg-black/30 p-3 rounded text-[11px] text-amber-100 border border-white/20 font-mono">
            ⚠️ STRICT LEGAL PROTOCOL: Post-mortem examination is strictly banned. Do not cut, skin, or handle carcass without full hazmat gear. Deep burial under 6-8 ft with quicklime required.
          </div>
        </div>
      )}

      {/* MAIN RESULT CONTAINER */}
      <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 md:p-8 space-y-6">
        
        {/* HEADER BAR WITH RISK BADGE AND PRINT/DOWNLOAD BUTTONS */}
        <div className="flex flex-wrap justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest">
                Clinical Triage Evaluation Report
              </span>
              {renderRiskBadge()}
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mt-1.5">
              {summary ? title : (getTrans(matchedConditions[0], 'name', lang) || matchedConditions[0]?.nameEn || 'Symptom Triage Diagnosis')}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTogglePlayMainAdvisory}
              className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer shadow-xs ${
                isSpeakingAudio && !speakingConditionId
                  ? 'bg-[#DC2626] text-white hover:bg-red-700 animate-pulse'
                  : 'bg-[#E07B00] hover:bg-[#C26A00] text-white'
              }`}
              title="Listen to advisory guidance aloud in your selected language"
            >
              {isSpeakingAudio && !speakingConditionId ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeakingAudio && !speakingConditionId ? (dict.stopAudioPlayback || "Stop Audio") : (dict.readAloudAdvisory || "🔊 Listen Advisory (TTS)")}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1.5 bg-[#0F2F5C] hover:bg-[#0B2447] text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{dict.printReport || "Download PDF Report"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 bg-white hover:bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB] text-xs font-bold px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Voice Notice Alert */}
        {voiceNotice && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs px-3.5 py-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{voiceNotice}</span>
            </div>
            <button onClick={() => setVoiceNotice(null)} className="text-amber-700 hover:text-amber-950 p-1 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* SUMMARY NOTE IF FEVER OR NON-SPECIFIC */}
        {summary && (
          <div className="bg-[#F3F4F6] border border-[#D1D5DB] p-4 rounded-lg text-xs text-[#111827] space-y-2">
            <span className="font-bold block text-[#0F2F5C]">Clinical Observation Note:</span>
            <p className="leading-relaxed text-[#4B5563]">{summary}</p>
          </div>
        )}

        {/* POSSIBLE CONDITIONS & MATCHED SYMPTOMS REASONS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
            {dict.matchedDiseases || "Possible Clinical Conditions"} ({matchedConditions.length})
          </h3>

          <div className="space-y-4">
            {matchedConditions.map((condition, idx) => (
              <div 
                key={condition.id || idx} 
                className={`p-5 rounded-lg border space-y-4 ${idx === 0 ? 'bg-white border-2 border-[#0F2F5C]' : 'bg-[#F3F4F6] border-[#D1D5DB]'}`}
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest">
                        {condition.categoryEn || 'Livestock Health'}
                      </span>
                      <span className="text-[10px] font-bold bg-[#F3F4F6] text-[#4B5563] px-2 py-0.5 rounded border border-[#D1D5DB]">
                        {condition.confidenceLabel || 'Pattern Alignment'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-[#111827] mt-1">{getTrans(condition, 'name', lang) || condition.nameEn}</h4>
                  </div>

                  <button
                    onClick={() => handleSpeakCondition(condition, idx)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer shadow-xs ${
                      speakingConditionId === (condition.id || idx)
                        ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                        : 'bg-white hover:bg-gray-100 text-[#0F2F5C] border-gray-300'
                    }`}
                    title="Listen to condition prevention advisory"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speakingConditionId === (condition.id || idx) ? (dict.stopAudio || "Stop Audio") : (dict.readAloud || "Listen Audio")}</span>
                  </button>
                </div>

                {/* EXPLICIT REASON: WHICH SYMPTOMS MATCHED */}
                <div className="bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#0F2F5C] uppercase tracking-wider block">
                    Diagnostic Matching Reasons (Symptoms Matched)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {condition.matchedSymptomsNames && condition.matchedSymptomsNames.length > 0 ? (
                      condition.matchedSymptomsNames.map((s, sIdx) => (
                        <span key={sIdx} className="bg-white text-[#111827] text-xs font-bold px-2.5 py-1 rounded border border-[#D1D5DB]">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#4B5563] italic">Matched based on initial clinical parameters</span>
                    )}
                  </div>
                </div>

                {/* WHAT TO DO NOW — PREVENTATIVE & CONTAINMENT ADVICE (NO DRUG DOSAGES) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-lg border border-[#D1D5DB] space-y-2">
                    <h5 className="font-bold text-[#111827] flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-[#0F2F5C]" />
                      <span>{dict.preventionLabel || "Immediate Isolation & Bio-Security"}</span>
                    </h5>
                    <p className="text-[#4B5563] whitespace-pre-line leading-relaxed font-medium">
                      {getTrans(condition, 'prevention', lang) || condition.preventionEn || '• Separate sick animal immediately.\n• Disinfect stall area with lime powder solution.'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#D1D5DB] space-y-2">
                    <h5 className="font-bold text-[#111827] flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-[#0F2F5C]" />
                      <span>{dict.treatmentLabel || "Supportive Care Guidance"}</span>
                    </h5>
                    <p className="text-[#4B5563] whitespace-pre-line leading-relaxed font-medium">
                      {getTrans(condition, 'treatment', lang) || condition.treatmentEn || '• Offer clean drinking water and fresh green fodder.\n• Avoid unprescribed antibiotic administration.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOLLOW-UP CLARIFYING QUESTIONS WHEN DATA IS NON-SPECIFIC */}
        {followUpQuestions.length > 0 && (
          <div className="bg-[#F3F4F6] border border-[#D1D5DB] p-5 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#0F2F5C]" />
              <span>Follow-Up Observation Questions (For Vet Officer Review)</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#111827]">
              {followUpQuestions.map((q, qIdx) => (
                <li key={qIdx} className="flex items-start space-x-2">
                  <span className="font-bold text-[#0F2F5C]">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* WHAT TO DO NOW — RECOMMENDED STEP-BY-STEP ACTIONS */}
        <div className="bg-white border border-[#D1D5DB] p-5 rounded-lg space-y-3">
          <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
            {dict.whatToDoNow || 'Recommended Action Plan ("What To Do Now")'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {recommendedActions.map((action, aIdx) => (
              <div key={aIdx} className="flex items-start space-x-2 bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB]">
                <span className="font-bold text-[#0F2F5C]">{aIdx + 1}.</span>
                <span className="font-medium text-[#111827]">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP 3 NEAREST RECOMMENDED VETERINARIANS */}
        <div className="space-y-4 pt-4 border-t border-[#D1D5DB]">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#0F2F5C]" />
              <span>{dict.specialtyLabel || "Top 3 Nearest Recommended Veterinary Centers"}</span>
            </h3>
            <button
              onClick={() => onNavigate('/vets')}
              className="text-xs font-bold text-[#0F2F5C] hover:underline flex items-center space-x-1"
            >
              <span>{dict.navVets || "View Full Directory"}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearestVets.map(v => (
              <div key={v.id} className="bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB] space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#111827] text-xs">{v.nameEn}</span>
                    <span className="bg-white border border-[#D1D5DB] text-[#0F2F5C] text-[10px] font-bold px-2 py-0.5 rounded">
                      {v.distanceKm || '5 km'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] mt-1">{v.addressEn}</p>
                </div>

                <div className="pt-2 border-t border-[#D1D5DB] flex flex-wrap items-center justify-between gap-1.5">
                  <span className="font-bold text-[#0F2F5C] text-[11px]">{v.phone}</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={(v.lat && v.lng) ? `https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.nameEn + ' ' + (v.addressEn || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-[#F3F4F6] text-[#0F2F5C] border border-[#0F2F5C] text-[10px] font-bold px-2 py-1 rounded flex items-center space-x-1 transition cursor-pointer"
                      title="Get directions in Google Maps"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>{dict.getDirectionsBtn || "Directions"}</span>
                    </a>
                    <a
                      href={`tel:${v.phone}`}
                      className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white text-[10px] font-bold px-2.5 py-1 rounded flex items-center space-x-1 transition cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{dict.dispatchCallBtn || "Call"}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION BUTTON BAR */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-[#D1D5DB]">
          <button 
            onClick={() => onNavigate('/farmer/consultations')}
            className="flex-1 min-w-[200px] btn-navy py-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            <span>{dict.requestVetConsult || "Book Vet Tele-Consultation"}</span>
          </button>

          <button 
            onClick={() => onOpenSahayakWithContext(triageData)}
            className="flex-1 min-w-[200px] bg-[#0F766E] hover:bg-[#115E59] text-white py-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{dict.askSahayakBtn || "Ask Sahayak About This Result"}</span>
          </button>
        </div>

        {/* MANDATORY FOOTER DISCLAIMER PER SECTION 0 */}
        <p className="text-[10px] text-[#4B5563] text-center pt-2 italic">
          {dict.sourceNote || "Disclaimer: Triage results are generated by PashuSuraksha AI clinical guidance models. This advice supports, and does not replace, a certified veterinarian."}
        </p>

      </div>
    </div>
  );
}
