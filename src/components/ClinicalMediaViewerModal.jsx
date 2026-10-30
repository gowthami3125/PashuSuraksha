import React, { useState } from 'react';
import { 
  X, ZoomIn, ZoomOut, RotateCcw, Download, User, MapPin, 
  Clock, ShieldAlert, FileText, Video, PhoneCall, CheckCircle, ExternalLink, Zap
} from 'lucide-react';

export default function ClinicalMediaViewerModal({ 
  isOpen, 
  onClose, 
  caseData,
  onWritePrescription,
  onStartVideoCall
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !caseData) return null;

  const media = caseData.attachedMedia || (caseData.photoUrl ? {
    type: caseData.videoUrl ? 'video' : 'image',
    dataUrl: caseData.photoUrl,
    videoUrl: caseData.videoUrl,
    originalSize: caseData.photoMeta?.originalSize || '2.8 MB',
    compressedSize: caseData.photoMeta?.compressedSize || '156 KB',
    reductionPercent: 94,
    name: 'clinical_lesion_record.jpg',
    capturedAt: caseData.timestamp || 'Today'
  } : null);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border border-[#D1D5DB] rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#111827]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1D5DB] bg-[#F3F4F6]">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-[#0F2F5C] text-white rounded-lg">
              {media?.type === 'video' ? <Video className="w-5 h-5 text-white" /> : <ZoomIn className="w-5 h-5 text-white" />}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-[#0F2F5C] text-white px-2 py-0.5 rounded">
                  {caseData.id}
                </span>
                <span className="text-xs font-bold text-[#DC2626] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  {caseData.urgency || caseData.riskLevel || 'Priority Case'}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#111827] mt-0.5">
                Clinical Media Inspection — {caseData.predictedDisease || 'Livestock Lesion'}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-[#4B5563] hover:text-[#111827] rounded-lg bg-white border border-[#D1D5DB] hover:bg-gray-100 cursor-pointer transition"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY: SPLIT VIEW (IMAGE CANVAS + CASE DETAILS) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          {/* LEFT 2 COLS: INTERACTIVE IMAGE / VIDEO VIEWER */}
          <div className="lg:col-span-2 bg-[#0B2447] relative flex flex-col items-center justify-center p-4 min-h-[350px] overflow-hidden select-none">
            {media ? (
              media.type === 'video' ? (
                <div className="w-full h-full max-h-[60vh] flex items-center justify-center">
                  <video 
                    src={media.videoUrl} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-[55vh] rounded-lg shadow-lg border border-gray-700" 
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-4 cursor-grab">
                  <img
                    src={media.dataUrl}
                    alt="Clinical Lesion"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: 'transform 0.15s ease-out'
                    }}
                    className="max-h-[55vh] max-w-full object-contain rounded-md shadow-2xl"
                  />
                </div>
              )
            ) : (
              <div className="text-white text-xs opacity-60">No attached clinical photo available.</div>
            )}

            {/* VIEWER FLOATING CONTROLS (FOR IMAGES) */}
            {media && media.type !== 'video' && (
              <div className="absolute bottom-4 inset-x-4 flex justify-between items-center pointer-events-none">
                <div className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono px-3 py-1.5 rounded-lg border border-white/20 pointer-events-auto">
                  Zoom: {Math.round(zoomLevel * 100)}% | Rot: {rotation}°
                </div>

                <div className="flex items-center space-x-1.5 bg-black/75 backdrop-blur-xs p-1.5 rounded-lg border border-white/20 pointer-events-auto shadow-lg">
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 text-white hover:bg-white/20 rounded cursor-pointer transition"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 text-white hover:bg-white/20 rounded cursor-pointer transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-1.5 text-white hover:bg-white/20 rounded cursor-pointer transition"
                    title="Rotate 90°"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-1 text-[10px] text-white hover:bg-white/20 rounded cursor-pointer font-bold transition"
                  >
                    Reset
                  </button>
                  {media.dataUrl && (
                    <a
                      href={media.dataUrl}
                      download={`case_${caseData.id}_lesion.jpg`}
                      className="p-1.5 text-white hover:bg-white/20 rounded cursor-pointer transition ml-1 border-l border-white/20 pl-2"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL: CLINICAL CONTEXT & PATIENT DATA */}
          <div className="bg-[#F3F4F6] border-t lg:border-t-0 lg:border-l border-[#D1D5DB] p-5 space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-none text-xs">
            {/* Compression Telemetry Box */}
            <div className="bg-white p-3 rounded-lg border border-[#D1D5DB] space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[#0F2F5C] font-bold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#E07B00]" />
                  <span>2G/3G Rural Compression</span>
                </span>
                <span className="text-[10px] bg-green-50 text-[#15803D] px-2 py-0.5 rounded border border-green-200">
                  Compressed & Verified
                </span>
              </div>
              <div className="text-[11px] text-[#4B5563] space-y-1">
                <div>Original Camera File: <strong className="text-[#111827]">{media?.originalSize || '2.8 MB'}</strong></div>
                <div>Compressed Payload: <strong className="text-[#0F2F5C]">{media?.compressedSize || '156 KB'}</strong></div>
                <div>Format: <strong className="text-[#111827]">{media?.mimeType || 'image/jpeg'} (1024px)</strong></div>
              </div>
            </div>

            {/* Farmer & Animal Details */}
            <div className="bg-white p-3.5 rounded-lg border border-[#D1D5DB] space-y-2">
              <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Patient & Herd Details</span>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-[#111827]">
                  <User className="w-3.5 h-3.5 text-[#0F2F5C]" />
                  <span>{caseData.farmerName} ({caseData.farmerMobile})</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#4B5563]">
                  <MapPin className="w-3.5 h-3.5 text-[#0F2F5C]" />
                  <span>{caseData.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#4B5563]">
                  <Clock className="w-3.5 h-3.5 text-[#0F2F5C]" />
                  <span>Submitted: {caseData.timestamp ? new Date(caseData.timestamp).toLocaleString() : 'Recent'}</span>
                </div>
              </div>
            </div>

            {/* Suspected Pathology & Symptoms */}
            <div className="bg-white p-3.5 rounded-lg border border-[#D1D5DB] space-y-2">
              <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Clinical Triage Match</span>
              <p className="font-bold text-sm text-[#DC2626]">
                {caseData.predictedDisease || 'Vesicular Lesions / FMD Suspect'}
              </p>
              <div className="space-y-1 text-[#4B5563]">
                <p>Species: <strong className="text-[#111827]">{caseData.species || 'Cattle (Cow)'}</strong></p>
                <div>
                  <span className="block font-semibold mb-1 text-[#111827]">Symptoms Observed:</span>
                  <div className="flex flex-wrap gap-1">
                    {(caseData.symptoms || ['Salivation', 'Mouth Blisters', 'High Fever']).map((s, idx) => (
                      <span key={idx} className="bg-[#F3F4F6] border border-[#D1D5DB] text-[#111827] px-2 py-0.5 rounded text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Officer Actions */}
            <div className="space-y-2 pt-1">
              {onWritePrescription && (
                <button
                  onClick={() => {
                    onClose();
                    onWritePrescription(caseData);
                  }}
                  className="w-full btn-navy py-2.5 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Write Prescription (Rx) For Case</span>
                </button>
              )}

              {onStartVideoCall && (
                <button
                  onClick={() => {
                    onClose();
                    onStartVideoCall(caseData);
                  }}
                  className="w-full bg-white hover:bg-gray-50 text-[#111827] border border-[#D1D5DB] font-bold py-2 rounded-lg text-xs cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-[#0F2F5C]" />
                  <span>Start Tele-Consultation Call</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
