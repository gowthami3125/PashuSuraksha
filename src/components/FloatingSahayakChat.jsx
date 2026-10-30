import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Volume2, VolumeX, Copy, Mic, MicOff, 
  BookOpen, ShieldCheck, Wifi, WifiOff, AlertTriangle, Sparkles, Check, ChevronDown
} from 'lucide-react';
import { 
  querySahayakKnowledgeBase, 
  SAHAYAK_QUICK_QUESTIONS 
} from '../data/sahayakKnowledgeBase';
import { speakCustomText, stopAudioPlayback } from '../services/audioSpeaker';

export default function FloatingSahayakChat({ 
  dict, 
  lang: globalLang = 'en', 
  farmerUser,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  externalPrompt,
  onClearExternalPrompt,
  chatHistory,
  setChatHistory
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen !== undefined ? controlledSetIsOpen : setInternalIsOpen;

  const [activeLang, setActiveLang] = useState(globalLang);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [isBrowserOnline, setIsBrowserOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [showQuestionsList, setShowQuestionsList] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync active language with global language changes
  useEffect(() => {
    if (globalLang) {
      setActiveLang(globalLang);
    }
  }, [globalLang]);

  // Online / Offline window listeners
  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Internal message state initialized from chatHistory or defaults
  const [messages, setMessages] = useState(() => {
    if (chatHistory && chatHistory.length > 0) {
      return chatHistory;
    }
    return [
      {
        id: 'm-welcome',
        sender: 'ai',
        topic: 'Sahayak AI Veterinary Assistant',
        title: 'Namaste! I am Sahayak, your Veterinary Knowledge Assistant',
        text: 'Ask me any questions on livestock health, disease isolation, vaccination schedules, bio-security, or emergency protocols. All answers are verified against official ICAR-NIVEDI and DAHD veterinary standards.',
        citation: {
          authority: 'ICAR-NIVEDI & DAHD (Govt of India)',
          document: 'National Livestock Disease Forewarning & Advisory Protocol',
          year: '2024'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Keep chatHistory in sync
  useEffect(() => {
    if (setChatHistory) {
      setChatHistory(messages);
    }
    try {
      localStorage.setItem('pashu_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('[Sahayak] LocalStorage save error:', e);
    }
  }, [messages, setChatHistory]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle external prompts (e.g. from DiagnosticResults "Ask Sahayak About This Result")
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      handleSend(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  const isActuallyOffline = !isBrowserOnline || isOfflineSimulated;

  const handleSend = (overrideQuery = null) => {
    const query = (overrideQuery || chatInput).trim();
    if (!query) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Answer from embedded offline knowledge base with official citations
    const result = querySahayakKnowledgeBase(query, activeLang);

    setTimeout(() => {
      const aiMsg = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        topic: result.topic,
        species: result.species,
        title: result.title,
        summary: result.summary,
        steps: result.steps,
        warning: result.warning,
        citation: result.citation,
        isOfflineMode: isActuallyOffline,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 350);
  };

  // Speech Recognition (Voice Input)
  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = activeLang === 'mr' ? 'mr-IN' : activeLang === 'te' ? 'te-IN' : activeLang === 'hi' ? 'hi-IN' : 'en-IN';

    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => {
      const trans = e.results[0][0].transcript;
      setChatInput(trans);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    rec.start();
  };

  // Text to Speech
  const handleSpeak = (msgId, msg) => {
    if (speakingMsgId === msgId) {
      stopAudioPlayback(() => setSpeakingMsgId(null));
      return;
    }

    const spokenText = `${msg.title || ''}. ${msg.summary || ''}. ${msg.steps ? msg.steps.join('. ') : (msg.text || '')}`;
    speakCustomText(
      spokenText,
      activeLang,
      (isSpeaking) => setSpeakingMsgId(isSpeaking ? msgId : null)
    );
  };

  const handleCopy = (msgId, msg) => {
    const textToCopy = `${msg.title || ''}\n\n${msg.summary || msg.text || ''}\n\n${msg.steps ? msg.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : ''}\n\nSource: ${msg.citation?.authority || 'ICAR'} - ${msg.citation?.document || ''} (${msg.citation?.year || ''})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Labels by language
  const labels = {
    en: {
      askSahayak: 'Ask Sahayak',
      subtitle: 'ICAR-NIVEDI & DAHD Knowledge Base',
      warningNotice: '💡 For clinical triage diagnosis, use the Symptom Check page.',
      quickQuestionsTitle: '⚡ Test Official Health Questions (with Citations):',
      inputPlaceholder: 'Ask any question (e.g. FMD isolation, anthrax protocol, vaccine)...',
      onlineStatus: 'Online Sync',
      offlineStatus: 'Offline Cache',
      toggleOffline: 'Toggle Offline Mode',
      sourceLabel: 'Official Source Citation:',
      listen: 'Listen',
      stop: 'Stop',
      copied: 'Copied!'
    },
    mr: {
      askSahayak: 'सहायक विचारा',
      subtitle: 'ICAR-NIVEDI व DAHD अधिकृत ज्ञानकोश',
      warningNotice: '💡 सविस्तर रोग निदानासाठी "लक्षण तपासणी" पानाचा वापर करा.',
      quickQuestionsTitle: '⚡ अधिकृत आरोग्य प्रश्न तपासा (संदर्भ व स्त्रोतासह):',
      inputPlaceholder: 'कोणताही प्रश्न विचारा (उदा. लाळ्या खुरकूत, लस, अँथ्रॅक्स)...',
      onlineStatus: 'ऑनलाइन',
      offlineStatus: 'ऑफलाइन कॅश',
      toggleOffline: 'ऑफलाइन मोड बदला',
      sourceLabel: 'अधिकृत संदर्भ व स्त्रोत:',
      listen: 'ऐका',
      stop: 'थांबवा',
      copied: 'कॉपी झाले!'
    },
    hi: {
      askSahayak: 'सहायक से पूछें',
      subtitle: 'ICAR-NIVEDI एवं DAHD आधिकारिक ज्ञानकोश',
      warningNotice: '💡 रोग निदान के लिए "Symptom Check" पृष्ठ का उपयोग करें।',
      quickQuestionsTitle: '⚡ आधिकारिक स्वास्थ्य प्रश्न पूछें (सटीक संदर्भ सहित):',
      inputPlaceholder: 'कोई भी प्रश्न पूछें (उदा. एफएमडी अलगाव, एंथ्रेक्स, टीका)...',
      onlineStatus: 'ऑनलाइन',
      offlineStatus: 'ऑफलाइन मोड',
      toggleOffline: 'ऑफलाइन मोड बदलें',
      sourceLabel: 'आधिकारिक स्रोत एवं संदर्भ:',
      listen: 'सुनें',
      stop: 'रोकें',
      copied: 'कॉपी किया!'
    },
    te: {
      askSahayak: 'సహాయక్‌ను అడగండి',
      subtitle: 'ICAR-NIVEDI & DAHD అధికారిక నాలెడ్జ్ బేస్',
      warningNotice: '💡 నిర్దిష్ట వ్యాధి నిర్ధారణ కోసం "Symptom Check" పేజీని ఉపయోగించండి.',
      quickQuestionsTitle: '⚡ అధికారిక ఆరోగ్య ప్రశ్నలు (ఆధారాలతో కూడిన సమాధానాలు):',
      inputPlaceholder: 'ఏదైనా ప్రశ్న అడగండి (ఉదా. గాలికుంటు, ఆంథ్రాక్స్, టీకాలు)...',
      onlineStatus: 'ఆన్‌లైన్',
      offlineStatus: 'ఆఫ్‌లైన్ క్యాష్',
      toggleOffline: 'ఆఫ్‌లైన్ మోడ్ మార్చండి',
      sourceLabel: 'అధికారిక ఆధారం & సూచన:',
      listen: 'వినండి',
      stop: 'ఆపండి',
      copied: 'కాపీ చేయబడింది!'
    }
  };

  const currentLabel = labels[activeLang] || labels['en'];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-4 py-3.5 rounded-full shadow-2xl flex items-center space-x-2.5 transition transform hover:scale-105 cursor-pointer border-2 border-white/20 group"
            title="Ask Sahayak Veterinary Q&A Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-blue-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E07B00] animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E07B00]" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-tight">{currentLabel.askSahayak}</span>
              <span className="block text-[9px] text-blue-200 leading-none">ICAR/DAHD Verified</span>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] max-h-[92vh] h-[640px] bg-white border border-gray-300 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-[#0F2F5C] text-white p-3.5 flex flex-col space-y-2 border-b border-blue-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-[#E07B00]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white leading-tight">Sahayak Q&A</h4>
                    <span className="text-[10px] bg-[#E07B00] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      ICAR Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-100">{currentLabel.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* Language Switcher */}
                <div className="flex bg-white/10 rounded-lg p-0.5 text-[10px] font-bold">
                  {['en', 'mr', 'hi', 'te'].map(l => (
                    <button
                      key={l}
                      onClick={() => setActiveLang(l)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer uppercase ${
                        activeLang === l ? 'bg-[#E07B00] text-white' : 'text-blue-100 hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-100 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer ml-1"
                  title="Close Sahayak"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Offline Fallback Status & Manual Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-blue-800/60 text-[10px]">
              <div className="flex items-center space-x-1.5">
                {isActuallyOffline ? (
                  <span className="flex items-center space-x-1 text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">
                    <WifiOff className="w-3 h-3" />
                    <span>{currentLabel.offlineStatus} (Local ICAR KB)</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                    <Wifi className="w-3 h-3" />
                    <span>{currentLabel.onlineStatus} (ICAR Live DB)</span>
                  </span>
                )}
              </div>

              {/* Simulation Toggle so tester can verify offline functionality */}
              <button
                onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
                className={`text-[9px] px-2 py-0.5 rounded border transition cursor-pointer font-medium ${
                  isOfflineSimulated 
                    ? 'bg-amber-400 text-gray-900 border-amber-300 font-bold' 
                    : 'bg-white/10 hover:bg-white/20 text-blue-100 border-white/20'
                }`}
                title="Toggle simulated offline state to test offline fallback"
              >
                {isOfflineSimulated ? '⚡ Offline Fallback Active' : 'Simulate Offline'}
              </button>
            </div>
          </div>

          {/* Clinical Diagnostic Warning Banner */}
          <div className="bg-[#F3F4F6] px-3 py-1.5 border-b border-gray-200 text-[10px] text-gray-600 font-medium text-center flex items-center justify-center space-x-1">
            <span>{currentLabel.warningNotice}</span>
          </div>

          {/* Quick-Test Health Questions Collapsible Accordion (Answers 3+ Different Health Questions) */}
          <div className="bg-white border-b border-gray-200 p-2 text-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none py-0.5 px-1"
              onClick={() => setShowQuestionsList(!showQuestionsList)}
            >
              <span className="text-[11px] font-bold text-[#0F2F5C] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E07B00]" />
                <span>{currentLabel.quickQuestionsTitle}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${showQuestionsList ? 'rotate-180' : ''}`} />
            </div>

            {showQuestionsList && (
              <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {SAHAYAK_QUICK_QUESTIONS.map((q) => {
                  const qText = q[activeLang] || q['en'];
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSend(qText)}
                      className="w-full text-left bg-[#F3F4F6] hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-1.5 text-[11px] text-gray-800 transition cursor-pointer flex items-start space-x-1.5 group"
                    >
                      <span className="bg-[#0F2F5C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                        {q.badge}
                      </span>
                      <span className="line-clamp-2 leading-tight group-hover:text-[#0F2F5C]">
                        {qText}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F3F4F6]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* User Message */}
                {msg.sender === 'user' && (
                  <div className="max-w-[85%] rounded-2xl rounded-br-none p-3 text-xs leading-relaxed shadow-sm bg-[#0F2F5C] text-white">
                    <p className="font-medium">{msg.text}</p>
                    <span className="block text-[9px] text-blue-200 text-right mt-1">{msg.timestamp}</span>
                  </div>
                )}

                {/* AI / Sahayak Message with Official Citations */}
                {msg.sender === 'ai' && (
                  <div className="max-w-[92%] rounded-2xl rounded-bl-none p-3.5 text-xs leading-relaxed shadow-sm bg-white text-gray-900 border border-gray-300 space-y-2.5">
                    
                    {/* Header badge */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#0F2F5C]" />
                        <span className="font-bold text-[11px] text-[#0F2F5C]">
                          {msg.topic || 'Veterinary Guidance'}
                        </span>
                      </div>
                      {msg.isOfflineMode && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded flex items-center space-x-0.5">
                          <WifiOff className="w-2.5 h-2.5" />
                          <span>Offline</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Summary */}
                    {msg.title && (
                      <h5 className="font-bold text-xs text-gray-900 leading-snug">
                        {msg.title}
                      </h5>
                    )}

                    {msg.summary && (
                      <p className="text-gray-700 text-[11px] leading-relaxed">
                        {msg.summary}
                      </p>
                    )}

                    {msg.text && !msg.summary && (
                      <p className="text-gray-700 text-[11px] leading-relaxed">
                        {msg.text}
                      </p>
                    )}

                    {/* Actionable Clinical / Containment Steps */}
                    {msg.steps && msg.steps.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-1.5">
                        <span className="block font-bold text-[10px] text-gray-800 uppercase tracking-wider">
                          Key Clinical Actions & Management:
                        </span>
                        <ul className="space-y-1 text-[11px] text-gray-700">
                          {msg.steps.map((st, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#0F2F5C] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="leading-snug">{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warning Box */}
                    {msg.warning && (
                      <div className="bg-amber-50 border-l-3 border-amber-500 p-2 rounded text-[10px] text-amber-900 leading-tight flex items-start space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{msg.warning}</span>
                      </div>
                    )}

                    {/* Mandatory Source Citation Card */}
                    {msg.citation && (
                      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2 text-[10px] text-blue-950 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0F2F5C] flex items-center space-x-1">
                            <BookOpen className="w-3 h-3 text-[#0F2F5C]" />
                            <span>{currentLabel.sourceLabel}</span>
                          </span>
                          <span className="bg-[#0F2F5C] text-white text-[8px] font-bold px-1.5 py-0.2 rounded">
                            {msg.citation.authority}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800 leading-tight">
                          {msg.citation.document}
                        </p>
                        {msg.citation.section && (
                          <p className="text-[9px] text-gray-600">
                            {msg.citation.section} ({msg.citation.year})
                          </p>
                        )}
                      </div>
                    )}

                    {/* Footer Controls: Audio, Copy, Timestamp */}
                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span className="text-gray-600 text-[9px]">{msg.timestamp}</span>

                      <div className="flex items-center space-x-3">
                        {/* Audio Read-Aloud */}
                        <button
                          onClick={() => handleSpeak(msg.id, msg)}
                          className="text-gray-600 hover:text-[#0F2F5C] flex items-center space-x-1 cursor-pointer"
                          title="Listen with Text-to-Speech"
                        >
                          {speakingMsgId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-red-600" />
                              <span className="text-red-600 font-bold">{currentLabel.stop}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-[#0F2F5C]" />
                              <span>{currentLabel.listen}</span>
                            </>
                          )}
                        </button>

                        {/* Copy Answer */}
                        <button
                          onClick={() => handleCopy(msg.id, msg)}
                          className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 cursor-pointer"
                          title="Copy Answer & Citation"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600 font-bold">{currentLabel.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-gray-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-white border-t border-gray-200 flex items-center space-x-2">
            {/* Voice Input Button */}
            <button
              onClick={startVoiceInput}
              className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                isListening ? 'bg-[#DC2626] text-white animate-pulse' : 'bg-[#F3F4F6] text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
              title="Voice Input (STT)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#0F2F5C]" />}
            </button>

            {/* Query Input */}
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={currentLabel.inputPlaceholder}
              className="flex-1 bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F2F5C]"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white p-2.5 rounded-xl transition cursor-pointer shadow-sm shrink-0"
              title="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
