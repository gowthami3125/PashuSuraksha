import React, { useState } from 'react';
import { 
  ClipboardList, FileText, Calendar, Clock, Video, PhoneCall, Download, 
  Printer, CheckCircle2, AlertTriangle, ShieldCheck, User, Stethoscope, 
  ChevronRight, ExternalLink, Plus, MapPin, Building
} from 'lucide-react';

export default function FarmerConsultations({ 
  consultations = [], 
  prescriptions = [], 
  onNavigate,
  onJoinVideoCall,
  dict,
  lang,
  farmerUser
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'slots' | 'rx'
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [newSlotForm, setNewSlotForm] = useState({
    doctor: 'Dr. S. K. Kulkarni',
    date: '2026-09-30',
    time: '10:00 AM',
    mode: 'Live Video Tele-Consultation',
    reason: ''
  });

  const handlePrintPrescription = (rx) => {
    const rxHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>PashuSuraksha Veterinary Prescription - ${rx.id}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111827; margin: 20px; line-height: 1.5; font-size: 13px; }
          .header { border-bottom: 2px solid #0F2F5C; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 20px; font-weight: 800; color: #0F2F5C; margin: 0; }
          .dept { font-size: 10px; font-weight: 700; color: #E07B00; text-transform: uppercase; letter-spacing: 0.5px; }
          .meta { font-size: 11px; color: #4B5563; margin-top: 3px; }
          .rx-badge { font-size: 24px; font-weight: 900; color: #0F2F5C; font-family: serif; }
          .section { margin-bottom: 16px; border: 1px solid #D1D5DB; border-radius: 6px; padding: 14px; background: #fff; }
          .section-title { font-size: 11px; font-weight: 800; color: #0F2F5C; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; margin-bottom: 8px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .field { font-size: 12px; }
          .label { font-weight: 700; color: #4B5563; min-width: 110px; display: inline-block; }
          .meds-box { background: #F9FAFB; border-left: 3px solid #0F2F5C; padding: 10px 14px; margin: 8px 0; font-family: inherit; white-space: pre-line; font-size: 12px; }
          .advice-box { background: #FEF3C7; border: 1px solid #FCD34D; padding: 10px; border-radius: 4px; font-size: 11px; margin-top: 8px; color: #92400E; }
          .footer { margin-top: 30px; border-top: 1px solid #D1D5DB; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
          .sig-box { text-align: right; min-width: 200px; }
          .sig-line { border-top: 1px solid #111827; margin-top: 40px; padding-top: 4px; font-weight: 700; font-size: 11px; }
          .print-btn { background: #0F2F5C; color: white; padding: 8px 16px; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: right; margin-bottom: 15px;">
          <button class="print-btn" onclick="window.print()">🖨️ Print Prescription</button>
        </div>

        <div class="header">
          <div>
            <div class="dept">Government of Maharashtra / Andhra Pradesh • Department of Animal Husbandry</div>
            <h1 class="title">Official Digital Veterinary e-Prescription</h1>
            <div class="meta">Certificate Reference: <strong>${rx.id}</strong> • Case Ref: <strong>${rx.caseId || 'CASE-2026'}</strong></div>
          </div>
          <div style="text-align: right;">
            <div class="rx-badge">℞</div>
            <div style="font-size: 10px; font-weight: bold; color: #15803D;">VCI CERTIFIED</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">1. Registered Veterinary Practitioner & Patient Details</div>
          <div class="grid">
            <div>
              <div class="field"><span class="label">Prescribing Vet:</span> <strong>${rx.doctorName || 'Dr. S. K. Kulkarni'}</strong></div>
              <div class="field"><span class="label">VCI License:</span> <strong>${rx.license || 'VCI-MH-2021-0842'}</strong></div>
              <div class="field"><span class="label">Dispensary:</span> ${rx.hospital || 'Haveli Veterinary Dispensary'}</div>
            </div>
            <div>
              <div class="field"><span class="label">Farmer / Owner:</span> <strong>${rx.farmerName || 'Anandrao Patil'}</strong></div>
              <div class="field"><span class="label">Contact Mobile:</span> ${rx.farmerMobile || '9822012345'}</div>
              <div class="field"><span class="label">Issue Date:</span> ${rx.timestamp || new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">2. Clinical Diagnosis</div>
          <div style="font-size: 14px; font-weight: 800; color: #0F2F5C; margin: 4px 0;">
            ${rx.diagnosis || 'Clinical Evaluation Completed'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">3. Prescribed Supportive Regimen & Medication (Rx)</div>
          <div class="meds-box">${rx.medicinesText || 'Supportive care as advised by attending veterinary officer.'}</div>
          
          ${rx.advice ? `
            <div class="advice-box">
              <strong>Dietary & Biosecurity Instructions:</strong><br/>
              ${rx.advice}
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <div style="font-size: 10px; color: #6B7280; max-width: 350px;">
            This digital e-prescription is issued in compliance with the Veterinary Council of India regulations and PashuSuraksha Tele-Health standards.
          </div>
          <div class="sig-box">
            <div class="sig-line">
              ${rx.doctorName || 'Veterinary Officer'}<br/>
              <span style="font-size: 9px; font-weight: normal; color: #6B7280;">Digitally Signed & Validated (VCI)</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(rxHtml);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => printWin.print(), 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-6">
          <div>
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest block">
              Farmer Care Continuum • Tele-Health Services
            </span>
            <h2 className="text-2xl font-bold text-[#111827] flex items-center space-x-3 mt-0.5">
              <ClipboardList className="w-7 h-7 text-[#0F2F5C]" />
              <span>My Consultation Times & Prescriptions</span>
            </h2>
            <p className="text-xs text-[#4B5563] mt-1">
              Review upcoming appointment times with Veterinary Officers and download official digital prescriptions in one place.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('/vet/prescriptions')}
              className="bg-[#F3F4F6] hover:bg-[#D1D5DB] text-[#0F2F5C] border border-[#D1D5DB] text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer flex items-center space-x-1.5 transition shadow-sm"
              title="Demo helper: switch to Vet side to write new Rx"
            >
              <FileText className="w-3.5 h-3.5 text-[#0F2F5C]" />
              <span>Write as Vet Officer ➜</span>
            </button>
          </div>
        </div>

        {/* SUMMARY STATS & FILTER TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1D5DB] pb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-2 ${
                activeTab === 'all'
                  ? 'bg-[#0F2F5C] text-white shadow-sm'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
              }`}
            >
              <span>All Records ({consultations.length + prescriptions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('slots')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-2 ${
                activeTab === 'slots'
                  ? 'bg-[#0F2F5C] text-white shadow-sm'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Consultation Times ({consultations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rx')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-2 ${
                activeTab === 'rx'
                  ? 'bg-[#0F2F5C] text-white shadow-sm'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Prescriptions ({prescriptions.length})</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1.5 bg-[#F0FDF4] text-[#166534] border border-[#86EFAC] px-2.5 py-1 rounded font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{prescriptions.length} Active Rx</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-2.5 py-1 rounded font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{consultations.length} Consultations</span>
            </span>
          </div>
        </div>

        {/* SECTION 1: CONSULTATION APPOINTMENT TIMES */}
        {(activeTab === 'all' || activeTab === 'slots') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#0F2F5C]" />
                <span>Scheduled Veterinary Consultation Times ({consultations.length})</span>
              </h3>
            </div>

            {consultations.length === 0 ? (
              <div className="bg-[#F3F4F6] p-6 rounded-lg text-center text-xs text-[#4B5563] border border-dashed border-[#D1D5DB]">
                No upcoming consultations scheduled. Complete a Symptom Check or contact your local dispensary.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultations.map(slot => (
                  <div key={slot.id} className="bg-white border-2 border-[#D1D5DB] rounded-lg p-5 space-y-3 hover:border-[#0F2F5C] transition shadow-sm">
                    <div className="flex justify-between items-start border-b border-[#D1D5DB] pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold bg-[#F3F4F6] text-[#0F2F5C] px-2 py-0.5 rounded border border-[#D1D5DB]">
                            {slot.id}
                          </span>
                          <span className="bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {slot.status || 'CONFIRMED'}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-[#111827] mt-1.5 flex items-center space-x-1.5">
                          <User className="w-4 h-4 text-[#0F2F5C]" />
                          <span>{slot.doctorName}</span>
                        </h4>
                        <p className="text-xs text-[#4B5563] font-medium">{slot.degree || 'B.V.Sc & A.H.'}</p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[11px] font-bold px-2.5 py-1 rounded">
                          {slot.mode || 'Live Video Tele-Consultation'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB] space-y-1.5 text-xs">
                      <div className="flex items-center space-x-2 text-[#111827] font-bold">
                        <Clock className="w-4 h-4 text-[#E07B00]" />
                        <span>Appointment Time: {slot.scheduledDate} at {slot.scheduledTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#4B5563]">
                        <Building className="w-3.5 h-3.5 text-[#4B5563]" />
                        <span>{slot.clinic || 'Taluka Veterinary Polyclinic'}</span>
                      </div>
                      {slot.notes && (
                        <p className="text-[11px] text-[#4B5563] italic pt-1 border-t border-[#D1D5DB]/60">
                          Note: {slot.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-[#4B5563]">Case Ref: {slot.caseId || 'CASE-2026-901'}</span>
                      
                      <div className="flex items-center space-x-2">
                        <a 
                          href="tel:9822012345"
                          className="bg-white hover:bg-[#F3F4F6] text-[#0F2F5C] border border-[#D1D5DB] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition"
                        >
                          <PhoneCall className="w-3 h-3 text-[#0F2F5C]" />
                          <span>Call Doctor</span>
                        </a>

                        <button 
                          onClick={() => onNavigate('/vet/consultations')}
                          className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-sm transition"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Room</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: OFFICIAL DIGITAL PRESCRIPTIONS (RX) */}
        {(activeTab === 'all' || activeTab === 'rx') && (
          <div className="space-y-4 pt-4 border-t border-[#D1D5DB]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#0F2F5C]" />
                <span>Official Digital Prescriptions Written by Vet Officers ({prescriptions.length})</span>
              </h3>
            </div>

            {prescriptions.length === 0 ? (
              <div className="bg-[#F3F4F6] p-8 rounded-lg text-center space-y-3 border border-dashed border-[#D1D5DB]">
                <FileText className="w-10 h-10 text-[#4B5563] mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-[#111827]">No Digital Prescriptions Issued Yet</h4>
                <p className="text-xs text-[#4B5563] max-w-md mx-auto">
                  Once your local Veterinary Officer examines your triage incident or video consultation, their digital e-prescription will show here in real-time.
                </p>
                <button
                  onClick={() => onNavigate('/vet/prescriptions')}
                  className="btn-navy text-xs font-bold px-4 py-2 rounded-lg cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <span>Go to Vet Portal to Write Prescription</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {prescriptions.map(rx => (
                  <div key={rx.id} className="bg-white border-2 border-[#0F2F5C] rounded-lg p-6 space-y-4 shadow-sm hover:shadow-md transition">
                    
                    {/* RX CARD HEADER */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1D5DB] pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#0F2F5C] text-white rounded-lg flex items-center justify-center font-serif text-2xl font-bold">
                          ℞
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-mono text-sm font-bold text-[#0F2F5C]">{rx.id}</h4>
                            <span className="bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>VCI VERIFIED</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-[#4B5563] font-medium block mt-0.5">
                            Issued by: <strong>{rx.doctorName}</strong> ({rx.license || 'VCI Registered Officer'})
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#4B5563] block font-mono">Issued: {rx.timestamp}</span>
                        <span className="text-[11px] font-bold text-[#111827]">Case: {rx.caseId || 'CASE-2026-901'}</span>
                      </div>
                    </div>

                    {/* DIAGNOSIS BANNER */}
                    <div className="bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">
                          Confirmed Clinical Diagnosis:
                        </span>
                        <span className="text-base font-bold text-[#111827]">{rx.diagnosis}</span>
                      </div>
                      <span className="text-xs text-[#4B5563] font-medium">Patient: {rx.farmerName}</span>
                    </div>

                    {/* MEDICATIONS & SUPPORTIVE REGIMEN */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-[#0F2F5C] uppercase tracking-wider block">
                        Prescribed Medication & Supportive Dosage:
                      </span>
                      <div className="bg-white border border-[#D1D5DB] rounded-lg p-3.5 text-xs text-[#111827] whitespace-pre-line leading-relaxed font-mono font-medium">
                        {rx.medicinesText}
                      </div>
                    </div>

                    {/* ADVICE */}
                    {rx.advice && (
                      <div className="bg-[#FFFBEB] border border-[#FCD34D] p-3 rounded-lg text-xs text-[#92400E] space-y-1">
                        <span className="font-bold block">Biosecurity, Quarantine & Feeding Instructions:</span>
                        <p className="leading-relaxed">{rx.advice}</p>
                      </div>
                    )}

                    {/* CARD FOOTER WITH PRINT BUTTON */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D1D5DB]">
                      <span className="text-[10px] text-[#4B5563]">
                        Official document signed under the Indian Veterinary Practitioners Regulations.
                      </span>

                      <button
                        onClick={() => handlePrintPrescription(rx)}
                        className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-1.5 shadow-sm transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Save Rx PDF</span>
                      </button>
                    </div>

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
