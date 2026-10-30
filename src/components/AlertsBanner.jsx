import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Bell, BellRing, Volume2, VolumeX, X, ChevronRight, MapPin, CheckCircle } from 'lucide-react';
import { OUTBREAK_EPICENTERS, checkLocationOutbreakStatus, calculateDistanceKm } from '../data/outbreakData';

// Fallback coordinates for common mandals/villages
const LOCATION_CENTROIDS = {
  'Haveli': { lat: 18.5204, lng: 73.8567, district: 'Pune' },
  'Bakori': { lat: 18.5800, lng: 73.9800, district: 'Pune' },
  'Pune': { lat: 18.5204, lng: 73.8567, district: 'Pune' },
  'Karveer': { lat: 16.7050, lng: 74.2433, district: 'Kolhapur' },
  'Shiroli': { lat: 16.7400, lng: 74.2700, district: 'Kolhapur' },
  'Kolhapur': { lat: 16.7050, lng: 74.2433, district: 'Kolhapur' },
  'Sinnar': { lat: 19.8500, lng: 74.0000, district: 'Nashik' },
  'Nashik': { lat: 19.9975, lng: 73.7898, district: 'Nashik' },
  'Tenali': { lat: 16.2433, lng: 80.6400, district: 'Guntur' },
  'Guntur': { lat: 16.3067, lng: 80.4365, district: 'Guntur' },
  'Gannavaram': { lat: 16.5360, lng: 80.7960, district: 'Krishna' },
  'Krishna': { lat: 16.5062, lng: 80.6480, district: 'Krishna' },
  'Punganur': { lat: 13.3667, lng: 78.5833, district: 'Chittoor' },
  'Chittoor': { lat: 13.6288, lng: 79.4192, district: 'Chittoor' }
};

/**
 * Web Audio Synthesizer Chime
 * Generates an unobtrusive two-tone alert chime without external assets
 */
function playAlertChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2); // E5

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // Audio context may be restricted by browser policy before user interaction
  }
}

