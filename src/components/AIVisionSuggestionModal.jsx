import React, { useState, useEffect } from 'react';
import { 
  Camera, Eye, CheckCircle, AlertTriangle, ShieldCheck, X, 
  HelpCircle, ChevronRight, Lock, Sparkles, Video, ArrowRight
} from 'lucide-react';
import { analyzeClinicalMedia, sanitizeAndCompressImage, extractVideoFrames } from '../services/visionAdapter';

export default function AIVisionSuggestionModal({
  isOpen,
  onClose,
  mediaFile,
  mediaDataUrl,
  species = 'cow',
  reportedSigns = [],
  onApplySuggestions
}) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const runAnalysis = async () => {
      setLoading(true);
      try {
        let activeDataUrl = mediaDataUrl;

        // If a raw File was passed, sanitize it
        if (mediaFile && !activeDataUrl) {
          if (mediaFile.type.startsWith('video/')) {
            const vData = await extractVideoFrames(mediaFile, 3);
            if (isMounted) setVideoMeta(vData);
            activeDataUrl = vData.frames[0]?.dataUrl;
          } else {
            const sanitized = await sanitizeAndCompressImage(mediaFile);
            activeDataUrl = sanitized.dataUrl;
          }
        }

        const res = await analyzeClinicalMedia({
          mediaDataUrl: activeDataUrl,
          species,
          reportedSigns
        });

        if (isMounted) {
          setAnalysis(res);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Vision analysis failed:', err);
        if (isMounted) setLoading(false);
      }
    };

    runAnalysis();
    return () => { isMounted = false; };
  }, [isOpen, mediaFile, mediaDataUrl, species, reportedSigns]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#D1D5DB] max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#D1D5DB] pb-3">
          <div>
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">
              Clinical Lesion Photo Analysis (Section 4.C)
            </span>
            <h3 className="font-bold text-[#111827] text-lg flex items-center space-x-2 mt-0.5">
              <Eye className="w-5 h-5 text-[#0F2F5C]" />
              <span>Diagnostic Visual Suggestion</span>
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#4B5563] hover:bg-[#F3F4F6] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MANDATORY HONESTY LABEL: "AI suggestion — a vet will confirm" */}
        <div className="bg-[#0F2F5C] text-white p-3 rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-300 font-extrabold uppercase tracking-wide">
              AI suggestion — a vet will confirm
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
            Preliminary
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#0F2F5C] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#111827]">Analyzing lesion morphology & stripping EXIF data...</p>
            <p className="text-[11px] text-[#4B5563]">Evaluating nodular borders, mucosal erosion & tissue hyperaemia</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4 text-xs">
            
            {/* Visual Indicators Detected */}
            <div className="bg-[#F3F4F6] p-3.5 rounded-lg border border-[#D1D5DB] space-y-2">
              <span className="font-bold text-[#111827] block text-xs">
                Observed Physical Lesion Patterns:
              </span>
              <ul className="space-y-1 text-[#4B5563]">
                {analysis.detectedSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#0F2F5C] font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Candidate Conditions with Confidence Band */}
            <div className="space-y-2">
              <span className="font-bold text-[#111827] block text-xs">
                Candidate Conditions (Confidence Bands):
              </span>
              <div className="space-y-1.5">
                {analysis.candidateConditions.map((cond, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-[#D1D5DB] flex items-center justify-between shadow-xs">
                    <div>
                      <strong className="text-[#111827] text-xs">{cond.name}</strong>
                      <span className="text-[10px] text-[#4B5563] block">{cond.relevance}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cond.confidence === 'High' 
                        ? 'bg-red-100 text-[#DC2626]' 
                        : cond.confidence === 'Medium' 
                        ? 'bg-amber-100 text-amber-900' 
                        : 'bg-slate-100 text-[#4B5563]'
                    }`}>
                      {cond.confidence} Confidence Band
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What to check next */}
            <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-lg space-y-1.5">
              <strong className="text-[#0F2F5C] text-xs flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#0F2F5C]" />
                <span>What to Check Next (Veterinary Protocol):</span>
              </strong>
              <ul className="space-y-1 text-[#0F2F5C] text-[11px] list-disc list-inside">
                {analysis.whatToCheckNext.map((check, idx) => (
                  <li key={idx}>{check}</li>
                ))}
              </ul>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="flex items-center space-x-2 text-[10px] text-[#4B5563] pt-1 border-t border-[#D1D5DB]">
              <Lock className="w-3 h-3 text-[#15803D]" />
              <span>{analysis.privacyGuarantee}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onApplySuggestions) onApplySuggestions(analysis);
                  onClose();
                }}
                className="btn-navy flex-1 py-2.5 rounded-lg text-xs font-bold cursor-pointer shadow-sm text-center"
              >
                Include in Triage Report
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer border border-[#D1D5DB]"
              >
                Dismiss
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
