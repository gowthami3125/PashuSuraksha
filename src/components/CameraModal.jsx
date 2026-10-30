import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, Loader2, UploadCloud, Video, CheckCircle, 
  RefreshCw, AlertCircle, Sparkles, Image as ImageIcon, Zap, Play
} from 'lucide-react';
import { sampleLesions } from '../data/quickPhrasesData';
import { getTrans } from '../data/dictionary';
import { compressImage, captureFromVideo, processVideoFile } from '../services/imageCompression';
import AIVisionSuggestionModal from './AIVisionSuggestionModal';

export default function CameraModal({ 
  showImageModal, 
  setShowImageModal, 
  onMediaCaptured,
  onApplyVisionSuggestions,
  species = 'cow',
  reportedSigns = [],
  lang, 
  dict = {} 
}) {
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [showVisionModal, setShowVisionModal] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera stream on unmount or close
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  const handleClose = () => {
    stopCameraStream();
    setPreviewMedia(null);
    setCameraError(null);
    setShowImageModal(false);
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      stopCameraStream();
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsLiveCameraActive(true);
    } catch (err) {
      console.warn("Camera access failed or denied:", err);
      setCameraError("Camera permission was denied or device camera is unavailable. Please use file upload below.");
      setIsLiveCameraActive(false);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    try {
      const compressed = captureFromVideo(videoRef.current, 1024, 1024, 0.72);
      setPreviewMedia(compressed);
      stopCameraStream();
    } catch (err) {
      setCameraError("Failed to capture snapshot from camera. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setIsProcessing(true);
    setCameraError(null);
    try {
      if (file.type.startsWith('video/')) {
        const videoData = await processVideoFile(file);
        setPreviewMedia(videoData);
      } else {
        const compressed = await compressImage(file, 1024, 1024, 0.72);
        setPreviewMedia(compressed);
      }
    } catch (err) {
      setCameraError("Error processing file for compression: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleSelectSample = (lesion) => {
    setIsProcessing(true);
    const mockCompressed = {
      dataUrl: lesion.image,
      originalSize: '2.8 MB',
      compressedSize: '164 KB',
      reductionPercent: 94,
      width: 800,
      height: 600,
      name: `${lesion.id}_clinical_lesion.jpg`,
      mimeType: 'image/jpeg',
      type: 'image',
      sampleId: lesion.id,
      title: lesion.titleEn,
      capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTimeout(() => {
      setPreviewMedia(mockCompressed);
      setIsProcessing(false);
    }, 250);
  };

  const handleConfirmAttach = () => {
    if (previewMedia && onMediaCaptured) {
      onMediaCaptured(previewMedia);
    }
    handleClose();
  };

  if (!showImageModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#D1D5DB] text-[#111827] w-full max-w-lg rounded-xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={handleClose} 
          className="absolute top-5 right-5 text-[#4B5563] hover:text-[#111827] p-2 rounded-lg bg-[#F3F4F6] cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#0F2F5C] text-white rounded-md">
              <Camera className="w-5 h-5 text-white" />
            </span>
            <h3 className="text-lg font-bold text-[#111827]">
              {dict.cameraModalTitle || 'Photo, Camera & Video Lesion Capture'}
            </h3>
          </div>
          <p className="text-xs text-[#4B5563]">
            Capture or upload livestock lesion photos/video. Automatically compressed (&lt;250 KB) for reliable 2G/3G transmission to veterinary officers.
          </p>
        </div>

        {/* LOADING STATE */}
        {isProcessing && (
          <div className="py-12 text-center space-y-3 bg-[#F3F4F6] rounded-xl border border-[#D1D5DB]">
            <Loader2 className="w-10 h-10 text-[#0F2F5C] animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#0F2F5C]">Compressing & Optimizing Media...</p>
              <p className="text-[11px] text-[#4B5563]">Generating high-clarity 1024px JPEG under 250 KB</p>
            </div>
          </div>
        )}

        {/* PREVIEW OF COMPRESSED PHOTO/VIDEO */}
        {!isProcessing && previewMedia && (
          <div className="space-y-4 bg-[#F3F4F6] p-4 rounded-xl border border-[#D1D5DB]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F2F5C] flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-[#15803D]" />
                <span>Media Ready to Attach</span>
              </span>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#D1D5DB] text-[#111827]">
                {previewMedia.type === 'video' ? 'VIDEO CLIP' : 'COMPRESSED PHOTO'}
              </span>
            </div>

            {/* Media Display */}
            <div className="relative rounded-lg overflow-hidden bg-black max-h-64 flex items-center justify-center border border-[#D1D5DB]">
              {previewMedia.type === 'video' ? (
                <video 
                  src={previewMedia.videoUrl} 
                  controls 
                  playsInline 
                  className="w-full max-h-64 object-contain"
                />
              ) : (
                <img 
                  src={previewMedia.dataUrl} 
                  alt="Captured Livestock Lesion" 
                  className="w-full max-h-64 object-contain"
                />
              )}
            </div>

            {/* Compression Metrics Banner */}
            <div className="bg-white p-3 rounded-lg border border-[#D1D5DB] text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#0F2F5C] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#E07B00]" />
                  <span>Compression Analysis:</span>
                </span>
                <span className="text-[#15803D] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  {previewMedia.reductionPercent > 0 ? `-${previewMedia.reductionPercent}% Reduced` : 'Optimized'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#4B5563] pt-1">
                <div>Original: <strong className="text-[#111827]">{previewMedia.originalSize || '2.4 MB'}</strong></div>
                <div>Compressed: <strong className="text-[#0F2F5C]">{previewMedia.compressedSize || '154 KB'}</strong></div>
                <div>Resolution: <strong className="text-[#111827]">{previewMedia.width ? `${previewMedia.width}×${previewMedia.height}` : 'Standard'}</strong></div>
              </div>
            </div>

            {/* AI Vision Lesion Suggestion Trigger Banner (Task 10) */}
            <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E07B00]" />
                  <span className="text-xs font-bold text-[#111827]">
                    AI Vision Lesion Check
                  </span>
                </div>
                <p className="text-[11px] text-[#4B5563]">
                  Detect visual markers (vesicles, dermal nodules, or udder inflammation)
                </p>
                <span className="inline-block text-[10px] font-bold text-[#0F2F5C] bg-blue-100/70 px-1.5 py-0.5 rounded">
                  AI suggestion — a vet will confirm
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowVisionModal(true)}
                className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-xs transition flex-shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Run Lesion Check</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="flex-1 bg-white hover:bg-gray-50 text-[#111827] border border-[#D1D5DB] font-bold py-2.5 rounded-lg text-xs cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#4B5563]" />
                <span>Retake / Choose Another</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmAttach}
                className="flex-1 btn-navy py-2.5 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5 text-white" />
                <span>Attach to Incident</span>
              </button>
            </div>
          </div>
        )}

        {/* CAPTURE / UPLOAD OPTIONS WHEN NO PREVIEW IS ACTIVE */}
        {!isProcessing && !previewMedia && (
          <div className="space-y-4">
            {isLiveCameraActive ? (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border-2 border-[#0F2F5C] shadow-md">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute bottom-3 inset-x-3 flex justify-between items-center bg-black/60 p-2 rounded-lg backdrop-blur-xs">
                  <button 
                    type="button"
                    onClick={stopCameraStream} 
                    className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Close Camera
                  </button>
                  <button 
                    type="button"
                    onClick={handleCaptureSnapshot} 
                    className="btn-navy text-xs font-bold px-4 py-2 rounded-lg shadow cursor-pointer flex items-center space-x-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Snapshot</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={startLiveCamera}
                  className="flex flex-col items-center justify-center space-y-2 bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold p-5 rounded-xl shadow transition cursor-pointer text-xs"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-sm">Open Live Camera</span>
                  <span className="text-[10px] text-blue-200">Take direct photo from phone or webcam</span>
                </button>

                <div className="space-y-2">
                  <label className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-[#111827] font-bold p-3.5 rounded-xl border border-[#D1D5DB] transition cursor-pointer text-xs">
                    <UploadCloud className="w-5 h-5 text-[#0F2F5C]" />
                    <span>Upload Photo (Image File)</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>

                  <label className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-[#111827] font-bold p-3.5 rounded-xl border border-[#D1D5DB] transition cursor-pointer text-xs">
                    <Video className="w-5 h-5 text-[#0F2F5C]" />
                    <span>Upload Video Clip (MP4/WebM)</span>
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="text-xs text-[#DC2626] font-bold bg-red-50 p-3 rounded-lg border border-red-200 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* CLINICAL SAMPLE LESION QUICK PICKS */}
            <div className="space-y-2 pt-2 border-t border-[#D1D5DB]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#0F2F5C]" />
                  <span>Or Pick From Verified Clinical Lesion Reference:</span>
                </span>
                <span className="text-[10px] text-[#4B5563]">Instant Mock Test</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sampleLesions.map(lesion => (
                  <div 
                    key={lesion.id} 
                    onClick={() => handleSelectSample(lesion)}
                    className="bg-[#F3F4F6] border border-[#D1D5DB] hover:border-[#0F2F5C] rounded-lg p-2 cursor-pointer transition text-center space-y-1.5 group"
                    title={`Select sample: ${lesion.titleEn}`}
                  >
                    <img 
                      src={lesion.image} 
                      alt={lesion.titleEn} 
                      className="w-full h-16 object-cover rounded-md group-hover:scale-102 transition" 
                    />
                    <span className="text-[10px] font-bold text-[#111827] line-clamp-1 block">
                      {getTrans(lesion, 'title', lang) || lesion.titleEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Vision Lesion Diagnostic Suggestion Modal (Section 4.C) */}
        <AIVisionSuggestionModal
          isOpen={showVisionModal}
          onClose={() => setShowVisionModal(false)}
          mediaDataUrl={previewMedia?.dataUrl}
          species={species}
          reportedSigns={reportedSigns}
          onApplySuggestions={(analysis) => {
            if (onApplyVisionSuggestions) {
              onApplyVisionSuggestions(analysis);
            }
          }}
        />
      </div>
    </div>
  );
}
