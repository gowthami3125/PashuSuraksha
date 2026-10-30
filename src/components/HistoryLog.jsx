import React, { useState } from 'react';
import { 
  History, Trash2, Clock, Stethoscope, ChevronRight, ShieldAlert, 
  MessageSquare, User, AlertTriangle, FileText, CheckCircle, ExternalLink, 
  RefreshCw, Download, Printer, MapPin, CheckCircle2, Activity, ArrowRight, Camera
} from 'lucide-react';
import { getTrans } from '../data/dictionary';

export default function HistoryLog({ 
  triageHistory = [], 
  chatHistory = [],
  vetConsultHistory = [],
  activeRole = 'farmer',
  handleClearHistory, 
  handleReopenReport,
  onNavigate, 
  lang, 
  dict 
}) {
  const [activeSubTab, setActiveSubTab] = useState('triage');
  const [downloadingId, setDownloadingId] = useState(null);
  const [offlineNotes, setOfflineNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pashu_offline_dispatch_notes') || '[]');
    } catch (e) {
      return [];
    }
  });

  const renderRiskBadge = (riskLevel) => {
    const isHigh = riskLevel === 'URGENT' || riskLevel === 'High';
    const isMedium = riskLevel === 'Medium';

    if (isHigh) {
      return (
        <span className="bg-[#DC2626] text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center space-x-1 shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-white" />
          <span>{riskLevel || 'URGENT'}</span>
        </span>
      );
    } else if (isMedium) {
      return (
        <span className="bg-[#D97706] text-[#111827] px-2.5 py-1 rounded text-[11px] font-bold flex items-center space-x-1 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-[#111827]" />
          <span>{riskLevel || 'Medium'}</span>
        </span>
      );
    } else {
      return (
        <span className="bg-[#15803D] text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center space-x-1 shadow-sm">
          <CheckCircle className="w-3.5 h-3.5 text-white" />
          <span>{riskLevel || 'Low'}</span>
        </span>
      );
    }
  };

  const downloadHistoryReport = async (rec) => {
    setDownloadingId(rec.id);
    const payload = {
      animalId: rec.animalId || 'Livestock',
      riskLevel: rec.riskLevel || 'Assessed',
      matchedConditions: rec.triageData?.matchedConditions || [
        {
          nameEn: rec.detectedDiseaseEn,
          categoryEn: 'Livestock Health',
          confidenceLabel: rec.confidence
        }
      ],
      incidentDetails: rec.incidentDetails || {
        animalId: rec.animalId,
        sickCount: 1,
        deadCount: 0,
        durationDays: 1,
        location: rec.location || 'Baramati, Pune',
        caseId: rec.id
      },
      timestamp: rec.timestamp
    };

    try {
      const res = await fetch('http://localhost:5000/api/pdf/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const html = await res.text();

      // 1. Direct file download
      try {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `PashuSuraksha_Triage_Report_${rec.id || Date.now()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } catch (e) {
        console.warn('Direct file download fallback triggered', e);
      }

      // 2. Open print view window for instant PDF save/print
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
    } catch (err) {
      console.error("PDF download error:", err);
      window.print();
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 md:p-8 space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-6">
          <div>
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest block">
              {activeRole === 'vet' ? 'Veterinary Clinical Records' : 'Farmer Health & Consultation Records'}
            </span>
            <h2 className="text-2xl font-bold text-[#111827] flex items-center space-x-3 mt-0.5">
              <History className="w-7 h-7 text-[#0F2F5C]" />
              <span>{dict.historyTitle || 'Activity History & Case Logs'}</span>
            </h2>
            <p className="text-xs text-[#4B5563] mt-1">
              {dict.historySubtitle || 'Past symptom check evaluations with status timeline, Q&A chat transcripts, and downloadable reports.'}
            </p>
          </div>

          {((triageHistory && triageHistory.length > 0) || (chatHistory && chatHistory.length > 0)) && (
            <button 
              onClick={handleClearHistory}
              className="flex items-center space-x-1.5 text-xs font-bold text-[#DC2626] hover:bg-[#DC2626]/10 bg-white px-3.5 py-2 rounded-lg border border-[#DC2626] transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-[#DC2626]" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* FARMER vs VET PORTAL HISTORY VIEW SWITCHER */}
        {activeRole === 'farmer' ? (
          <div className="flex space-x-2 border-b border-[#D1D5DB] pb-3">
            <button
              onClick={() => setActiveSubTab('triage')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'triage'
                  ? 'bg-[#0F2F5C] text-white'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Symptom Check Triage Logs ({triageHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'chat'
                  ? 'bg-[#0F2F5C] text-white'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Sahayak AI Chat Logs ({chatHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('emergency')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'emergency'
                  ? 'bg-[#B91C1C] text-white'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>1962 Emergency Slips ({offlineNotes.length})</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB] text-xs font-bold text-[#0F2F5C]">
            📋 Veterinary Officer Consultation History & Patient Queue Log
          </div>
        )}

        {/* 1. FARMER TRIAGE HISTORY WITH STATUS TIMELINE & PDF DOWNLOAD */}
        {activeRole === 'farmer' && activeSubTab === 'triage' && (
          <div>
            {(!triageHistory || triageHistory.length === 0) ? (
              <div className="text-center py-12 space-y-3 bg-[#F3F4F6] rounded-lg border border-dashed border-[#D1D5DB]">
                <Clock className="w-12 h-12 text-[#4B5563] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-[#111827]">No Triage History Found</h3>
                <p className="text-xs text-[#4B5563]">You have not completed any symptom check evaluations on this device yet.</p>
                <button 
                  onClick={() => onNavigate('/triage')} 
                  className="btn-navy text-xs font-bold px-5 py-2.5 rounded-lg cursor-pointer inline-flex items-center space-x-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Start Symptom Check Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {triageHistory.map(rec => {
                  const timeline = rec.statusTimeline || [
                    {
                      step: 1,
                      title: 'Incident Submitted',
                      desc: 'Clinical symptoms and incident details logged by farmer',
                      time: rec.timestamp,
                      status: 'completed'
                    },
                    {
                      step: 2,
                      title: 'Automated AI Pre-Triage',
                      desc: `${rec.detectedDiseaseEn || 'Symptom analysis'} (${rec.riskLevel} Risk)`,
                      time: rec.timestamp,
                      status: 'completed'
                    },
                    {
                      step: 3,
                      title: 'Transmitted to Local Vet Queue',
                      desc: `Dispatched to ${rec.location || 'Local'} Veterinary Officer`,
                      time: rec.timestamp,
                      status: (rec.riskLevel === 'URGENT' || rec.riskLevel === 'High') ? 'urgent' : 'active'
                    },
                    {
                      step: 4,
                      title: 'Veterinary Action & Prescriptions',
                      desc: (rec.riskLevel === 'URGENT' || rec.riskLevel === 'High') ? 'Emergency 1962 alert flagged; awaiting on-site visit' : 'Awaiting officer tele-consultation and e-prescription',
                      time: 'Pending',
                      status: 'pending'
                    }
                  ];

                  return (
                    <div key={rec.id} className="bg-white border-2 border-[#D1D5DB] rounded-lg p-5 space-y-4 hover:border-[#0F2F5C] transition shadow-sm">
                      {/* CARD HEADER */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D1D5DB] pb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl p-1 bg-[#F3F4F6] rounded-md border border-[#D1D5DB]">{rec.animalIcon || '🐄'}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-[#111827]">{rec.animalName || 'Livestock'}</h4>
                              <span className="text-[10px] font-mono font-bold bg-[#F3F4F6] text-[#0F2F5C] px-2 py-0.5 rounded border border-[#D1D5DB]">
                                {rec.id}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#4B5563] font-medium flex items-center space-x-1 mt-0.5">
                              <Clock className="w-3 h-3 text-[#4B5563]" />
                              <span>{rec.timestamp}</span>
                              <span>•</span>
                              <MapPin className="w-3 h-3 text-[#4B5563]" />
                              <span>{rec.location || 'Baramati, Pune'}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {renderRiskBadge(rec.riskLevel)}
                        </div>
                      </div>

                      {/* SUMMARY & SYMPTOMS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#F3F4F6] p-3.5 rounded-lg border border-[#D1D5DB]">
                        <div>
                          <span className="font-bold text-[#0F2F5C] block text-[11px] uppercase tracking-wider">
                            Suspected Diagnosis Outcome:
                          </span>
                          <p className="font-bold text-[#111827] text-sm mt-0.5">{rec.detectedDiseaseEn}</p>
                          <span className="text-[10px] text-[#4B5563]">{rec.confidence || 'Pattern Alignment'}</span>
                        </div>

                        <div>
                          <span className="font-bold text-[#4B5563] uppercase text-[10px] block tracking-wider">
                            Reported Clinical Signs:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.symptomsLabels && rec.symptomsLabels.length > 0 ? (
                              rec.symptomsLabels.map((lbl, idx) => (
                                <span key={idx} className="bg-white border border-[#D1D5DB] text-[#111827] px-2 py-0.5 rounded text-[10px] font-semibold">
                                  ✓ {lbl}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-[#4B5563] italic">General clinical observation</span>
                            )}
                          </div>
                        </div>

                        {/* ATTACHED PHOTO / LESION MEDIA */}
                        {(rec.attachedMedia || rec.photoUrl) && (
                          <div className="pt-1 flex items-center space-x-2">
                            <span className="font-bold text-[#0F2F5C] uppercase text-[10px] block tracking-wider">
                              Attached Lesion Media:
                            </span>
                            <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded border border-[#D1D5DB]">
                              <img 
                                src={rec.photoUrl || rec.attachedMedia?.dataUrl} 
                                alt="Lesion" 
                                className="w-8 h-8 object-cover rounded" 
                              />
                              <span className="text-[10px] font-bold text-[#111827]">
                                {rec.attachedMedia?.name || 'lesion_photo.jpg'} ({rec.attachedMedia?.compressedSize || 'Compressed'})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* STATUS TIMELINE BAR (SECTION 17 TASK 3 SPECIFICATION) */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-[#0F2F5C] uppercase tracking-wider flex items-center space-x-1.5">
                            <Activity className="w-3.5 h-3.5 text-[#E07B00]" />
                            <span>Case Progression Status Timeline</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3F4F6] text-[#0F2F5C] border border-[#D1D5DB]">
                            {rec.status || 'IN_REVIEW'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                          {timeline.map((step, sIdx) => {
                            const isDone = step.status === 'completed';
                            const isUrgentStep = step.status === 'urgent';
                            const isActiveStep = step.status === 'active';
                            const isPending = step.status === 'pending';

                            return (
                              <div 
                                key={sIdx} 
                                className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                                  isDone 
                                    ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]' 
                                    : isUrgentStep
                                    ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
                                    : isActiveStep
                                    ? 'bg-[#FFFBEB] border-[#FCD34D] text-[#92400E]'
                                    : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center space-x-1.5 font-bold text-[11px] mb-1">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                                      isDone ? 'bg-[#15803D]' : isUrgentStep ? 'bg-[#DC2626]' : isActiveStep ? 'bg-[#D97706]' : 'bg-[#9CA3AF]'
                                    }`}>
                                      {isDone ? '✓' : step.step}
                                    </span>
                                    <span className="truncate">{step.title}</span>
                                  </div>
                                  <p className="text-[10px] leading-tight opacity-90 line-clamp-2">
                                    {step.desc}
                                  </p>
                                </div>
                                <span className="text-[9px] font-mono mt-1.5 opacity-75">
                                  {step.time}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* CARD ACTIONS: DOWNLOAD PDF & RE-OPEN REPORT */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D1D5DB]">
                        <span className="text-[11px] text-[#4B5563]">
                          Official document verified with digital case record.
                        </span>

                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => downloadHistoryReport(rec)}
                            disabled={downloadingId === rec.id}
                            className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50"
                            title="Download server-side printable PDF/HTML report"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{downloadingId === rec.id ? 'Generating...' : 'Download PDF Report'}</span>
                          </button>

                          <button 
                            onClick={() => handleReopenReport(rec)}
                            className="bg-white hover:bg-[#F3F4F6] text-[#0F2F5C] border border-[#D1D5DB] text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer flex items-center space-x-1.5 transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Re-open Full Report</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. FARMER SAHAYAK CHATBOT LOGS */}
        {activeRole === 'farmer' && activeSubTab === 'chat' && (
          <div>
            {(!chatHistory || chatHistory.length === 0) ? (
              <div className="text-center py-12 space-y-3 bg-[#F3F4F6] rounded-lg border border-dashed border-[#D1D5DB]">
                <MessageSquare className="w-12 h-12 text-[#4B5563] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-[#111827]">No Saved Chat Conversations</h3>
                <p className="text-xs text-[#4B5563]">You have not started a conversation with Sahayak Q&A Assistant yet.</p>
              </div>
            ) : (
              <div className="bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB] space-y-3 max-h-96 overflow-y-auto">
                {chatHistory.map((msg, idx) => (
                  <div key={msg.id || idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-lg text-xs space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-[#0F2F5C] text-white'
                        : 'bg-white text-[#111827] border border-[#D1D5DB]'
                    }`}>
                      {msg.topic && (
                        <span className="inline-block text-[10px] font-bold bg-blue-100 text-[#0F2F5C] px-1.5 py-0.5 rounded">
                          {msg.topic}
                        </span>
                      )}
                      {msg.title && <h5 className="font-bold text-xs">{msg.title}</h5>}
                      <p className="font-medium leading-relaxed">{msg.summary || msg.text}</p>
                      {msg.steps && msg.steps.length > 0 && (
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-700">
                          {msg.steps.slice(0, 3).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      )}
                      {msg.citation && (
                        <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-200">
                          📚 Source: {msg.citation.authority} - {msg.citation.document}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2b. 1962 OFFLINE EMERGENCY DISPATCH SLIPS (TASK 8) */}
        {activeRole === 'farmer' && activeSubTab === 'emergency' && (
          <div>
            {(!offlineNotes || offlineNotes.length === 0) ? (
              <div className="text-center py-12 space-y-3 bg-[#F3F4F6] rounded-lg border border-dashed border-[#D1D5DB]">
                <ShieldAlert className="w-12 h-12 text-[#B91C1C] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-[#111827]">No Saved 1962 Emergency Slips</h3>
                <p className="text-xs text-[#4B5563]">
                  Emergency dispatch notes generated during acute triage escalation are saved here in local device memory.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium">
                    Stored 100% locally on this device. Accessible without internet connectivity.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm("Clear all local offline emergency dispatch slips?")) {
                        localStorage.removeItem('pashu_offline_dispatch_notes');
                        setOfflineNotes([]);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Slips</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {offlineNotes.map((note, idx) => (
                    <div key={note.ref || idx} className="bg-white border-2 border-red-200 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-extrabold bg-[#B91C1C] text-white px-2 py-0.5 rounded">
                            {note.ref}
                          </span>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                            {note.risk || 'URGENT'}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{note.date}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500 block text-[10px] uppercase font-bold">Animal & Disease</span>
                          <p className="font-bold text-gray-900">{note.species} — <span className="text-red-700">{note.disease}</span></p>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[10px] uppercase font-bold">Location</span>
                          <p className="text-gray-700">{note.location}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-32 overflow-y-auto">
                        <pre className="text-[10px] text-slate-800 font-mono whitespace-pre-wrap leading-tight">
                          {note.content}
                        </pre>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-gray-100">
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`<html><head><title>Dispatch Slip ${note.ref}</title><style>body { font-family: monospace; white-space: pre-wrap; padding: 20px; font-size: 12px; }</style></head><body>${note.content}</body></html>`);
                            printWindow.document.close();
                            printWindow.focus();
                            setTimeout(() => printWindow.print(), 250);
                          }}
                          className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </button>

                        <button
                          onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob([note.content], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = `1962_Dispatch_Slip_${note.ref}.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .txt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. VETERINARIAN PORTAL PATIENT CONSULT LOGS */}
        {activeRole === 'vet' && (
          <div className="space-y-4">
            {(!vetConsultHistory || vetConsultHistory.length === 0) ? (
              <div className="text-center py-12 space-y-3 bg-[#F3F4F6] rounded-lg border border-dashed border-[#D1D5DB]">
                <FileText className="w-12 h-12 text-[#4B5563] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-[#111827]">No Completed Patient Consultations</h3>
                <p className="text-xs text-[#4B5563]">No past patient records found in your officer queue log.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vetConsultHistory.map(c => (
                  <div key={c.id} className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#0F2F5C] bg-white px-2 py-0.5 rounded border border-[#D1D5DB]">{c.id}</span>
                      <span className="bg-[#15803D] text-white px-2.5 py-0.5 rounded text-[10px] font-bold">COMPLETED</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#111827]">{c.farmerName} ({c.farmerMobile})</h4>
                    <p className="text-[#4B5563]">Diagnosis: <strong>{c.predictedDisease}</strong></p>
                    <p className="text-[#4B5563]">Location: {c.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