export default function AlertsBanner({ farmerUser, lang = 'en', dict = {}, onNavigate }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [pushPermission, setPushPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushSuccessMsg, setPushSuccessMsg] = useState('');

  // Proximity Detection Engine
  useEffect(() => {
    // Determine effective user location coordinates
    let userLat = 18.5204; // Default Pune/Haveli
    let userLng = 73.8567;

    const village = farmerUser?.village || 'Haveli';
    const district = farmerUser?.district || 'Pune';

    if (LOCATION_CENTROIDS[village]) {
      userLat = LOCATION_CENTROIDS[village].lat;
      userLng = LOCATION_CENTROIDS[village].lng;
    } else if (LOCATION_CENTROIDS[district]) {
      userLat = LOCATION_CENTROIDS[district].lat;
      userLng = LOCATION_CENTROIDS[district].lng;
    }

    const match = checkLocationOutbreakStatus(userLat, userLng);
    if (match) {
      setActiveAlert(match);
      if (soundEnabled && !isDismissed) {
        playAlertChime();
      }
    } else {
      // If direct proximity is outside 10 km, check district match
      const districtMatch = OUTBREAK_EPICENTERS.find(e => e.district.toLowerCase() === district.toLowerCase());
      if (districtMatch) {
        const dist = calculateDistanceKm(userLat, userLng, districtMatch.lat, districtMatch.lng);
        setActiveAlert({
          epicenter: districtMatch,
          distanceKm: dist || 14.5,
          zoneType: 'DISTRICT_ALERT',
          zoneRadius: 15.0,
          isHighDanger: false,
          status: districtMatch.status
        });
      } else {
        setActiveAlert(null);
      }
    }
  }, [farmerUser]);

  // Web Push Notification Request Handler
  const handleRequestPush = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop/push notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        setPushSuccessMsg('Push alerts activated! You will receive emergency quarantine advisories.');
        setTimeout(() => setPushSuccessMsg(''), 4000);

        // Fire initial verification notification
        const title = activeAlert?.epicenter 
          ? `PashuSuraksha Alert: ${activeAlert.epicenter.diseaseEn}`
          : 'PashuSuraksha Alert Network Active';
        
        const body = activeAlert?.epicenter 
          ? `Quarantine active in ${activeAlert.epicenter.mandal} Mandal (${activeAlert.distanceKm} km away). Tap for containment steps.`
          : 'You are now subscribed to verified district livestock disease alerts.';

        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'pashu-quarantine-alert'
        });
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  if (!activeAlert || isDismissed) return null;

  const { epicenter, distanceKm, zoneType, status } = activeAlert;
  const isConfirmed = status === 'CONFIRMED';
  const isInfectedZone = zoneType === 'INFECTED_ZONE';

  // Multi-lingual advisory text
  const localizedDisease = lang === 'mr' ? epicenter.diseaseMr : lang === 'hi' ? epicenter.diseaseHi : lang === 'te' ? epicenter.diseaseTe : epicenter.diseaseEn;
  const localizedAdvisory = epicenter.advisories[lang] || epicenter.advisories['en'];

  return (
    <aside 
      aria-label="Livestock Emergency Alert Banner"
      className={`border-b transition-all duration-300 ${
        isInfectedZone 
          ? 'bg-[#DC2626] text-white border-red-800' 
          : 'bg-[#0F2F5C] text-white border-blue-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Alert Header & Content */}
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-0.5 shrink-0">
              {isInfectedZone ? (
                <div className="relative">
                  <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                </div>
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${
                  isInfectedZone ? 'bg-white text-[#DC2626]' : 'bg-[#E07B00] text-white'
                }`}>
                  {isInfectedZone ? (dict?.infectedZoneAlert || '🚨 5 km Infected Zone Alert') : (dict?.surveillanceBufferAlert || '⚠️ 10 km Surveillance Buffer')}
                </span>

                {/* Confirmed vs Suspected Badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isConfirmed 
                    ? 'bg-black/30 text-green-300 border-green-400/50' 
                    : 'bg-black/30 text-yellow-300 border-yellow-400/50'
                }`}>
                  {isConfirmed ? (dict?.labConfirmed || '● Confirmed by Lab Test') : (dict?.suspectedInvestigation || '▲ Suspected / Field Investigation')}
                </span>

                {/* Confidentiality-Preserved Village Cluster Notice */}
                <span className="text-[11px] font-semibold opacity-90 flex items-center gap-1">
                  <MapPin className="w-3 h-3 inline" />
                  <span>Cluster: {epicenter.mandal} Mandal ({epicenter.district}) — approx {distanceKm} km away</span>
                </span>
              </div>

              {/* Multi-lingual advisory headline */}
              <p className="text-xs sm:text-sm font-bold leading-snug">
                <span className="underline decoration-yellow-400 decoration-2 underline-offset-2">
                  {localizedDisease}
                </span>: {localizedAdvisory}
              </p>

              <p className="text-[10px] text-white/80 italic">
                {dict?.confidentialityNotice || "*Farmer Confidentiality Enforced: Showing village-block level quarantine radius. Specific farm names remain strictly confidential."}
              </p>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            {/* View Interactive Outbreak Map Button */}
            <button
              onClick={() => onNavigate && onNavigate('/outbreak')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded border border-white/30 flex items-center space-x-1 cursor-pointer transition"
            >
              <span>{dict?.viewOutbreakMapBtn || 'View Outbreak Map'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Sound Chime Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute alert chime" : "Enable alert chime"}
              className="p-1.5 rounded hover:bg-white/20 text-white/90 cursor-pointer transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/50" />}
            </button>

            {/* Web Push Notification Opt-in */}
            {pushPermission !== 'granted' && (
              <button
                onClick={handleRequestPush}
                title="Enable Phone Push Alerts"
                className="bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-bold px-2.5 py-1.5 rounded flex items-center space-x-1 cursor-pointer transition shadow-xs"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{dict?.enablePushAlerts || 'Enable Push Alerts'}</span>
              </button>
            )}

            {/* Dismiss Banner */}
            <button
              onClick={() => setIsDismissed(true)}
              title="Dismiss banner"
              className="p-1 rounded hover:bg-white/20 text-white/80 cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {pushSuccessMsg && (
          <div className="mt-2 text-xs bg-green-900/90 text-green-200 px-3 py-1 rounded border border-green-600 flex items-center space-x-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-300" />
            <span>{pushSuccessMsg}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
