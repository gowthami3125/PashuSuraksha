import React, { useState } from 'react';
import { X, Mic, MicOff, AlertCircle, Play, Check, Activity, Volume2, Globe, Sparkles } from 'lucide-react';
import { quickVoicePhrases } from '../data/quickPhrasesData';
import { getTrans } from '../data/dictionary';
import { speakCustomText, stopAudioPlayback } from '../services/audioSpeaker';

export default function VoiceModal({ 
  showVoiceModal, 
  setShowVoiceModal, 
  isListening, 
  voiceTranscript, 
  setVoiceTranscript, 
  micVolumeLevel = 0, 
  micErrorNotice, 
  handleMicToggle, 
  finishVoiceRecordingAndTriage, 
  handleQuickPhraseSelect, 
  selectedSymptoms = [], 
  symptomsList = [], 
  lang = 'en', 
  dict = {}, 
  parseAndSelectSymptomsFromText,
  onLanguageChange
}) {
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);

  if (!showVoiceModal) return null;

  const currentLangCode = lang === 'mr' ? 'mr-IN' : lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  const langDisplayMap = {
    en: 'English (India - en-IN)',
    mr: 'मराठी (Marathi - mr-IN)',
    hi: 'हिंदी (Hindi - hi-IN)',
    te: 'తెలుగు (Telugu - te-IN)'
  };

  const handleTestAudio = (textToSpeak) => {
    if (isPlayingTestAudio) {
      stopAudioPlayback(setIsPlayingTestAudio);
    } else {
      speakCustomText(textToSpeak, lang, setIsPlayingTestAudio);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white border-2 border-[#0F2F5C] text-gray-900 w-full max-w-lg rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={() => {
            stopAudioPlayback(setIsPlayingTestAudio);
            finishVoiceRecordingAndTriage();
          }} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
          title="Close voice modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2F5C] text-white flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2F5C]">
              {dict.voiceModalTitle || 'Voice Symptom Assistant'}
            </h3>
          </div>
          <p className="text-xs text-gray-600 font-medium">
            {dict.voiceModalSubtitle || 'Speak symptoms in your local language or tap a quick phrase.'}
          </p>
        </div>

        {/* Language Selector Bar inside Voice Modal */}
        <div className="bg-[#F3F4F6] border border-gray-300 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0F2F5C]">
            <Globe className="w-4 h-4 text-[#E07B00]" />
            <span>{dict.voiceLangNotice || 'Voice Language'}:</span>
            <span className="font-mono text-gray-800">{langDisplayMap[lang] || lang}</span>
          </div>

          {onLanguageChange && (
            <div className="flex items-center space-x-1">
              {[
                { id: 'en', label: 'EN' },
                { id: 'mr', label: 'मराठी' },
                { id: 'hi', label: 'हिंदी' },
                { id: 'te', label: 'తెలుగు' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onLanguageChange(item.id)}
                  className={`px-2 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${
                    lang === item.id 
                      ? 'bg-[#0F2F5C] text-white shadow-xs' 
                      : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Microphone Console */}
        <div className={`border-2 rounded-2xl p-6 text-center space-y-4 transition-all duration-200 ${
          isListening 
            ? 'bg-red-50 border-[#DC2626] shadow-md shadow-red-100' 
            : 'bg-[#F9FAFB] border-gray-300'
        }`}>
          {/* Pulsing Mic Action Button */}
          <div className="relative inline-block">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-red-400 opacity-75 animate-ping" />
            )}
            <button
              onClick={handleMicToggle}
              className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto transition transform active:scale-95 shadow-lg cursor-pointer ${
                isListening 
                  ? 'bg-[#DC2626] text-white hover:bg-red-700 animate-pulse' 
                  : 'bg-[#0F2F5C] text-white hover:bg-[#0B2447]'
              }`}
              title={isListening ? 'Stop listening' : 'Start speaking'}
            >
              {isListening ? (
                <Mic className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-extrabold text-gray-900">
              {isListening ? (dict.tapToStop || 'Listening... Tap to Stop') : (dict.tapToSpeak || 'Tap Microphone to Speak')}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              Web Speech API active ({currentLangCode})
            </p>
          </div>

          {/* Real-Time Audio Volume Visualizer Bar */}
          {isListening && (
            <div className="w-full max-w-xs mx-auto space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-600">
                <span>{dict.micVolume || 'Mic Volume Level'}</span>
                <span className="font-mono text-[#DC2626]">{micVolumeLevel}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-300">
                <div 
                  className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 h-full rounded-full transition-all duration-75"
                  style={{ width: `${Math.max(12, micVolumeLevel)}%` }}
                />
              </div>
            </div>
          )}

          {/* Microphone Permission / Browser Notice */}
          {micErrorNotice && (
            <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-xs font-bold text-amber-900 text-left space-y-1 animate-fadeIn">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{micErrorNotice}</span>
              </div>
            </div>
          )}

          {/* Live Recognized Speech Transcript Box */}
          <div className="space-y-1.5 text-left pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] uppercase tracking-wider text-[#0F2F5C] font-extrabold flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-[#E07B00]" />
                <span>{dict.transcriptTitle || 'Recognized Voice Symptoms:'}</span>
              </label>
              {voiceTranscript && (
                <button
                  onClick={() => handleTestAudio(voiceTranscript)}
                  className="text-[11px] text-[#0F2F5C] hover:text-[#0B2447] font-bold flex items-center space-x-1 cursor-pointer"
                  title="Hear spoken transcript"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingTestAudio ? (dict.stopAudio || 'Stop') : (dict.readAloud || 'Listen')}</span>
                </button>
              )}
            </div>

            <textarea 
              rows={3}
              value={voiceTranscript}
              onChange={(e) => {
                const val = e.target.value;
                setVoiceTranscript(val);
                if (parseAndSelectSymptomsFromText) {
                  parseAndSelectSymptomsFromText(val);
                }
              }}
              placeholder={dict.transcriptPlaceholder || 'Speak symptoms (e.g. "Cow has fever, drooling, blisters") or type here...'}
              className="w-full bg-white border border-gray-300 p-3 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F2F5C] shadow-inner"
            />
          </div>

          {/* Detected Symptoms Badges */}
          {selectedSymptoms.length > 0 && (
            <div className="space-y-1.5 pt-1 text-left border-t border-gray-200">
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  {dict.detectedSymptomsCount || 'Detected Symptoms'} ({selectedSymptoms.length}):
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedSymptoms.map(sId => {
                  const symObj = symptomsList.find(s => s.id === sId);
                  const label = symObj ? getTrans(symObj, 'label', lang) : sId;
                  return (
                    <span 
                      key={sId} 
                      className="bg-[#0F2F5C] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1"
                    >
                      <span>✓</span>
                      <span>{label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Multi-Language Quick Phrases Presets */}
        <div className="space-y-2.5 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-gray-800 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E07B00]" />
              <span>{dict.quickPhrasesTitle || 'Or tap a 1-click test phrase below:'}</span>
            </span>
            <span className="text-[10px] bg-blue-50 text-[#0F2F5C] border border-blue-200 font-bold px-2 py-0.5 rounded-full">
              4 Voice Scenarios
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {quickVoicePhrases.map(phrase => {
              const phraseText = getTrans(phrase, 'text', lang) || phrase.textEn;
              return (
                <button
                  key={phrase.id}
                  onClick={() => {
                    if (handleQuickPhraseSelect) {
                      handleQuickPhraseSelect(phrase);
                    }
                  }}
                  className="w-full text-left bg-[#F9FAFB] hover:bg-blue-50/70 border border-gray-300 hover:border-[#0F2F5C] p-2.5 rounded-xl text-xs font-medium text-gray-900 transition flex items-center justify-between cursor-pointer group shadow-xs"
                >
                  <span className="group-hover:text-[#0F2F5C] font-bold flex items-center space-x-2">
                    <Play className="w-3.5 h-3.5 text-[#0F2F5C] fill-[#0F2F5C] shrink-0" />
                    <span>💬 "{phraseText}"</span>
                  </span>
                  <Check className="w-4 h-4 text-[#0F2F5C] shrink-0 ml-2 opacity-60 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Confirmation Button */}
        <div className="sticky bottom-0 bg-white pt-3 pb-1 z-10 border-t border-gray-200">
          <button
            onClick={() => {
              stopAudioPlayback(setIsPlayingTestAudio);
              finishVoiceRecordingAndTriage();
            }}
            className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-md flex items-center justify-center space-x-2"
          >
            <Activity className="w-4 h-4 text-[#E07B00]" />
            <span>
              {dict.finishVoiceTriageBtn || 'Confirm & Add Matched Symptoms'} ({selectedSymptoms.length > 0 ? selectedSymptoms.length : 0} {dict.detectedSymptomsCount || 'symptoms'})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
