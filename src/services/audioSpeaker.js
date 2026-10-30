/**
 * Audio Speaker & Text-To-Speech (TTS) Service
 * PashuSuraksha Multilingual Audio System
 * Supported Locales:
 * - en: English (en-IN / en-US)
 * - mr: Marathi (mr-IN)
 * - hi: Hindi (hi-IN)
 * - te: Telugu (te-IN)
 */

export const LANG_LOCALE_MAP = {
  en: 'en-IN',
  mr: 'mr-IN',
  hi: 'hi-IN',
  te: 'te-IN'
};

export const LANG_LABELS = {
  en: 'English',
  mr: 'मराठी (Marathi)',
  hi: 'हिंदी (Hindi)',
  te: 'తెలుగు (Telugu)'
};

/**
 * Checks if Web Speech Synthesis is supported in the current browser
 */
export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

/**
 * Stops any ongoing speech synthesis audio playback safely
 */
export const stopAudioPlayback = (setIsSpeakingAudio) => {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      console.warn("Speech synthesis cancel exception:", e);
    }
  }
  if (setIsSpeakingAudio) setIsSpeakingAudio(false);
};

/**
 * Finds best available voice for requested language
 */
export const findBestVoiceForLang = (lang = 'en') => {
  if (!isSpeechSynthesisSupported()) return { voice: null, isNativeMatch: false };

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return { voice: null, isNativeMatch: false };

  const targetTag = (LANG_LOCALE_MAP[lang] || 'en-IN').toLowerCase();
  const langPrefix = lang.toLowerCase();

  // 1. Exact tag match (e.g. 'mr-IN', 'hi-IN', 'te-IN', 'en-IN')
  let match = voices.find(v => (v.lang || '').toLowerCase() === targetTag);
  if (match) return { voice: match, isNativeMatch: true };

  // 2. Exact match with dash/underscore (e.g. 'mr_IN')
  match = voices.find(v => (v.lang || '').toLowerCase().replace('_', '-') === targetTag);
  if (match) return { voice: match, isNativeMatch: true };

  // 3. Language prefix match (e.g. starts with 'mr', 'hi', 'te', 'en')
  match = voices.find(v => (v.lang || '').toLowerCase().startsWith(langPrefix));
  if (match) return { voice: match, isNativeMatch: true };

  // 4. Voice name heuristic check (e.g. voice name includes 'Marathi', 'Hindi', 'Telugu')
  const langName = (LANG_LABELS[lang] || '').toLowerCase();
  match = voices.find(v => (v.name || '').toLowerCase().includes(langPrefix) || (v.name || '').toLowerCase().includes(langName));
  if (match) return { voice: match, isNativeMatch: true };

  // 5. Fallback: Indian English voice or default browser voice
  const indianEn = voices.find(v => (v.lang || '').toLowerCase().includes('en-in'));
  if (indianEn) return { voice: indianEn, isNativeMatch: false };

  const defaultVoice = voices.find(v => v.default) || voices[0] || null;
  return { voice: defaultVoice, isNativeMatch: false };
};

/**
 * Inspects device TTS capabilities for a specific language
 */
export const checkVoiceSupport = (lang = 'en') => {
  if (!isSpeechSynthesisSupported()) {
    return {
      supported: false,
      hasNativeVoice: false,
      voiceName: null,
      langTag: LANG_LOCALE_MAP[lang] || 'en-IN',
      message: 'Browser does not support Web Speech Synthesis.'
    };
  }

  const { voice, isNativeMatch } = findBestVoiceForLang(lang);
  return {
    supported: true,
    hasNativeVoice: isNativeMatch,
    voiceName: voice ? voice.name : 'System Default',
    langTag: LANG_LOCALE_MAP[lang] || 'en-IN',
    message: isNativeMatch 
      ? `Native ${LANG_LABELS[lang] || lang} voice available (${voice.name})`
      : `Regional voice pack for ${LANG_LABELS[lang] || lang} not installed on this OS. Using fallback audio.`
  };
};

/**
 * Speaks arbitrary text in the user's selected language
 */
