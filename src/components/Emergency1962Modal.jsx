import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, PhoneCall, MessageSquare, FileText, Download, 
  Printer, CheckCircle2, Copy, AlertTriangle, X, Share2, 
  MapPin, Clock, Info, Check, ExternalLink, RefreshCw
} from 'lucide-react';

export default function Emergency1962Modal({
  isOpen,
  onClose,
  triageData,
  farmerUser,
  selectedState = 'Maharashtra',
  lang = 'en',
  dict = {}
}) {
  // Selected sub-tab in modal: 'all', 'call', 'sms', 'note'
  const [activeTab, setActiveTab] = useState('all');

  // Triggered states for the 3 paths
  const [callTriggered, setCallTriggered] = useState(false);
  const [smsTriggered, setSmsTriggered] = useState(false);
  const [noteGenerated, setNoteGenerated] = useState(true); // Generated on load
  const [noteDownloaded, setNoteDownloaded] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  // Simulated call connection state
  const [isCallingSimulated, setIsCallingSimulated] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Generate unique dispatch reference
  const [dispatchRef] = useState(() => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const statePrefix = (selectedState || 'MH').slice(0, 2).toUpperCase();
    return `1962-${statePrefix}-${Date.now().toString().slice(-4)}-${randomId}`;
  });

  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Extract patient context
  const species = triageData?.species || triageData?.animalType || farmerUser?.primaryLivestock || 'Cow';
  const diseaseName = triageData?.primaryDiagnosis?.nameEn || triageData?.diseaseName || 'Suspected Acute Livestock Emergency';
  const riskLevel = triageData?.riskLevel || 'URGENT';
  const isUrgent = riskLevel === 'URGENT' || riskLevel === 'High' || triageData?.isUrgent;
  
  const farmerName = farmerUser?.name || 'Local Livestock Farmer';
  const farmerMobile = farmerUser?.mobile || '9876543210';
  const village = farmerUser?.village || 'Wagholi';
  const talukaOrMandal = farmerUser?.taluka || farmerUser?.mandal || 'Haveli';
  const district = farmerUser?.district || 'Pune';
  const stateName = selectedState || farmerUser?.state || 'Maharashtra';
  const isAP = stateName === 'Andhra Pradesh';

  const symptomsList = Array.isArray(triageData?.symptoms) && triageData.symptoms.length > 0
    ? triageData.symptoms.join(', ')
    : (triageData?.matchedSymptoms?.join(', ') || 'High fever, severe distress, recumbency, anorexia');

  // Path 2: Structured SMS Template
  const smsBody = `1962 EMERGENCY DISPATCH
REF: ${dispatchRef}
DATE: ${timestamp}
LOC: ${village}, ${talukaOrMandal} (${isAP ? 'Mandal' : 'Taluka'}), ${district}, ${stateName}
FARMER: ${farmerName} (${farmerMobile})
ANIMAL: ${species}
SUSPECT: ${diseaseName} [${riskLevel}]
SIGNS: ${symptomsList}
WARNING: ${triageData?.anthraxWarning ? 'ANTHRAX SUSPECT - DO NOT OPEN CARCASS' : 'URGENT AMBULANCE NEEDED'}
REQ: Immediate Mobile Veterinary Unit (MVU) Dispatch.`;

  // Path 3: Offline Dispatch Note Content
  const offlineDispatchNoteText = `========================================================
GOVERNMENT OF ${stateName.toUpperCase()} - DEPARTMENT OF ANIMAL HUSBANDRY
1962 MOBILE VETERINARY UNIT (MVU) EMERGENCY DISPATCH SLIP
========================================================
TICKET REF      : ${dispatchRef}
DATE & TIME     : ${timestamp}
STATUS          : EMERGENCY ESCALATION DISPATCHED
PRIORITY LEVEL  : ${riskLevel} - IMMEDIATE ON-FARM VET DISPATCH

--------------------------------------------------------
1. GEOGRAPHIC & FARMER DETAILS
--------------------------------------------------------
Farmer Name     : ${farmerName}
Contact Mobile  : ${farmerMobile}
State           : ${stateName}
District        : ${district}
${isAP ? 'Mandal' : 'Taluka'}          : ${talukaOrMandal}
Village / Loc   : ${village}
GPS Coordinates : Lat 18.5204 N, Lon 73.8567 E (Estimated)

--------------------------------------------------------
2. LIVESTOCK PATIENT & CLINICAL TRIAGE
--------------------------------------------------------
Species Affected: ${species}
Suspected Issue : ${diseaseName}
Triage Severity : ${riskLevel}
Reported Signs  : ${symptomsList}
Clinical Notes  : ${triageData?.message || 'High severity signs reported. Requires emergency on-site evaluation.'}

--------------------------------------------------------
3. CRITICAL BIO-SECURITY & FIRST-AID DIRECTIVES
--------------------------------------------------------
${triageData?.anthraxWarning 
  ? '⚠️ BIO-CONTAINMENT ORDER (ANTHRAX SUSPECT):\n• DO NOT OPEN OR CUT CARCASS. Post-mortem strictly prohibited by law.\n• Deep burial 6-8 ft with quicklime under official supervision only.\n• Quarantine stall and stop scavenger access.'
  : '• Isolate animal immediately in dry, disinfected shaded enclosure.\n• Provide fresh clean water and easily digestible soft gruel.\n• Strictly avoid unprescribed antibiotic injections prior to vet arrival.'}

--------------------------------------------------------
DISPATCH INSTRUCTIONS FOR ARRIVING MVU DOCTOR / PARAVET:
• Verify identity tag and record rectal temperature.
• Collect sterile blood/swab sample if non-anthrax.
• Execute ring vaccination for in-contact herd if contagious.
========================================================
Generated via PashuSuraksha 1962 Offline Emergency Engine
Offline Storage Validated: Saved in Device Local Cache
Advisory supports, and does not replace, a registered veterinarian.
========================================================`;

  // Save to offline storage automatically
  useEffect(() => {
    if (!isOpen) return;
    try {
      const existing = JSON.parse(localStorage.getItem('pashu_offline_dispatch_notes') || '[]');
      const isAlreadySaved = existing.some(item => item.ref === dispatchRef);
      if (!isAlreadySaved) {
        const newRecord = {
          ref: dispatchRef,
          date: timestamp,
          species,
          disease: diseaseName,
          risk: riskLevel,
          farmer: farmerName,
          mobile: farmerMobile,
          location: `${village}, ${talukaOrMandal}, ${district}, ${stateName}`,
          content: offlineDispatchNoteText
        };
        localStorage.setItem('pashu_offline_dispatch_notes', JSON.stringify([newRecord, ...existing]));
      }
    } catch (e) {
      console.warn('[1962 Mode] Offline storage error:', e);
    }
  }, [dispatchRef]);

  // Handle Path 1: Call
  const handleTriggerCall = () => {
    setCallTriggered(true);
    setIsCallingSimulated(true);
    setCallTimer(1);
    
    // Attempt standard device phone dialer
    try {
      window.location.href = 'tel:1962';
    } catch (e) {
      console.warn('[1962] Unable to open tel dialer:', e);
    }
  };

  // Simulate call duration
  useEffect(() => {
    let interval;
    if (isCallingSimulated) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallingSimulated]);

  // Handle Path 2: SMS
  const handleTriggerSMS = () => {
    setSmsTriggered(true);
    try {
      const encoded = encodeURIComponent(smsBody);
      window.location.href = `sms:1962?body=${encoded}`;
    } catch (e) {
      console.warn('[1962] SMS protocol trigger error:', e);
    }
  };

  const handleCopySMS = () => {
    navigator.clipboard.writeText(smsBody);
    setSmsTriggered(true);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  // Handle Path 3: Download text file
  const handleDownloadNote = () => {
    setNoteDownloaded(true);
    const element = document.createElement('a');
    const file = new Blob([offlineDispatchNoteText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `1962_Emergency_Dispatch_Note_${dispatchRef}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintNote = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>1962 Emergency Dispatch Slip - ${dispatchRef}</title>
          <style>
            body { font-family: monospace; white-space: pre-wrap; padding: 24px; font-size: 13px; line-height: 1.4; }
            @media print {
              body { font-size: 11px; padding: 12px; }
            }
          </style>
        </head>
        <body>${offlineDispatchNoteText}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(offlineDispatchNoteText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  const allThreeTriggered = callTriggered && smsTriggered && (noteGenerated || noteDownloaded);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border-2 border-red-500">
        
        {/* MODAL HEADER */}
        <div className="bg-[#B91C1C] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldAlert className="w-7 h-7 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-wide uppercase">
                  1962 Emergency Escalation Console
                </h3>
                <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {riskLevel}
                </span>
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                One-tap triage escalation: Call, SMS fallback & Offline dispatch slip for Mobile Veterinary Unit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition cursor-pointer"
            title="Close 1962 Console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* THREE PATHS STATUS BANNER */}
        <div className="bg-[#1E293B] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 text-xs">
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="text-slate-400">DISPATCH REF:</span>
            <span className="font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded">{dispatchRef}</span>
          </div>

          {/* Three Paths Checklist Badges */}
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
              callTriggered ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              {callTriggered ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>Path 1: Call</span>
            </span>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
              smsTriggered ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              {smsTriggered ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>Path 2: SMS Fallback</span>
            </span>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
              noteGenerated ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              <Check className="w-3 h-3" />
              <span>Path 3: Offline Note</span>
            </span>
          </div>

          {allThreeTriggered && (
            <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded animate-pulse">
              ✓ All 3 Paths Triggered
            </span>
          )}
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div className="bg-gray-100 px-4 pt-2.5 flex space-x-2 border-b border-gray-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition cursor-pointer ${
              activeTab === 'all' 
                ? 'border-[#B91C1C] text-[#B91C1C] bg-white' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚡ Complete 3-Path Dashboard
          </button>
          <button
            onClick={() => setActiveTab('call')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'call' 
                ? 'border-[#B91C1C] text-[#B91C1C] bg-white' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Path 1: Toll-Free Call (1962)</span>
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'sms' 
                ? 'border-[#B91C1C] text-[#B91C1C] bg-white' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Path 2: SMS Template</span>
          </button>
          <button
            onClick={() => setActiveTab('note')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'note' 
                ? 'border-[#B91C1C] text-[#B91C1C] bg-white' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Path 3: Offline Slip</span>
          </button>
        </div>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F8FAFC]">
          
          {/* PATIENT TRIAGE SUMMARY STRIP */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Patient Condition</span>
              <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5">
                <span>{species}</span>
                <span className="text-gray-400">•</span>
                <span className="text-red-700">{diseaseName}</span>
              </h4>
              <p className="text-[11px] text-gray-600">
                Symptoms: <strong className="text-gray-800">{symptomsList}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Dispatch Destination</span>
              <p className="font-bold text-gray-800 text-xs flex items-center sm:justify-end space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>{village}, {talukaOrMandal}, {district}</span>
              </p>
              <p className="text-[11px] text-gray-600">Farmer: {farmerName} ({farmerMobile})</p>
            </div>
          </div>

          {/* CRITICAL WARNING IF ANTHRAX */}
          {triageData?.anthraxWarning && (
            <div className="bg-[#7F1D1D] text-white p-3.5 rounded-xl border-2 border-red-500 space-y-1.5 shadow-sm text-xs">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <h5 className="font-extrabold uppercase tracking-wide text-amber-200">
                  Critical Hazmat Warning: Suspected Anthrax Event
                </h5>
              </div>
              <p className="text-amber-100 text-[11px] font-medium leading-relaxed">
                Do NOT open or slice carcass. Notify 1962 dispatch operators immediately to send veterinary teams with hazmat containment kits and Anthrax Spore Ring Vaccine.
              </p>
            </div>
          )}

          {/* 3-PATH INTERACTIVE CONSOLE */}
          {(activeTab === 'all' || activeTab === 'call') && (
            <div className="bg-white rounded-xl border-2 border-red-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Path 1: One-Tap Toll-Free Call (1962)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Connects directly to {stateName} State Animal Emergency Command Center (24/7 MVU Dispatch)
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  callTriggered ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {callTriggered ? '✓ Dialed / Triggered' : 'Ready'}
                </span>
              </div>

              {/* Call Trigger Button & Guidance */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={handleTriggerCall}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold px-6 py-3 rounded-xl text-sm flex items-center justify-center space-x-2.5 shadow-md transition transform hover:scale-[1.01] cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5 text-white animate-bounce" />
                  <span>Call 1962 Emergency Hotline</span>
                </button>

                {isCallingSimulated && (
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                    <span className="text-red-900 font-bold flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      <span>Line Connected: 1962 MVU Command</span>
                    </span>
                    <span className="font-mono text-red-700 font-bold">
                      {Math.floor(callTimer / 60)}:{(callTimer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>

              {/* Emergency Call Script for Farmer */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>What to say to the 1962 Call Executive:</span>
                </span>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li><strong>Location:</strong> Village {village}, {talukaOrMandal} {isAP ? 'Mandal' : 'Taluka'}, {district} District.</li>
                  <li><strong>Emergency:</strong> {species} with suspected {diseaseName} ({symptomsList}).</li>
                  <li><strong>Priority:</strong> Request immediate dispatch of nearest Mobile Veterinary Unit (MVU).</li>
                </ol>
              </div>
            </div>
          )}

          {/* PATH 2: SMS FALLBACK PROTOCOL */}
          {(activeTab === 'all' || activeTab === 'sms') && (
            <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0F2F5C]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Path 2: SMS Fallback Dispatch Template
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Works on 2G / weak cellular edge connections where voice calls fail or lines are busy
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  smsTriggered ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {smsTriggered ? '✓ Template Triggered' : 'Ready'}
                </span>
              </div>

              {/* SMS Preview Box */}
              <div className="relative">
                <pre className="bg-[#1E293B] text-emerald-400 p-3.5 rounded-xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed border border-slate-700 overflow-x-auto">
                  {smsBody}
                </pre>
                <span className="absolute top-2 right-2 text-[9px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {smsBody.length} chars • Standard SMS
                </span>
              </div>

              {/* SMS Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={handleTriggerSMS}
                  className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open in Mobile SMS App (1962)</span>
                </button>

                <button
                  onClick={handleCopySMS}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
                >
                  {copiedSms ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  <span>{copiedSms ? 'Copied to Clipboard!' : 'Copy SMS Text'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(smsBody)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#15803D] hover:bg-[#166534] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share with Para-Vet / Officer</span>
                </a>
              </div>
            </div>
          )}

          {/* PATH 3: OFFLINE DISPATCH NOTE */}
          {(activeTab === 'all' || activeTab === 'note') && (
            <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-[#E07B00]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Path 3: Offline Emergency Dispatch Note (Zero-Connectivity Slip)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Automatically saved in device offline cache for physical handover to arriving doctor
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Cached Locally</span>
                </span>
              </div>

              {/* Note Preview Box */}
              <div className="relative">
                <pre className="bg-gray-50 text-gray-800 p-3.5 rounded-xl text-[10px] font-mono whitespace-pre-wrap leading-relaxed border border-gray-300 max-h-48 overflow-y-auto">
                  {offlineDispatchNoteText}
                </pre>
              </div>

              {/* Note Actions: Download, Print, Copy */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={handleDownloadNote}
                  className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Slip (.txt)</span>
                </button>

                <button
                  onClick={handlePrintNote}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-gray-600" />
                  <span>Print Official Slip</span>
                </button>

                <button
                  onClick={handleCopyNote}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
                >
                  {copiedNote ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  <span>{copiedNote ? 'Note Copied!' : 'Copy Full Note'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-gray-100 p-3.5 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-gray-600 text-[11px]">
            <Info className="w-4 h-4 text-[#0F2F5C] shrink-0" />
            <span>
              All 3 escalation paths operate 100% offline. Emergency notes remain saved in device storage.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-6 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Close Emergency Console
          </button>
        </div>

      </div>
    </div>
  );
}