export const speakCustomText = (text, lang = 'en', setIsSpeakingAudio, onStatus) => {
  stopAudioPlayback(setIsSpeakingAudio);

  if (!text || !text.trim()) return;
  if (!isSpeechSynthesisSupported()) {
    if (onStatus) onStatus({ supported: false, error: 'Speech synthesis not supported in this browser' });
    return;
  }

  const execSpeak = () => {
    try {
      const targetLangTag = LANG_LOCALE_MAP[lang] || 'en-IN';
      const { voice, isNativeMatch } = findBestVoiceForLang(lang);

      if (setIsSpeakingAudio) setIsSpeakingAudio(true);

      if (onStatus) {
        onStatus({
          supported: true,
          hasNativeVoice: isNativeMatch,
          voiceName: voice?.name || 'Default',
          langTag: targetLangTag
        });
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLangTag;
      utterance.rate = 0.92; // Slightly calibrated rate for high rural comprehension
      utterance.pitch = 1.0;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        if (setIsSpeakingAudio) setIsSpeakingAudio(false);
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis utterance error:", e);
        if (setIsSpeakingAudio) setIsSpeakingAudio(false);
        if (onStatus) onStatus({ error: e });
      };

      // Slight timeout prevents speech engine freeze in Chrome/WebKit
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("speechSynthesis.speak failed:", err);
          if (setIsSpeakingAudio) setIsSpeakingAudio(false);
        }
      }, 50);
    } catch (err) {
      console.error("execSpeak error:", err);
      if (setIsSpeakingAudio) setIsSpeakingAudio(false);
    }
  };

  // If voices are not yet loaded (Chrome async quirk), wait for voiceschanged
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      execSpeak();
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    // Timeout safeguard if voiceschanged never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      execSpeak();
    }, 200);
  } else {
    execSpeak();
  }
};

/**
 * Speaks structured disease advisory guidance
 */
export const speakAdvisoryText = (diseaseObj, lang = 'en', setIsSpeakingAudio, onStatus) => {
  stopAudioPlayback(setIsSpeakingAudio);
  if (!diseaseObj) return;

  const nameEn = diseaseObj.nameEn || diseaseObj.name || '';
  const nameMr = diseaseObj.nameMr || nameEn;
  const nameHi = diseaseObj.nameHi || nameEn;
  const nameTe = diseaseObj.nameTe || nameEn;

  const prevEn = (diseaseObj.preventionEn || diseaseObj.prevention || '').split('\n')[0].replace(/^[•\-\*\s]+/, '');
  const prevMr = (diseaseObj.preventionMr || prevEn).split('\n')[0].replace(/^[•\-\*\s]+/, '');
  const prevHi = (diseaseObj.preventionHi || prevEn).split('\n')[0].replace(/^[•\-\*\s]+/, '');
  const prevTe = (diseaseObj.preventionTe || prevEn).split('\n')[0].replace(/^[•\-\*\s]+/, '');

  let spokenText = "";

  if (lang === 'mr') {
    spokenText = `ओळखलेला आजार: ${nameMr}। प्रतिबंधात्मक सल्ला: ${prevMr}। जनावराला तत्काळ वेगळे ठेवा आणि पशुवैद्यकीय अधिकाऱ्यांशी संपर्क साधा।`;
  } else if (lang === 'hi') {
    spokenText = `पहचानी गई बीमारी: ${nameHi}। रोकथाम की सलाह: ${prevHi}। बीमार पशु को तुरंत अलग रखें और पशु चिकित्सक से संपर्क करें।`;
  } else if (lang === 'te') {
    spokenText = `గుర్తించబడిన వ్యాధి: ${nameTe}। నివారణ సలహా: ${prevTe}। జంతువును వెంటనే వేరుగా ఉంచండి మరియు పశువైద్యుడిని సంప్రదించండి।`;
  } else {
    spokenText = `Detected condition: ${nameEn}. Prevention advice: ${prevEn}. Isolate sick animal immediately and consult the veterinary officer.`;
  }

  speakCustomText(spokenText, lang, setIsSpeakingAudio, onStatus);
};
